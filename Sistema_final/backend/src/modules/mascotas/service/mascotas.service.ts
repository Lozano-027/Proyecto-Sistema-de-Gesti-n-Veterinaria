/**
 * SERVICIO DE MASCOTAS
 *
 * REGLAS DE NEGOCIO:
 *   - findOne lanza 404 si no existe
 *   - create captura P2003 (FK inválida): "El propietario referenciado no existe"
 *   - update verifica existencia antes de actualizar
 *   - remove verifica existencia y captura P2003 si tiene citas/historial
 *
 * NOTA SOBRE P2003 EN remove:
 *   Si la mascota tiene citas o historiales asociados, Prisma rechaza el delete.
 *   Convertimos ese error técnico en un BadRequest con mensaje legible.
 */
import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { MascotasRepository } from '../repository/mascotas.repository';
import { CreateMascotaDto } from '../dto/create-mascota.dto';
import { UpdateMascotaDto } from '../dto/update-mascota.dto';

@Injectable()
export class MascotasService {
  constructor(private readonly mascotasRepository: MascotasRepository) {}

  findAll() {
    return this.mascotasRepository.findAll();
  }

  async findOne(id: number) {
    const mascota = await this.mascotasRepository.findOne(id);
    if (!mascota) throw new NotFoundException(`Mascota con ID ${id} no encontrada`);
    return mascota;
  }

  findByPropietario(propietarioId: number) {
    return this.mascotasRepository.findByPropietario(propietarioId);
  }

  async create(dto: CreateMascotaDto) {
    try {
      return await this.mascotasRepository.create(dto);
    } catch (error: any) {
      if (error.code === 'P2003') {
        throw new NotFoundException('El propietario referenciado no existe');
      }
      throw error;
    }
  }

  async update(id: number, dto: UpdateMascotaDto) {
    await this.findOne(id);
    try {
      return await this.mascotasRepository.update(id, dto);
    } catch (error: any) {
      if (error.code === 'P2003') {
        throw new NotFoundException('El propietario referenciado no existe');
      }
      throw error;
    }
  }

  async remove(id: number) {
    await this.findOne(id);
    try {
      return await this.mascotasRepository.remove(id);
    } catch (error: any) {
      if (error.code === 'P2003') {
        throw new BadRequestException(
          'No se puede eliminar: la mascota tiene citas o historial asociado',
        );
      }
      throw error;
    }
  }
}
