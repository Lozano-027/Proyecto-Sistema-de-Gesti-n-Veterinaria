import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { CreateUsuarioDto, UpdateUsuarioDto } from '../dto/usuario.dto';

@Injectable()
export class UsuariosRepository {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.usuario.findMany({
      where: { activo: true },
      select: { id: true, nombre: true, correo: true, rol: true, activo: true, creadoEn: true },
    });
  }

  findById(id: number) {
    return this.prisma.usuario.findUnique({
      where: { id },
      select: { id: true, nombre: true, correo: true, rol: true, activo: true, creadoEn: true },
    });
  }

  findByCorreo(correo: string) {
    return this.prisma.usuario.findUnique({ where: { correo } });
  }

  create(data: CreateUsuarioDto & { contrasena: string }) {
    return this.prisma.usuario.create({
      data,
      select: { id: true, nombre: true, correo: true, rol: true, creadoEn: true },
    });
  }

  update(id: number, data: UpdateUsuarioDto) {
    return this.prisma.usuario.update({
      where: { id },
      data,
      select: { id: true, nombre: true, correo: true, rol: true, actualizadoEn: true },
    });
  }

  remove(id: number) {
    return this.prisma.usuario.update({
      where: { id },
      data: { activo: false },
    });
  }
}
