/**
 * ============================================================
 * INTERCEPTOR GLOBAL DE RESPUESTA
 * ============================================================
 *
 * ¿QUÉ HACE?
 *   Envuelve TODAS las respuestas exitosas de la API en un formato
 *   uniforme antes de enviarlas al cliente.
 *
 * ¿POR QUÉ ES NECESARIO?
 *   Sin el interceptor, cada endpoint retornaría directamente el dato
 *   (un array, un objeto, etc.). Con el interceptor, el frontend
 *   SIEMPRE recibe la misma estructura, simplificando el manejo.
 *
 * FORMATO DE RESPUESTA UNIFORME:
 *   {
 *     "statusCode": 200,       ← Código HTTP de la respuesta
 *     "message": "OK",         ← Mensaje de estado
 *     "data": { ... }          ← El dato real que retornó el Controller
 *   }
 *
 * FLUJO:
 *   1. El Controller retorna un dato (ej: return this.service.findAll())
 *   2. El interceptor captura ese dato con el operador RxJS `map`
 *   3. Lo envuelve en { statusCode, message, data } y lo envía al cliente
 *
 * EJEMPLO PRÁCTICO:
 *   Controller retorna: [{ id: 1, nombre: 'Firulais' }]
 *   Cliente recibe:     { statusCode: 200, message: 'OK', data: [{ id: 1, nombre: 'Firulais' }] }
 *
 * NOTA: Este interceptor NO se ejecuta cuando hay errores.
 *   Los errores son manejados por HttpExceptionFilter.
 */
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

/** Interfaz que define la estructura de TODAS las respuestas de la API */
export interface ApiResponse<T> {
  statusCode: number;
  message: string;
  data: T;
}

@Injectable()
export class ResponseInterceptor<T>
  implements NestInterceptor<T, ApiResponse<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<ApiResponse<T>> {
    // Obtener el código de estado HTTP (200, 201, etc.)
    const statusCode = context.switchToHttp().getResponse().statusCode;

    // next.handle() ejecuta el Controller; .pipe(map(...)) transforma el resultado
    return next.handle().pipe(
      map((data) => ({
        statusCode,
        message: 'OK',
        data,
      })),
    );
  }
}
