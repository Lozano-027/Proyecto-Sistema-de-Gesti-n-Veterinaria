/**
 * ============================================================
 * DTO para CREAR una Mascota
 * ============================================================
 *
 * VALIDACIONES (class-validator):
 *   @IsString()      → Debe ser string (nombre, especie, raza)
 *   @IsDateString()  → Fecha en formato ISO ("2020-05-10")
 *   @IsInt()         → Entero (propietarioId)
 *
 * EJEMPLO DE BODY VÁLIDO:
 *   {
 *     "nombre": "Firulais",
 *     "especie": "Perro",
 *     "raza": "Labrador",
 *     "fechaNacimiento": "2020-05-10",
 *     "propietarioId": 1
 *   }
 */
import { IsString, IsDateString, IsInt } from 'class-validator';

export class CreateMascotaDto {
  @IsString()
  nombre: string;

  @IsString()
  especie: string;

  @IsString()
  raza: string;

  @IsDateString()
  fechaNacimiento: string;

  @IsInt()
  propietarioId: number;
}
