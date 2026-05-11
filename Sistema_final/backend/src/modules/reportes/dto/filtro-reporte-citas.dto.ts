/**
 * ============================================================
 * DTO de FILTROS para el reporte de citas
 * ============================================================
 *
 * Se usa como query string del endpoint:
 *   GET /api/v1/reportes/citas?fechaInicio=...&fechaFin=...&usuarioId=...&estado=...
 *
 * TODOS los campos son OPCIONALES — el frontend puede combinar los que
 * quiera. Si no envía ninguno, el backend retorna TODAS las citas.
 *
 * VALIDACIONES:
 *   @IsDateString()   → fechas en formato ISO ("2026-04-01")
 *   @Type(() => Number) → convierte string del query a number (usuarioId)
 *   @IsIn([...])      → estado debe ser uno de los valores válidos
 *
 * EJEMPLO DE QUERY VÁLIDO:
 *   ?fechaInicio=2026-04-01&fechaFin=2026-04-30&usuarioId=2&estado=programada
 */
import { IsOptional, IsDateString, IsInt, IsIn } from 'class-validator';
import { Type } from 'class-transformer';

export class FiltroReporteCitasDto {
  @IsOptional()
  @IsDateString()
  fechaInicio?: string;

  @IsOptional()
  @IsDateString()
  fechaFin?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  usuarioId?: number;

  @IsOptional()
  @IsIn(['programada', 'completada', 'cancelada'], {
    message: 'estado debe ser "programada", "completada" o "cancelada"',
  })
  estado?: string;
}
