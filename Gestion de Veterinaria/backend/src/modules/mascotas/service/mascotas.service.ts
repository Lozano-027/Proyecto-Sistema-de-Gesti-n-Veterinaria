import { Injectable, NotFoundException } from '@nestjs/common';
import { MascotasRepository } from '../repository/mascotas.repository';
import { CreateMascotaDto, UpdateMascotaDto } from '../dto/mascota.dto';

@Injectable()
export class MascotasService {
  constructor(private readonly repo: MascotasRepository) {}

  async findAll() {
    const data = await this.repo.findAll();
    return { message: 'Mascotas obtenidas', data };
  }

  async findOne(id: number) {
    const mascota = await this.repo.findById(id);
    if (!mascota || !mascota.activo) throw new NotFoundException(`Mascota con id ${id} no encontrada`);
    return { message: 'Mascota encontrada', data: mascota };
  }

  async findByPropietario(propietarioId: number) {
    const data = await this.repo.findByPropietario(propietarioId);
    return { message: 'Mascotas del propietario', data };
  }

  async create(dto: CreateMascotaDto) {
    const data = await this.repo.create(dto);
    return { message: 'Mascota registrada exitosamente', data };
  }

  async update(id: number, dto: UpdateMascotaDto) {
    await this.findOne(id);
    const data = await this.repo.update(id, dto);
    return { message: 'Mascota actualizada', data };
  }

  async remove(id: number) {
    await this.findOne(id);
    await this.repo.remove(id);
    return { message: 'Mascota eliminada correctamente', data: null };
  }
}
