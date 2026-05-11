/**
 * ============================================================
 * DTO: Data Transfer Object para CREAR un Usuario
 * ============================================================
 *
 * IMPORTANTE: Este DTO NO incluye contraseña porque el proyecto NO
 *   implementa autenticación. Los usuarios representan al personal
 *   veterinario (veterinarios y administradores) solo para asociarlos
 *   a las citas que atienden.
 *
 * VALIDACIONES (class-validator):
 *   @IsString()     → El campo debe ser un string
 *   @IsEmail()      → El campo debe tener formato de email válido
 *   @IsIn([...])    → El valor debe estar en la lista permitida
 *
 * EJEMPLO DE BODY VÁLIDO:
 *   {
 *     "nombre": "Dr. Carlos López",
 *     "correo": "carlos.lopez@vet.co",
 *     "rol": "veterinario"
 *   }
 */
import { IsString, IsEmail, IsIn } from 'class-validator';

export class CreateUsuarioDto {
  @IsString()
  nombre: string;

  @IsEmail()
  correo: string;

  @IsIn(['veterinario', 'admin'], {
    message: 'rol debe ser "veterinario" o "admin"',
  })
  rol: string;
}
