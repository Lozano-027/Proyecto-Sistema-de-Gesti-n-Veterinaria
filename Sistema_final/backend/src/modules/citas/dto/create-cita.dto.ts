/**
 * ============================================================
 * DTO para CREAR una Cita
 * ============================================================
 *
 * VALIDACIONES:
 *   @IsInt()         → mascotaId, usuarioId
 *   @IsDateString()  → fecha (formato ISO "2026-04-15")
 *   @Matches(/HH:mm/) → hora (formato 24h "14:30")
 *   @IsString()      → motivo
 *   @IsOptional()    → estado es opcional (default "programada")
 *   @IsIn([...])     → estado válido
 *
 * EJEMPLO DE BODY VÁLIDO:
 *   {
 *     "mascotaId": 1,
 *     "usuarioId": 1,
 *     "fecha": "2026-04-15",
 *     "hora": "14:30",
 *     "motivo": "Vacunación anual",
 *     "estado": "programada"
 *   }
 */
import {
  IsInt,
  IsDateString,
  IsString,
  IsOptional,
  IsIn,
  Matches,
} from 'class-validator';

export class CreateCitaDto {
  @IsInt()
  mascotaId: number;

  @IsInt()
  usuarioId: number;

  @IsDateString()
  fecha: string;

  /** Hora en formato 24h "HH:mm" (ej: "08:00", "14:30", "23:59") */
  @IsString()
  @Matches(/^([01]\d|2[0-3]):[0-5]\d$/, {
    message: 'hora debe tener formato HH:mm (ej: "14:30")',
  })
  hora: string;

  @IsString()
  motivo: string;

  @IsOptional()
  @IsIn(['programada', 'completada', 'cancelada'], {
    message: 'estado debe ser "programada", "completada" o "cancelada"',
  })
  estado?: string;
}
