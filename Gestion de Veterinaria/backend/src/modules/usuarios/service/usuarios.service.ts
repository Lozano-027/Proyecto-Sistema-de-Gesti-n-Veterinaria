import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UsuariosRepository } from '../repository/usuarios.repository';
import { CreateUsuarioDto, UpdateUsuarioDto } from '../dto/usuario.dto';

@Injectable()
export class UsuariosService {
  constructor(private readonly repo: UsuariosRepository) {}

  async findAll() {
    const data = await this.repo.findAll();
    return { message: 'Usuarios obtenidos', data };
  }

  async findOne(id: number) {
    const usuario = await this.repo.findById(id);
    if (!usuario) throw new NotFoundException(`Usuario con id ${id} no encontrado`);
    return { message: 'Usuario encontrado', data: usuario };
  }

  async create(dto: CreateUsuarioDto) {
    const existe = await this.repo.findByCorreo(dto.correo);
    if (existe) throw new ConflictException('Ya existe un usuario con ese correo');
    const hash = await bcrypt.hash(dto.contrasena, 10);
    const data = await this.repo.create({ ...dto, contrasena: hash });
    return { message: 'Usuario creado exitosamente', data };
  }

  async update(id: number, dto: UpdateUsuarioDto) {
    await this.findOne(id);
    const data = await this.repo.update(id, dto);
    return { message: 'Usuario actualizado', data };
  }

  async remove(id: number) {
    await this.findOne(id);
    await this.repo.remove(id);
    return { message: 'Usuario eliminado correctamente', data: null };
  }
}
