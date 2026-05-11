/**
 * ============================================================
 * PRUEBAS E2E — Sprint 5
 * ============================================================
 *
 * FILOSOFÍA:
 *   - Levantar la app real (igual que en producción) con todos los
 *     pipes, filtros e interceptores configurados como en main.ts.
 *   - Hacer peticiones HTTP reales con supertest.
 *   - Limpiar la base de datos antes y después para que las pruebas
 *     sean reproducibles.
 *
 * ¿POR QUÉ ESTE TEST EN UN SOLO ARCHIVO Y NO MUCHOS PEQUEÑOS?
 *   Las entidades del dominio están relacionadas en cadena:
 *     Propietario → Mascota → Cita → Tratamiento
 *     Mascota → HistorialClinico → Tratamiento
 *   Hacer cada test 100% aislado obligaría a recrear toda la cadena,
 *   lo cual hace los tests largos y lentos. Un único flujo end-to-end
 *   (descrito en orden), donde cada `it` valida un paso del flujo,
 *   es la forma más natural y fiel a cómo se usa el sistema.
 *
 * NOTA: requiere que la BD esté levantada (docker compose up db).
 *   Ejecutar:  npm run test:e2e
 */
import { Test } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { HttpExceptionFilter } from '../src/common/filters/http-exception.filter';
import { ResponseInterceptor } from '../src/common/interceptors/response.interceptor';
import { PrismaService } from '../src/prisma/prisma.service';

describe('Sistema de Gestión Veterinaria (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let server: any;

  // IDs creados durante los tests, los compartimos entre `it` para no
  // recrear toda la cadena en cada uno.
  let propietarioId: number;
  let mascotaId: number;
  let usuarioId: number;
  let citaId: number;
  let historialId: number;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();

    // Replicar EXACTAMENTE la configuración de main.ts.
    // Si esto se desincroniza con main.ts, los tests no reflejan el
    // comportamiento real de producción.
    app.setGlobalPrefix('api/v1');
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );
    app.useGlobalFilters(new HttpExceptionFilter());
    app.useGlobalInterceptors(new ResponseInterceptor());

    await app.init();
    server = app.getHttpServer();

    prisma = app.get(PrismaService);

    // Limpiar BD respetando el orden de FKs (hijos antes que padres).
    await prisma.tratamiento.deleteMany();
    await prisma.historialClinico.deleteMany();
    await prisma.cita.deleteMany();
    await prisma.mascota.deleteMany();
    await prisma.propietario.deleteMany();
    await prisma.usuario.deleteMany();
  });

  afterAll(async () => {
    // Limpiar al final también, para no dejar basura.
    await prisma.tratamiento.deleteMany();
    await prisma.historialClinico.deleteMany();
    await prisma.cita.deleteMany();
    await prisma.mascota.deleteMany();
    await prisma.propietario.deleteMany();
    await prisma.usuario.deleteMany();
    await app.close();
  });

  // ── PROPIETARIOS ────────────────────────────────────────
  describe('Propietarios', () => {
    it('POST /propietarios — crea un propietario', async () => {
      const res = await request(server)
        .post('/api/v1/propietarios')
        .send({
          nombres: 'María Camila',
          apellidos: 'Rodríguez',
          telefono: '3201234567',
          correo: 'maria.rod@test.co',
          direccion: 'Calle 15 #4-23',
        })
        .expect(201);

      // Formato uniforme del ResponseInterceptor
      expect(res.body).toHaveProperty('statusCode', 201);
      expect(res.body).toHaveProperty('message', 'OK');
      expect(res.body.data).toHaveProperty('id');
      expect(res.body.data.correo).toBe('maria.rod@test.co');
      propietarioId = res.body.data.id;
    });

    it('POST /propietarios — rechaza correo duplicado (409)', async () => {
      const res = await request(server)
        .post('/api/v1/propietarios')
        .send({
          nombres: 'Otro',
          apellidos: 'Cliente',
          telefono: '3000000000',
          correo: 'maria.rod@test.co', // mismo correo
          direccion: 'Otra dirección',
        })
        .expect(409);

      expect(res.body.statusCode).toBe(409);
      expect(res.body.message).toMatch(/correo/i);
    });

    it('POST /propietarios — rechaza body inválido (400)', async () => {
      await request(server)
        .post('/api/v1/propietarios')
        .send({ nombres: 'Solo nombre' }) // faltan campos requeridos
        .expect(400);
    });

    it('GET /propietarios — lista propietarios', async () => {
      const res = await request(server).get('/api/v1/propietarios').expect(200);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.data.length).toBeGreaterThan(0);
    });
  });

  // ── USUARIOS (veterinarios) ─────────────────────────────
  describe('Usuarios', () => {
    it('POST /usuarios — crea un veterinario', async () => {
      const res = await request(server)
        .post('/api/v1/usuarios')
        .send({
          nombre: 'Dr. Carlos López',
          correo: 'carlos.lopez@vet.test',
          rol: 'veterinario',
        })
        .expect(201);

      expect(res.body.data.rol).toBe('veterinario');
      usuarioId = res.body.data.id;
    });

    it('POST /usuarios — rechaza rol inválido (400)', async () => {
      await request(server)
        .post('/api/v1/usuarios')
        .send({
          nombre: 'X',
          correo: 'x@y.co',
          rol: 'pirata', // no permitido
        })
        .expect(400);
    });
  });

  // ── MASCOTAS ────────────────────────────────────────────
  describe('Mascotas', () => {
    it('POST /mascotas — crea una mascota asociada al propietario', async () => {
      const res = await request(server)
        .post('/api/v1/mascotas')
        .send({
          nombre: 'Firulais',
          especie: 'Perro',
          raza: 'Labrador',
          fechaNacimiento: '2020-05-10',
          propietarioId,
        })
        .expect(201);

      expect(res.body.data.nombre).toBe('Firulais');
      expect(res.body.data.propietarioId).toBe(propietarioId);
      mascotaId = res.body.data.id;
    });

    it('POST /mascotas — rechaza propietarioId inexistente (404)', async () => {
      await request(server)
        .post('/api/v1/mascotas')
        .send({
          nombre: 'Fantasma',
          especie: 'Gato',
          raza: 'Mestizo',
          fechaNacimiento: '2022-01-01',
          propietarioId: 999999,
        })
        .expect(404);
    });

    it('GET /mascotas/propietario/:id — lista mascotas del propietario', async () => {
      const res = await request(server)
        .get(`/api/v1/mascotas/propietario/${propietarioId}`)
        .expect(200);
      expect(res.body.data.length).toBe(1);
      expect(res.body.data[0].id).toBe(mascotaId);
    });
  });

  // ── CITAS (regla crítica: disponibilidad horaria) ──────
  describe('Citas — validación de disponibilidad', () => {
    it('POST /citas — crea una cita', async () => {
      const res = await request(server)
        .post('/api/v1/citas')
        .send({
          mascotaId,
          usuarioId,
          fecha: '2026-08-15',
          hora: '14:30',
          motivo: 'Vacunación',
        })
        .expect(201);

      expect(res.body.data.estado).toBe('programada');
      citaId = res.body.data.id;
    });

    it('POST /citas — rechaza conflicto del MISMO veterinario en fecha+hora (409)', async () => {
      // Misma fecha+hora, mismo veterinario, mascota distinta no importa
      // (en este test ni siquiera necesitamos otra mascota porque el
      // conflict por veterinario se dispara primero).
      const res = await request(server)
        .post('/api/v1/citas')
        .send({
          mascotaId, // misma mascota — choca también
          usuarioId,
          fecha: '2026-08-15',
          hora: '14:30',
          motivo: 'Otro motivo',
        })
        .expect(409);

      expect(res.body.message).toMatch(/veterinario|mascota/i);
    });

    it('POST /citas — permite la MISMA fecha+hora si la cita previa está cancelada', async () => {
      // 1) Cancelar la cita existente
      await request(server)
        .put(`/api/v1/citas/${citaId}`)
        .send({ estado: 'cancelada' })
        .expect(200);

      // 2) Intentar crear otra en la misma franja → ahora debe permitirla
      const res = await request(server)
        .post('/api/v1/citas')
        .send({
          mascotaId,
          usuarioId,
          fecha: '2026-08-15',
          hora: '14:30',
          motivo: 'Reagendada',
        })
        .expect(201);

      citaId = res.body.data.id; // Actualizar para tests siguientes
    });

    it('POST /citas — rechaza hora con formato inválido (400)', async () => {
      await request(server)
        .post('/api/v1/citas')
        .send({
          mascotaId,
          usuarioId,
          fecha: '2026-09-01',
          hora: '25:99', // inválido
          motivo: 'Test',
        })
        .expect(400);
    });
  });

  // ── HISTORIAL CLÍNICO (regla crítica: unicidad mascota+fecha) ──
  describe('Historial Clínico — unicidad y paginación', () => {
    it('POST /historial-clinico — crea un historial', async () => {
      const res = await request(server)
        .post('/api/v1/historial-clinico')
        .send({
          mascotaId,
          fecha: '2026-04-15',
          diagnostico: 'Otitis externa',
          observaciones: 'Aplicar gotas óticas',
        })
        .expect(201);

      historialId = res.body.data.id;
    });

    it('POST /historial-clinico — rechaza duplicado mascota+fecha (409)', async () => {
      const res = await request(server)
        .post('/api/v1/historial-clinico')
        .send({
          mascotaId,
          fecha: '2026-04-15', // misma fecha, misma mascota
          diagnostico: 'Otra cosa',
        })
        .expect(409);

      expect(res.body.message).toMatch(/historial.*fecha/i);
    });

    it('GET /historial-clinico/mascota/:id — paginación devuelve meta', async () => {
      // Crear unos historiales más para probar la paginación
      const fechas = ['2026-04-16', '2026-04-17', '2026-04-18'];
      for (const f of fechas) {
        await request(server)
          .post('/api/v1/historial-clinico')
          .send({ mascotaId, fecha: f, diagnostico: `Control ${f}` })
          .expect(201);
      }

      const res = await request(server)
        .get(`/api/v1/historial-clinico/mascota/${mascotaId}?page=1&limit=2`)
        .expect(200);

      expect(res.body.data).toHaveProperty('items');
      expect(res.body.data).toHaveProperty('meta');
      expect(res.body.data.items.length).toBe(2);
      expect(res.body.data.meta.total).toBe(4); // 1 + 3 creados
      expect(res.body.data.meta.totalPages).toBe(2);
    });
  });

  // ── TRATAMIENTOS ────────────────────────────────────────
  describe('Tratamientos', () => {
    it('POST /tratamientos — rechaza si no se asocia a cita ni historial (400)', async () => {
      await request(server)
        .post('/api/v1/tratamientos')
        .send({
          medicamento: 'Algo',
          dosis: '1 tableta',
          duracion: '5 días',
        })
        .expect(400);
    });

    it('POST /tratamientos — crea tratamiento asociado a cita', async () => {
      await request(server)
        .post('/api/v1/tratamientos')
        .send({
          citaId,
          medicamento: 'Amoxicilina 500mg',
          dosis: '1 tableta cada 8h',
          duracion: '7 días',
        })
        .expect(201);
    });

    it('POST /tratamientos — crea tratamiento asociado a historial', async () => {
      await request(server)
        .post('/api/v1/tratamientos')
        .send({
          historialClinicoId: historialId,
          medicamento: 'Otitex gotas',
          dosis: '2 gotas en cada oído',
          duracion: '7 días',
          indicaciones: 'Mantener seco',
        })
        .expect(201);
    });
  });

  // ── REPORTES (Sprint 5) ─────────────────────────────────
  describe('Reportes — endpoints del Sprint 5', () => {
    it('GET /reportes/resumen — devuelve los conteos', async () => {
      const res = await request(server)
        .get('/api/v1/reportes/resumen')
        .expect(200);
      expect(res.body.data).toMatchObject({
        totalPropietarios: expect.any(Number),
        totalMascotas: expect.any(Number),
        totalCitas: expect.any(Number),
        totalHistoriales: expect.any(Number),
      });
      expect(res.body.data.totalMascotas).toBeGreaterThanOrEqual(1);
    });

    it('GET /reportes/citas — sin filtros retorna todas', async () => {
      const res = await request(server)
        .get('/api/v1/reportes/citas')
        .expect(200);
      expect(Array.isArray(res.body.data)).toBe(true);
    });

    it('GET /reportes/citas — filtra por estado', async () => {
      const res = await request(server)
        .get('/api/v1/reportes/citas?estado=programada')
        .expect(200);
      // Todas las citas retornadas deben estar programadas
      for (const c of res.body.data) {
        expect(c.estado).toBe('programada');
      }
    });

    it('GET /reportes/citas — filtra por rango de fechas', async () => {
      const res = await request(server)
        .get(
          '/api/v1/reportes/citas?fechaInicio=2026-08-01&fechaFin=2026-08-31',
        )
        .expect(200);
      for (const c of res.body.data) {
        const f = new Date(c.fecha);
        expect(f.getTime()).toBeGreaterThanOrEqual(
          new Date('2026-08-01').getTime(),
        );
      }
    });

    it('GET /reportes/citas — rechaza estado inválido (400)', async () => {
      await request(server)
        .get('/api/v1/reportes/citas?estado=pirata')
        .expect(400);
    });

    it('GET /reportes/historial-completo/:mascId — devuelve mascota + historiales + citas + tratamientos', async () => {
      const res = await request(server)
        .get(`/api/v1/reportes/historial-completo/${mascotaId}`)
        .expect(200);

      const mascota = res.body.data;
      expect(mascota.id).toBe(mascotaId);
      expect(mascota.propietario).toBeDefined();
      expect(Array.isArray(mascota.historiales)).toBe(true);
      expect(Array.isArray(mascota.citas)).toBe(true);

      // El historial creado tiene tratamientos
      const hist = mascota.historiales.find((h: any) => h.id === historialId);
      expect(hist).toBeDefined();
      expect(hist.tratamientos.length).toBeGreaterThanOrEqual(1);

      // La cita activa tiene tratamientos
      const cita = mascota.citas.find((c: any) => c.id === citaId);
      expect(cita).toBeDefined();
      expect(cita.tratamientos.length).toBeGreaterThanOrEqual(1);
      expect(cita.usuario).toBeDefined();
    });

    it('GET /reportes/historial-completo/:mascId — 404 si no existe', async () => {
      await request(server)
        .get('/api/v1/reportes/historial-completo/999999')
        .expect(404);
    });
  });
});
