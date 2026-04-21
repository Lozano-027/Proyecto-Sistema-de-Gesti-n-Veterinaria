import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { CreatePropietarioDto, UpdatePropietarioDto } from '../dto/propietario.dto';

@Injectable()
export class PropietariosRepository {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.propietario.findMany({
      where: { activo: true },
      include: { mascotas: { where: { activo: true }, select: { id: true, nombre: true, especie: true } } },
      orderBy: { apellidos: 'asc' },
    });
  }

  findById(id: number) {
    return this.prisma.propietario.findUnique({
      where: { id },
      include: { mascotas: { where: { activo: true } } },
    });
  }

  findByCorreo(correo: string) {
    return this.prisma.propietario.findUnique({ where: { correo } });
  }

  create(data: CreatePropietarioDto) {
    return this.prisma.propietario.create({ data });
  }

  update(id: number, data: UpdatePropietarioDto) {
    return this.prisma.propietario.update({ where: { id }, data });
  }

  remove(id: number) {
    return this.prisma.propietario.update({ where: { id }, data: { activo: false } });
  }
}
