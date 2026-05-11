/**
 * ============================================================
 * REPOSITORIO DE CITAS
 * ============================================================
 *
 * MÉTODO CLAVE: findConflict()
 *   Busca si ya existe una cita en la misma fecha+hora para el mismo
 *   veterinario O para la misma mascota. Se usa en el Service para
 *   rechazar la creación/actualización.
 *
 *   Excluye citas con estado "cancelada" (esas liberan el horario).
 *   En update también excluye la propia cita (excludeId) para que no
 *   choque consigo misma.
 *
 * INCLUDES:
 *   findAll/findOne incluyen `mascota` y `usuario` para que el frontend
 *   pueda mostrar los nombres sin hacer peticiones adicionales.
 */
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { CreateCitaDto } from '../dto/create-cita.dto';
import { UpdateCitaDto } from '../dto/update-cita.dto';

@Injectable()
export class CitasRepository {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.cita.findMany({
      include: {
        mascota: { include: { propietario: true } },
        usuario: true,
      },
      orderBy: [{ fecha: 'asc' }, { hora: 'asc' }],
    });
  }

  findOne(id: number) {
    return this.prisma.cita.findUnique({
      where: { id },
      include: {
        mascota: { include: { propietario: true } },
        usuario: true,
      },
    });
  }

  /** Citas de una mascota específica (Sprint 5 lo usará para reportes). */
  findByMascota(mascotaId: number) {
    return this.prisma.cita.findMany({
      where: { mascotaId },
      include: { usuario: true },
      orderBy: [{ fecha: 'asc' }, { hora: 'asc' }],
    });
  }

  /**
   * Busca conflictos de horario: ¿existe una cita NO cancelada en la
   * misma fecha+hora con el mismo veterinario o la misma mascota?
   *
   * @param excludeId si se pasa (en updates), excluye esa cita de la búsqueda
   *                  para no chocar consigo misma.
   */
  findConflict(
    fecha: Date,
    hora: string,
    usuarioId: number,
    mascotaId: number,
    excludeId?: number,
  ) {
    return this.prisma.cita.findFirst({
      where: {
        fecha,
        hora,
        estado: { not: 'cancelada' },
        OR: [{ usuarioId }, { mascotaId }],
        ...(excludeId ? { NOT: { id: excludeId } } : {}),
      },
      include: { mascota: true, usuario: true },
    });
  }

  create(dto: CreateCitaDto) {
    return this.prisma.cita.create({
      data: { ...dto, fecha: new Date(dto.fecha) },
      include: {
        mascota: { include: { propietario: true } },
        usuario: true,
      },
    });
  }

  update(id: number, dto: UpdateCitaDto) {
    const data: Record<string, unknown> = { ...dto };
    if (dto.fecha) data.fecha = new Date(dto.fecha);
    return this.prisma.cita.update({
      where: { id },
      data,
      include: {
        mascota: { include: { propietario: true } },
        usuario: true,
      },
    });
  }

  remove(id: number) {
    return this.prisma.cita.delete({ where: { id } });
  }
}
