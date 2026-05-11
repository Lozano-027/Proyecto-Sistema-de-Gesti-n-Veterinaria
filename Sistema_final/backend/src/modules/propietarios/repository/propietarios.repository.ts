/**
 * REPOSITORIO DE PROPIETARIOS
 *
 * findAll() incluye el conteo de mascotas para mostrarlo en la tabla
 * del frontend (HU-03).
 */
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { CreatePropietarioDto } from '../dto/create-propietario.dto';
import { UpdatePropietarioDto } from '../dto/update-propietario.dto';

@Injectable()
export class PropietariosRepository {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.propietario.findMany({
      include: {
        _count: { select: { mascotas: true } },
      },
      orderBy: { id: 'asc' },
    });
  }

  findOne(id: number) {
    return this.prisma.propietario.findUnique({
      where: { id },
      include: { mascotas: true },
    });
  }

  create(dto: CreatePropietarioDto) {
    return this.prisma.propietario.create({ data: dto });
  }

  update(id: number, dto: UpdatePropietarioDto) {
    return this.prisma.propietario.update({ where: { id }, data: dto });
  }

  remove(id: number) {
    return this.prisma.propietario.delete({ where: { id } });
  }
}
