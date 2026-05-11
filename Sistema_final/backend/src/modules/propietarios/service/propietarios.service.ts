/**
 * SERVICIO DE PROPIETARIOS
 *
 * REGLAS DE NEGOCIO:
 *   - findOne lanza 404 si no existe
 *   - create / update detectan correo duplicado (P2002) → 409
 *   - remove valida existencia y captura P2003 si tiene mascotas asociadas
 */
import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { PropietariosRepository } from '../repository/propietarios.repository';
import { CreatePropietarioDto } from '../dto/create-propietario.dto';
import { UpdatePropietarioDto } from '../dto/update-propietario.dto';

@Injectable()
export class PropietariosService {
  constructor(private readonly propietariosRepository: PropietariosRepository) {}

  findAll() {
    return this.propietariosRepository.findAll();
  }

  async findOne(id: number) {
    const propietario = await this.propietariosRepository.findOne(id);
    if (!propietario) throw new NotFoundException(`Propietario con ID ${id} no encontrado`);
    return propietario;
  }

  async create(dto: CreatePropietarioDto) {
    try {
      return await this.propietariosRepository.create(dto);
    } catch (error: any) {
      if (error.code === 'P2002') {
        throw new ConflictException('Ya existe un propietario con ese correo');
      }
      throw error;
    }
  }

  async update(id: number, dto: UpdatePropietarioDto) {
    await this.findOne(id);
    try {
      return await this.propietariosRepository.update(id, dto);
    } catch (error: any) {
      if (error.code === 'P2002') {
        throw new ConflictException('Ya existe un propietario con ese correo');
      }
      throw error;
    }
  }

  async remove(id: number) {
    await this.findOne(id);
    try {
      return await this.propietariosRepository.remove(id);
    } catch (error: any) {
      if (error.code === 'P2003') {
        throw new BadRequestException('No se puede eliminar: el propietario tiene mascotas asociadas');
      }
      throw error;
    }
  }
}
