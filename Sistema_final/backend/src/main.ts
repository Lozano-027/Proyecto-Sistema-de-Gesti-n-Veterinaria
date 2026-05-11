/**
 * ============================================================
 * PUNTO DE ENTRADA DE LA APLICACIÓN NESTJS
 * ============================================================
 *
 * Este archivo configura y arranca el servidor HTTP del backend.
 *
 * FLUJO DE ARRANQUE:
 *   1. NestFactory crea la aplicación a partir de AppModule (módulo raíz).
 *   2. Se establece el prefijo global "api/v1" → todas las rutas serán /api/v1/...
 *   3. Se habilita CORS para que el frontend (puerto 3000) pueda hacer peticiones.
 *   4. Se configura el ValidationPipe global para validar DTOs automáticamente.
 *   5. Se registran el filtro de excepciones y el interceptor de respuesta.
 *   6. Se escucha en el puerto 3001 (o variable de entorno PORT).
 *
 * CONCEPTOS CLAVE PARA ENTENDER:
 *   - ValidationPipe: Valida automáticamente los datos del body según los DTOs.
 *     - whitelist: true       → Elimina propiedades que NO estén en el DTO.
 *     - forbidNonWhitelisted  → Si envían propiedades extra, retorna error 400.
 *     - transform: true       → Convierte tipos automáticamente (string→number).
 *   - HttpExceptionFilter: Captura errores y los formatea en JSON uniforme.
 *   - ResponseInterceptor: Envuelve las respuestas exitosas en { statusCode, message, data }.
 *   - CORS: Permite que el navegador haga peticiones cross-origin al backend.
 */
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';

async function bootstrap() {
  // 1. Crear la instancia de la aplicación NestJS
  const app = await NestFactory.create(AppModule);

  // 2. Prefijo global: todas las rutas quedan bajo /api/v1/
  //    Ejemplo: PropietariosController con @Controller('propietarios') → /api/v1/propietarios
  app.setGlobalPrefix('api/v1');

  // 3. CORS: Permitir peticiones desde el frontend (Next.js en puerto 3000)
  //    Sin esto, el navegador bloquearía las peticiones por política de mismo origen.
  app.enableCors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  // 4. Pipe de validación global: valida TODOS los DTOs automáticamente
  //    Usa las anotaciones de class-validator (@IsString, @IsEmail, etc.)
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,            // Elimina campos que no estén definidos en el DTO
      forbidNonWhitelisted: true, // Retorna error 400 si envían campos extra
      transform: true,            // Convierte tipos (ej.: "1" → 1 para @IsInt)
    }),
  );

  // 5. Filtro global de excepciones: formatea TODOS los errores HTTP
  app.useGlobalFilters(new HttpExceptionFilter());

  // 6. Interceptor global de respuesta: envuelve respuestas en formato uniforme
  app.useGlobalInterceptors(new ResponseInterceptor());

  // 7. Arrancar el servidor en el puerto configurado
  const port = process.env.PORT || 3001;
  await app.listen(port);
  console.log(`🚀 Backend Veterinaria corriendo en: http://localhost:${port}/api/v1`);
}
bootstrap();
