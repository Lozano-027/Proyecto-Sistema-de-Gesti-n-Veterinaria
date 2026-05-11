/**
 * ============================================================
 * DTO para CREAR un Tratamiento
 * ============================================================
 *
 * VALIDACIONES:
 *   @IsString()     → medicamento, dosis, duracion (requeridos)
 *   @IsOptional()   → indicaciones (puede ser null)
 *   @IsInt()        → historialClinicoId, citaId (al menos uno requerido)
 *   @ValidateIf()   → Truco para decir "valida solo si está presente"
 *
 * REGLA DE NEGOCIO:
 *   Al menos uno de { historialClinicoId, citaId } debe estar presente.
 *   Si ambos son undefined → error 400.
 *   Esta regla se valida en el Service (no se puede expresar fácilmente
 *   solo con decoradores de class-validator).
 *
 * EJEMPLO DE BODY VÁLIDO (asociado solo a una cita):
 *   {
 *     "citaId": 1,
 *     "medicamento": "Amoxicilina 500mg",
 *     "dosis": "1 tableta cada 8h",
 *     "duracion": "7 días",
 *     "indicaciones": "Tomar con alimentos"
 *   }
 *
 * EJEMPLO DE BODY VÁLIDO (asociado a un historial):
 *   {
 *     "historialClinicoId": 3,
 *     "medicamento": "Antiparasitario tópico",
 *     "dosis": "1 pipeta",
 *     "duracion": "Aplicación única"
 *   }
 */
import { IsString, IsOptional, IsInt } from 'class-validator';

export class CreateTratamientoDto {
  @IsOptional()
  @IsInt()
  historialClinicoId?: number;

  @IsOptional()
  @IsInt()
  citaId?: number;

  @IsString()
  medicamento: string;

  @IsString()
  dosis: string;

  @IsString()
  duracion: string;

  @IsOptional()
  @IsString()
  indicaciones?: string;
}
