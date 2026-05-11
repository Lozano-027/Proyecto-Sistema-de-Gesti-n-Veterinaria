/**
 * ============================================================
 * DTO de PAGINACIÓN (query params ?page=&limit=)
 * ============================================================
 *
 * Se usa en endpoints que retornan listas largas (historial clínico,
 * citas, etc.) para evitar sobrecargar al frontend.
 *
 * VALIDACIONES:
 *   @Type(() => Number)    → Convierte el string del query a number
 *                            (ValidationPipe + transform: true ya lo hace,
 *                            pero @Type lo hace explícito y evita ambigüedad).
 *   @IsInt()               → Debe ser entero
 *   @Min(1)                → page >= 1, limit >= 1
 *   @Max(100)              → limit no puede exceder 100 (evita DoS)
 *   @IsOptional()          → Ambos opcionales (defaults en el Service)
 *
 * USO:
 *   GET /historial-clinico/mascota/1?page=2&limit=20
 *
 * NOTA: Se ubica dentro del módulo historial-clinico/ porque por ahora
 *   solo este módulo lo usa. Si el Sprint 5 lo necesita en reportes,
 *   se moverá a src/common/dto/.
 */
import { IsInt, IsOptional, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';

export class PaginateDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 10;
}
