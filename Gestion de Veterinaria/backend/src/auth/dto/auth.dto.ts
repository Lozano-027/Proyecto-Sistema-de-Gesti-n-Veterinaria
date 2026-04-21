import { IsEmail, IsNotEmpty, IsString, MinLength, IsEnum, IsOptional } from 'class-validator';
import { Rol } from '@prisma/client';

export class RegisterDto {
  @IsNotEmpty({ message: 'El nombre es obligatorio' })
  @IsString()
  nombre: string;

  @IsEmail({}, { message: 'Correo electrónico no válido' })
  correo: string;

  @IsString()
  @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
  contrasena: string;

  @IsEnum(Rol, { message: 'El rol debe ser ADMIN o VETERINARIO' })
  @IsOptional()
  rol?: Rol;
}

export class LoginDto {
  @IsEmail({}, { message: 'Correo electrónico no válido' })
  correo: string;

  @IsNotEmpty({ message: 'La contraseña es obligatoria' })
  @IsString()
  contrasena: string;
}
