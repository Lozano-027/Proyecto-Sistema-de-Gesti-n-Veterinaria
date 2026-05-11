/**
 * DTO para CREAR un Propietario.
 *
 * EJEMPLO DE BODY VÁLIDO:
 *   {
 *     "nombres": "María Camila",
 *     "apellidos": "Rodríguez Pérez",
 *     "telefono": "3201234567",
 *     "correo": "maria.rodriguez@correo.com",
 *     "direccion": "Calle 15 #4-23, Neiva"
 *   }
 */
import { IsString, IsEmail } from 'class-validator';

export class CreatePropietarioDto {
  @IsString()
  nombres: string;

  @IsString()
  apellidos: string;

  @IsString()
  telefono: string;

  @IsEmail()
  correo: string;

  @IsString()
  direccion: string;
}
