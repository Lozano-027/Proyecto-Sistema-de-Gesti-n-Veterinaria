import { IsDateString, IsEnum, IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { EstadoCita } from '@prisma/client';

export class CreateCitaDto {
  @IsDateString({}, { message: 'Fecha no válida' })
  fecha: string;

  @IsNotEmpty({ message: 'La hora es obligatoria' })
  @IsString()
  hora: string;

  @IsNotEmpty({ message: 'El motivo es obligatorio' })
  @IsString()
  motivo: string;

  @IsOptional()
  @IsEnum(EstadoCita)
  estado?: EstadoCita;

  @IsOptional()
  @IsString()
  notas?: string;

  @IsInt()
  mascotaId: number;

  @IsInt()
  usuarioId: number;
}

export class UpdateCitaDto {
  @IsOptional() @IsDateString() fecha?: string;
  @IsOptional() @IsString() hora?: string;
  @IsOptional() @IsString() motivo?: string;
  @IsOptional() @IsEnum(EstadoCita) estado?: EstadoCita;
  @IsOptional() @IsString() notas?: string;
  @IsOptional() @IsInt() usuarioId?: number;
}
