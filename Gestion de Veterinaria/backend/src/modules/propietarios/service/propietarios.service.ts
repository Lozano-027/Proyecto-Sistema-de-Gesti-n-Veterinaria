import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PropietariosRepository } from '../repository/propietarios.repository';
import { CreatePropietarioDto, UpdatePropietarioDto } from '../dto/propietario.dto';

@Injectable()
export class PropietariosService {
  constructor(private readonly repo: PropietariosRepository) {}

  async findAll() {
    const data = await this.repo.findAll();
    return { message: 'Propietarios obtenidos', data };
  }

  async findOne(id: number) {
    const prop = await this.repo.findById(id);
    if (!prop || !prop.activo) throw new NotFoundException(`Propietario con id ${id} no encontrado`);
    return { message: 'Propietario encontrado', data: prop };
  }

  async create(dto: CreatePropietarioDto) {
    const existe = await this.repo.findByCorreo(dto.correo);
    if (existe) throw new ConflictException('Ya existe un propietario con ese correo');
    const data = await this.repo.create(dto);
    return { message: 'Propietario creado exitosamente', data };
  }

  async update(id: number, dto: UpdatePropietarioDto) {
    await this.findOne(id);
    const data = await this.repo.update(id, dto);
    return { message: 'Propietario actualizado', data };
  }

  async remove(id: number) {
    await this.findOne(id);
    await this.repo.remove(id);
    return { message: 'Propietario eliminado correctamente', data: null };
  }
}
