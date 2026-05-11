/**
 * ============================================================
 * DTO para CREAR un Historial Clínico
 * ============================================================
 *
 * VALIDACIONES:
 *   @IsInt()         → mascotaId
 *   @IsDateString()  → fecha (formato ISO "2026-04-15")
 *   @IsString()      → diagnostico
 *   @IsOptional()    → observaciones es opcional (puede ser null)
 *
 * RESTRICCIÓN ÚNICA (a nivel BD):
 *   @@unique([mascotaId, fecha]) en schema.prisma →
 *   No puede haber dos historiales para la misma mascota en la misma fecha.
 *   Si se intenta, Prisma lanza P2002 → el Service lo convierte en 409.
 *
 * EJEMPLO DE BODY VÁLIDO:
 *   {
 *     "mascotaId": 1,
 *     "fecha": "2026-04-15",
 *     "diagnostico": "Otitis externa leve",
 *     "observaciones": "Aplicar gotas óticas 2 veces al día"
 *   }
 */
import { IsInt, IsDateString, IsString, IsOptional } from 'class-validator';

export class CreateHistorialClinicoDto {
  @IsInt()
  mascotaId: number;

  @IsDateString()
  fecha: string;

  @IsString()
  diagnostico: string;

  @IsOptional()
  @IsString()
  observaciones?: string;
}
