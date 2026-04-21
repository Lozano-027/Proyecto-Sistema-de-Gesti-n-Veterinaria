import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { CreateHistorialDto, UpdateHistorialDto } from '../dto/historial.dto';

@Injectable()
export class HistorialRepository {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.historialClinico.findMany({
      include: {
        mascota: { select: { id: true, nombre: true, especie: true } },
        tratamientos: true,
      },
      orderBy: { fecha: 'desc' },
    });
  }

  findById(id: number) {
    return this.prisma.historialClinico.findUnique({
      where: { id },
      include: {
        mascota: { include: { propietario: true } },
        tratamientos: true,
      },
    });
  }

  findByMascota(mascotaId: number) {
    return this.prisma.historialClinico.findMany({
      where: { mascotaId },
      include: { tratamientos: true },
      orderBy: { fecha: 'desc' },
    });
  }

  create(data: CreateHistorialDto) {
    return this.prisma.historialClinico.create({
      data: {
        fecha: new Date(data.fecha),
        diagnostico: data.diagnostico,
        observaciones: data.observaciones,
        mascotaId: data.mascotaId,
      },
      include: { mascota: { select: { id: true, nombre: true } } },
    });
  }

  update(id: number, data: UpdateHistorialDto) {
    return this.prisma.historialClinico.update({
      where: { id },
      data: {
        ...data,
        fecha: data.fecha ? new Date(data.fecha) : undefined,
      },
    });
  }

  remove(id: number) {
    return this.prisma.historialClinico.delete({ where: { id } });
  }
}
