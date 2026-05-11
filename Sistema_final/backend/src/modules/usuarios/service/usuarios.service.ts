/**
 * ============================================================
 * SERVICIO DE USUARIOS (Lógica de Negocio)
 * ============================================================
 *
 * - findOne lanza 404 si no existe
 * - create / update detectan P2002 (correo duplicado) → 409
 * - remove verifica existencia antes de borrar (404 si no existe)
 *
 * CÓDIGOS DE ERROR DE PRISMA:
 *   P2002 → Violación de UNIQUE (correo duplicado)
 *   P2003 → Violación de FK (al eliminar usuario que tiene citas)
 */
import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { UsuariosRepository } from '../repository/usuarios.repository';
import { CreateUsuarioDto } from '../dto/create-usuario.dto';
import { UpdateUsuarioDto } from '../dto/update-usuario.dto';

@Injectable()
export class UsuariosService {
  constructor(private readonly usuariosRepository: UsuariosRepository) {}

  findAll() {
    return this.usuariosRepository.findAll();
  }

  async findOne(id: number) {
    const usuario = await this.usuariosRepository.findOne(id);
    if (!usuario) throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    return usuario;
  }

  async create(dto: CreateUsuarioDto) {
    try {
      return await this.usuariosRepository.create(dto);
    } catch (error: any) {
      if (error.code === 'P2002') {
        throw new ConflictException('Ya existe un usuario con ese correo');
      }
      throw error;
    }
  }

  async update(id: number, dto: UpdateUsuarioDto) {
    await this.findOne(id);
    try {
      return await this.usuariosRepository.update(id, dto);
    } catch (error: any) {
      if (error.code === 'P2002') {
        throw new ConflictException('Ya existe un usuario con ese correo');
      }
      throw error;
    }
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.usuariosRepository.remove(id);
  }
}
