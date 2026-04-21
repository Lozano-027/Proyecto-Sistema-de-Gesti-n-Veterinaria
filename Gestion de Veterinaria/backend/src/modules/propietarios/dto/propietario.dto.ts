import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreatePropietarioDto {
  @IsNotEmpty({ message: 'Los nombres son obligatorios' })
  @IsString()
  nombres: string;

  @IsNotEmpty({ message: 'Los apellidos son obligatorios' })
  @IsString()
  apellidos: string;

  @IsNotEmpty({ message: 'El teléfono es obligatorio' })
  @IsString()
  telefono: string;

  @IsEmail({}, { message: 'Correo electrónico no válido' })
  correo: string;

  @IsOptional()
  @IsString()
  direccion?: string;
}

export class UpdatePropietarioDto {
  @IsOptional() @IsString() nombres?: string;
  @IsOptional() @IsString() apellidos?: string;
  @IsOptional() @IsString() telefono?: string;
  @IsOptional() @IsEmail() correo?: string;
  @IsOptional() @IsString() direccion?: string;
}
