import { IsDateString, IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateHistorialDto {
  @IsDateString({}, { message: 'Fecha no válida' })
  fecha: string;

  @IsNotEmpty({ message: 'El diagnóstico es obligatorio' })
  @IsString()
  diagnostico: string;

  @IsOptional()
  @IsString()
  observaciones?: string;

  @IsInt()
  mascotaId: number;
}

export class UpdateHistorialDto {
  @IsOptional() @IsDateString() fecha?: string;
  @IsOptional() @IsString() diagnostico?: string;
  @IsOptional() @IsString() observaciones?: string;
}
