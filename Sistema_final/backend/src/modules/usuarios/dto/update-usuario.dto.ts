/**
 * DTO: Data Transfer Object para ACTUALIZAR un Usuario
 *
 * PartialType genera automáticamente una clase donde TODOS los campos
 * de CreateUsuarioDto son OPCIONALES, permitiendo updates parciales.
 */
import { PartialType } from '@nestjs/mapped-types';
import { CreateUsuarioDto } from './create-usuario.dto';

export class UpdateUsuarioDto extends PartialType(CreateUsuarioDto) {}
