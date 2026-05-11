/**
 * ============================================================
 * REPOSITORIO DE USUARIOS (Capa de Acceso a Datos)
 * ============================================================
 *
 * Encapsula las consultas SQL al modelo Usuario via Prisma.
 * El Service NO conoce los detalles de la base de datos.
 */
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { CreateUsuarioDto } from '../dto/create-usuario.dto';
import { UpdateUsuarioDto } from '../dto/update-usuario.dto';

@Injectable()
export class UsuariosRepository {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.usuario.findMany({
      orderBy: { id: 'asc' },
    });
  }

  findOne(id: number) {
    return this.prisma.usuario.findUnique({ where: { id } });
  }

  create(dto: CreateUsuarioDto) {
    return this.prisma.usuario.create({ data: dto });
  }

  update(id: number, dto: UpdateUsuarioDto) {
    return this.prisma.usuario.update({ where: { id }, data: dto });
  }

  remove(id: number) {
    return this.prisma.usuario.delete({ where: { id } });
  }
}
