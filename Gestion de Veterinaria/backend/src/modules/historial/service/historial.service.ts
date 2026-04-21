import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { HistorialRepository } from '../repository/historial.repository';
import { CreateHistorialDto, UpdateHistorialDto } from '../dto/historial.dto';

@Injectable()
export class HistorialService {
  constructor(private readonly repo: HistorialRepository) {}

  async findAll() {
    const data = await this.repo.findAll();
    return { message: 'Historiales obtenidos', data };
  }

  async findOne(id: number) {
    const h = await this.repo.findById(id);
    if (!h) throw new NotFoundException(`Historial con id ${id} no encontrado`);
    return { message: 'Historial encontrado', data: h };
  }

  async findByMascota(mascotaId: number) {
    const data = await this.repo.findByMascota(mascotaId);
    return { message: 'Historial clínico de la mascota', data };
  }

  async create(dto: CreateHistorialDto) {
    try {
      const data = await this.repo.create(dto);
      return { message: 'Historial clínico creado exitosamente', data };
    } catch (e) {
      if (e.code === 'P2002') {
        throw new ConflictException('Ya existe un historial para esa mascota en esa fecha');
      }
      throw e;
    }
  }

  async update(id: number, dto: UpdateHistorialDto) {
    await this.findOne(id);
    const data = await this.repo.update(id, dto);
    return { message: 'Historial actualizado', data };
  }

  async remove(id: number) {
    await this.findOne(id);
    await this.repo.remove(id);
    return { message: 'Historial eliminado correctamente', data: null };
  }
}
