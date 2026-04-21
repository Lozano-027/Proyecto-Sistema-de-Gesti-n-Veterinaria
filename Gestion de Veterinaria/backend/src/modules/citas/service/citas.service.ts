import { Injectable, NotFoundException } from '@nestjs/common';
import { CitasRepository } from '../repository/citas.repository';
import { CreateCitaDto, UpdateCitaDto } from '../dto/cita.dto';

@Injectable()
export class CitasService {
  constructor(private readonly repo: CitasRepository) {}

  async findAll() {
    const data = await this.repo.findAll();
    return { message: 'Citas obtenidas', data };
  }

  async findOne(id: number) {
    const cita = await this.repo.findById(id);
    if (!cita) throw new NotFoundException(`Cita con id ${id} no encontrada`);
    return { message: 'Cita encontrada', data: cita };
  }

  async findByMascota(mascotaId: number) {
    const data = await this.repo.findByMascota(mascotaId);
    return { message: 'Citas de la mascota', data };
  }

  async create(dto: CreateCitaDto) {
    const data = await this.repo.create(dto);
    return { message: 'Cita creada exitosamente', data };
  }

  async update(id: number, dto: UpdateCitaDto) {
    await this.findOne(id);
    const data = await this.repo.update(id, dto);
    return { message: 'Cita actualizada', data };
  }

  async remove(id: number) {
    await this.findOne(id);
    await this.repo.remove(id);
    return { message: 'Cita eliminada correctamente', data: null };
  }
}
