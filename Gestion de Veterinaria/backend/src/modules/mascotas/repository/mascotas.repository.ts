import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { CreateMascotaDto, UpdateMascotaDto } from '../dto/mascota.dto';

@Injectable()
export class MascotasRepository {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.mascota.findMany({
      where: { activo: true },
      include: {
        propietario: { select: { id: true, nombres: true, apellidos: true, telefono: true } },
      },
      orderBy: { nombre: 'asc' },
    });
  }

  findById(id: number) {
    return this.prisma.mascota.findUnique({
      where: { id },
      include: {
        propietario: true,
        citas: { orderBy: { fecha: 'desc' }, take: 5 },
        historiales: { orderBy: { fecha: 'desc' }, take: 5 },
      },
    });
  }

  findByPropietario(propietarioId: number) {
    return this.prisma.mascota.findMany({
      where: { propietarioId, activo: true },
    });
  }

  create(data: CreateMascotaDto) {
    return this.prisma.mascota.create({
      data: {
        nombre: data.nombre,
        especie: data.especie,
        raza: data.raza,
        fechaNacimiento: data.fechaNacimiento ? new Date(data.fechaNacimiento) : null,
        propietarioId: data.propietarioId,
      },
      include: { propietario: { select: { id: true, nombres: true, apellidos: true } } },
    });
  }

  update(id: number, data: UpdateMascotaDto) {
    return this.prisma.mascota.update({
      where: { id },
      data: {
        ...data,
        fechaNacimiento: data.fechaNacimiento ? new Date(data.fechaNacimiento) : undefined,
      },
    });
  }

  remove(id: number) {
    return this.prisma.mascota.update({ where: { id }, data: { activo: false } });
  }
}
