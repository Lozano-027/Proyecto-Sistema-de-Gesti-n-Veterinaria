/**
 * ============================================================
 * FILTRO GLOBAL DE EXCEPCIONES HTTP
 * ============================================================
 *
 * ¿QUÉ HACE?
 *   Captura TODAS las excepciones HTTP que ocurran en cualquier parte
 *   de la aplicación y las formatea en un JSON con estructura uniforme.
 *
 * ¿POR QUÉ ES NECESARIO?
 *   Sin este filtro, NestJS retornaría errores con formatos diferentes
 *   según el tipo de excepción. Con el filtro, el frontend SIEMPRE
 *   recibe el mismo formato de error, facilitando su manejo.
 *
 * FORMATO DE ERROR UNIFORME:
 *   {
 *     "statusCode": 404,
 *     "message": "Mascota con ID 99 no encontrada",
 *     "error": "NotFoundException",
 *     "path": "/api/v1/mascotas/99",
 *     "timestamp": "2026-04-06T10:30:00.000Z"
 *   }
 *
 * FLUJO:
 *   1. Un Controller o Service lanza una excepción (ej: throw new NotFoundException(...))
 *   2. NestJS intercepta la excepción y la pasa a este filtro
 *   3. El filtro extrae el código de estado y el mensaje
 *   4. Construye el JSON de respuesta y lo envía al cliente
 *
 * DECORADOR @Catch(HttpException):
 *   Le dice a NestJS que este filtro solo captura HttpException y sus subclases
 *   (NotFoundException, ConflictException, BadRequestException, etc.)
 */
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    // Obtener los objetos Request y Response de Express
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    // Obtener el código de estado HTTP (404, 409, 400, etc.)
    const status = exception.getStatus
      ? exception.getStatus()
      : HttpStatus.INTERNAL_SERVER_ERROR;

    // Extraer el mensaje de error (puede ser string o un objeto con .message)
    // Ejemplo: ValidationPipe retorna un array de mensajes; NotFoundException retorna un string
    const exceptionResponse = exception.getResponse();
    const message =
      typeof exceptionResponse === 'string'
        ? exceptionResponse
        : (exceptionResponse as any).message || 'Error interno del servidor';

    // Enviar la respuesta con formato uniforme
    response.status(status).json({
      statusCode: status,
      message,
      error: exception.name,
      path: request.url,
      timestamp: new Date().toISOString(),
    });
  }
}
