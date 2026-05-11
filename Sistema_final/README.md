# 🐾 Sistema de Gestión Veterinaria

> Proyecto full-stack — Programación Web 2026A
> **Sin autenticación JWT** (omitida intencionalmente)

## 🛠 Stack Tecnológico

| Capa             | Tecnología                          |
| ---------------- | ----------------------------------- |
| Backend          | NestJS 10 (Node.js + TypeScript)    |
| Frontend         | Next.js 15 (React 19 + TypeScript)  |
| Base de Datos    | PostgreSQL 16                       |
| ORM              | Prisma 7 + `@prisma/adapter-pg`     |
| Contenedores     | Docker + Docker Compose             |
| Validación       | class-validator + class-transformer |
| Estilos          | Tailwind CSS 3                      |
| Pruebas          | Jest 29 + Supertest                 |

## 🏗 Arquitectura en Capas

```
Cliente HTTP → Controller → Service → Repository → Prisma → PostgreSQL
```

Cada módulo del backend sigue esta separación estricta:

- **Controller**: enruta HTTP, valida tipos en parámetros (`ParseIntPipe`).
- **Service**: orquesta reglas de negocio, lanza excepciones HTTP.
- **Repository**: encapsula consultas Prisma, no conoce HTTP.

## 📊 Modelo de Datos

```
Usuario           1 ──── N  Cita
Propietario       1 ──── N  Mascota
Mascota           1 ──── N  Cita
Mascota           1 ──── N  HistorialClinico
Cita              1 ──── N  Tratamiento
HistorialClinico  1 ──── N  Tratamiento
```

| Entidad           | Campos principales                                                              |
| ----------------- | ------------------------------------------------------------------------------- |
| Usuario           | id, nombre, correo (unique), rol (`veterinario` \| `admin`)                     |
| Propietario       | id, nombres, apellidos, telefono, correo (unique), direccion                    |
| Mascota           | id, nombre, especie, raza, fechaNacimiento, propietarioId                       |
| Cita              | id, mascotaId, usuarioId, fecha, hora, motivo, estado                           |
| HistorialClinico  | id, mascotaId, fecha, diagnostico, observaciones (unique: mascotaId + fecha)    |
| Tratamiento       | id, historialClinicoId?, citaId?, medicamento, dosis, duracion, indicaciones    |

## 🚀 Sprints completados

| Sprint | Alcance                                                                  |
| ------ | ------------------------------------------------------------------------ |
| 1 ✅    | Docker + Prisma + Usuario + Propietario                                  |
| 2 ✅    | Mascota + Cita (validación de disponibilidad) + Common Module            |
| 3 ✅    | HistorialClinico (unicidad mascotaId+fecha) + paginación + frontend base |
| 4 ✅    | Tratamientos + Dashboard + Layout responsivo                             |
| 5 ✅    | Reportes con filtros + historial completo + Pruebas E2E + Docker final   |

## ⚙ Instalación y Ejecución

### Prerrequisitos
- Docker y Docker Compose
- Git

### Pasos
```bash
# 1. Clonar el repositorio
git clone <URL_DEL_REPO>
cd Proyecto-Sistema-de-Gestion-Veterinaria

# 2. Variables de entorno
cp .env.example .env

# 3. Levantar todos los servicios
docker compose up -d

# 4. (Opcional) Ver logs del backend
docker compose logs -f backend
```

### URLs
| Servicio   | URL                              |
| ---------- | -------------------------------- |
| Frontend   | http://localhost:3000            |
| Backend    | http://localhost:3001/api/v1     |
| PostgreSQL | localhost:5432                   |

### Validación final con Docker Compose en entorno limpio (Sprint 5)
```bash
# Apagar todo y BORRAR la base de datos (volúmenes)
docker compose down -v

# Levantar desde cero
docker compose up --build -d

# Verificar que las migraciones corrieron y el servicio está vivo
docker compose logs backend | grep -E "(migrate|corriendo)"
curl http://localhost:3001/api/v1/reportes/resumen
```

## 🧪 Pruebas E2E

Las pruebas E2E (`backend/test/app.e2e-spec.ts`) cubren el flujo completo:
**Propietario → Mascota → Usuario → Cita → Historial → Tratamiento → Reportes**.

Validan:

- Formato uniforme de respuestas (`{ statusCode, message, data }`).
- 409 al duplicar correo / historial mascota+fecha.
- 400 al enviar bodies inválidos o estados inexistentes.
- 404 al referenciar entidades inexistentes (FK).
- **Validación de disponibilidad horaria**: misma cita rechazada, cita liberada al cancelar.
- **Paginación de historial**: estructura `{ items, meta }`.
- **Reportes con filtros**: estado, rango de fechas.
- **Historial completo**: estructura anidada con tratamientos.

### Ejecutar las pruebas

```bash
# Asegurarse de tener BD lista (puede ser la del compose)
docker compose up -d db

# Desde la carpeta backend
cd backend
npm install
DATABASE_URL=postgresql://admin:admin123@localhost:5432/veterinaria_db \
  npx prisma migrate deploy

DATABASE_URL=postgresql://admin:admin123@localhost:5432/veterinaria_db \
  npm run test:e2e
```

> ⚠️ Las pruebas **borran las tablas de la BD** al inicio y al final.
> Úsala con la BD de desarrollo/test, **NO con datos reales**.

## 📡 Endpoints principales

### Sprint 1
| Método  | Ruta                              | Descripción                |
| ------- | --------------------------------- | -------------------------- |
| GET/POST/PUT/DELETE | `/api/v1/usuarios`        | CRUD usuarios              |
| GET/POST/PUT/DELETE | `/api/v1/propietarios`    | CRUD propietarios          |

### Sprint 2
| Método  | Ruta                                        | Descripción                              |
| ------- | ------------------------------------------- | ---------------------------------------- |
| GET/POST/PUT/DELETE | `/api/v1/mascotas`                  | CRUD mascotas                            |
| GET     | `/api/v1/mascotas/propietario/:id`          | Mascotas de un propietario               |
| GET/POST/PUT/DELETE | `/api/v1/citas`                     | CRUD citas (valida disponibilidad)       |
| GET     | `/api/v1/citas/mascota/:id`                 | Citas de una mascota                     |

### Sprint 3
| Método  | Ruta                                                  | Descripción                            |
| ------- | ----------------------------------------------------- | -------------------------------------- |
| GET/POST/PUT/DELETE | `/api/v1/historial-clinico`                   | CRUD historial clínico                 |
| GET     | `/api/v1/historial-clinico/mascota/:id?page=&limit=`  | Historial paginado por mascota         |

### Sprint 4
| Método  | Ruta                                            | Descripción                  |
| ------- | ----------------------------------------------- | ---------------------------- |
| GET/POST/PUT/DELETE | `/api/v1/tratamientos`                  | CRUD tratamientos            |
| GET     | `/api/v1/tratamientos/cita/:id`                 | Tratamientos de una cita     |
| GET     | `/api/v1/tratamientos/historial/:id`            | Tratamientos de un historial |
| GET     | `/api/v1/reportes/resumen`                      | Conteos para el dashboard    |
| GET     | `/api/v1/reportes/proximas-citas?limit=`        | Próximas N citas             |

### Sprint 5
| Método  | Ruta                                                                          | Descripción                                |
| ------- | ----------------------------------------------------------------------------- | ------------------------------------------ |
| GET     | `/api/v1/reportes/citas?fechaInicio=&fechaFin=&usuarioId=&estado=`            | Reporte de citas con filtros               |
| GET     | `/api/v1/reportes/historial-completo/:mascId`                                 | Mascota + historiales + citas + tratam.    |

## 📦 Formato de respuesta uniforme

**Éxito:**
```json
{ "statusCode": 200, "message": "OK", "data": { ... } }
```

**Error:**
```json
{
  "statusCode": 404,
  "message": "Mascota con ID 99 no encontrada",
  "error": "NotFoundException",
  "path": "/api/v1/mascotas/99",
  "timestamp": "2026-04-06T10:30:00.000Z"
}
```

## 🚦 Reglas de negocio implementadas

1. **Disponibilidad horaria de citas** (Sprint 2)
   No puede haber dos citas no-canceladas para el mismo veterinario o la misma
   mascota en la misma fecha+hora.

2. **Unicidad de historial clínico** (Sprint 3)
   No puede haber dos historiales para la misma mascota en la misma fecha
   (constraint `@@unique([mascotaId, fecha])`).

3. **Asociación mínima del tratamiento** (Sprint 4)
   Todo tratamiento debe asociarse a una cita o a un historial clínico
   (al menos uno).

4. **Cascada FK protegida**
   - No se puede eliminar un propietario con mascotas.
   - No se puede eliminar una mascota con citas o historial.
   - Los tratamientos se quedan huérfanos (`ON DELETE SET NULL`) si se borra
     su cita o historial — el dato del tratamiento no se pierde.

## 🗂 Estructura del proyecto

```
veterinaria/
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma
│   │   └── migrations/
│   ├── src/
│   │   ├── common/                   # Filtros + Interceptores globales
│   │   ├── prisma/                   # PrismaService global
│   │   ├── modules/
│   │   │   ├── usuarios/
│   │   │   ├── propietarios/
│   │   │   ├── mascotas/
│   │   │   ├── citas/
│   │   │   ├── historial-clinico/
│   │   │   ├── tratamientos/
│   │   │   └── reportes/
│   │   ├── app.module.ts
│   │   └── main.ts
│   ├── test/
│   │   ├── app.e2e-spec.ts
│   │   └── jest-e2e.json
│   ├── Dockerfile
│   ├── entrypoint.sh
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── (dashboard)/          # Route group
│   │   │   │   ├── dashboard/
│   │   │   │   ├── propietarios/
│   │   │   │   ├── mascotas/
│   │   │   │   ├── citas/
│   │   │   │   ├── historial/
│   │   │   │   ├── tratamientos/
│   │   │   │   ├── reportes/
│   │   │   │   └── layout.tsx
│   │   │   ├── globals.css
│   │   │   ├── layout.tsx
│   │   │   └── page.tsx
│   │   ├── components/
│   │   │   ├── layout/
│   │   │   │   ├── Sidebar.tsx       # Drawer móvil + fijo desktop
│   │   │   │   └── Header.tsx
│   │   │   └── StatCard.tsx
│   │   ├── interfaces/
│   │   ├── services/
│   │   └── lib/
│   │       └── api.ts                # Cliente HTTP
│   ├── Dockerfile
│   └── package.json
├── docker-compose.yml
├── .env.example
└── README.md
```
