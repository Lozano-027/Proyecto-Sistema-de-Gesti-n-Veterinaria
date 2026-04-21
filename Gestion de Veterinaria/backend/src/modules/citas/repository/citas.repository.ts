import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { CreateCitaDto, UpdateCitaDto } from '../dto/cita.dto';

@Injectable()
export class CitasRepository {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.cita.findMany({
      include: {
        mascota: { select: { id: true, nombre: true, especie: true } },
        usuario: { select: { id: true, nombre: true, rol: true } },
      },
      orderBy: { fecha: 'desc' },
    });
  }

  findById(id: number) {
    return this.prisma.cita.findUnique({
      where: { id },
      include: {
        mascota: { include: { propietario: true } },
        usuario: { select: { id: true, nombre: true, correo: true, rol: true } },
        tratamientos: true,
      },
    });
  }

  findByMascota(mascotaId: number) {
    return this.prisma.cita.findMany({
      where: { mascotaId },
      include: { usuario: { select: { id: true, nombre: true } } },
      orderBy: { fecha: 'desc' },
    });
  }

  create(data: CreateCitaDto) {
    return this.prisma.cita.create({
      data: {
        fecha: new Date(data.fecha),
        hora: data.hora,
        motivo: data.motivo,
        estado: data.estado,
        notas: data.notas,
        mascotaId: data.mascotaId,
        usuarioId: data.usuarioId,
      },
      include: {
        mascota: { select: { id: true, nombre: true } },
        usuario: { select: { id: true, nombre: true } },
      },
    });
  }

  update(id: number, data: UpdateCitaDto) {
    return this.prisma.cita.update({
      where: { id },
      data: {
        ...data,
        fecha: data.fecha ? new Date(data.fecha) : undefined,
      },
    });
  }

  remove(id: number) {
    return this.prisma.cita.delete({ where: { id } });
  }
}
