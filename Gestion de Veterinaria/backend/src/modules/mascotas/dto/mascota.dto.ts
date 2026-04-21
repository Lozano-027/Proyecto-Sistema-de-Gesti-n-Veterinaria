import { IsDateString, IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateMascotaDto {
  @IsNotEmpty({ message: 'El nombre es obligatorio' })
  @IsString()
  nombre: string;

  @IsNotEmpty({ message: 'La especie es obligatoria' })
  @IsString()
  especie: string;

  @IsOptional()
  @IsString()
  raza?: string;

  @IsOptional()
  @IsDateString({}, { message: 'Fecha de nacimiento no válida' })
  fechaNacimiento?: string;

  @IsInt({ message: 'El propietarioId debe ser un número entero' })
  propietarioId: number;
}

export class UpdateMascotaDto {
  @IsOptional() @IsString() nombre?: string;
  @IsOptional() @IsString() especie?: string;
  @IsOptional() @IsString() raza?: string;
  @IsOptional() @IsDateString() fechaNacimiento?: string;
  @IsOptional() @IsInt() propietarioId?: number;
}
