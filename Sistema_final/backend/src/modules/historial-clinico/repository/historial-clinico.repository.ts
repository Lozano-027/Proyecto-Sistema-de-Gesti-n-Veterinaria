/**
 * ============================================================
 * REPOSITORIO DE HISTORIAL CLÍNICO
 * ============================================================
 *
 * MÉTODO CLAVE: findByMascotaPaginated()
 *   Retorna { items, total } para que el Service arme la respuesta
 *   con metadatos de paginación (page, limit, totalPages).
 *
 *   Usa $transaction para ejecutar el findMany y el count en una sola
 *   ida y vuelta a la base, asegurando que ambos se ejecutan sobre el
 *   mismo snapshot (no se cuela un INSERT entre ambas consultas).
 *
 * INCLUDES:
 *   findOne incluye `mascota` (para mostrar el nombre en la UI).
 *   findAll incluye `_count.tratamientos` (para el badge "N tratamientos"
 *     que mostrará el frontend de Sprint 4).
 */
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { CreateHistorialClinicoDto } from '../dto/create-historial-clinico.dto';
import { UpdateHistorialClinicoDto } from '../dto/update-historial-clinico.dto';

@Injectable()
export class HistorialClinicoRepository {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.historialClinico.findMany({
      include: {
        mascota: { include: { propietario: true } },
        _count: { select: { tratamientos: true } },
      },
      orderBy: { fecha: 'desc' },
    });
  }

  findOne(id: number) {
    return this.prisma.historialClinico.findUnique({
      where: { id },
      include: {
        mascota: { include: { propietario: true } },
        tratamientos: true,
      },
    });
  }

  /**
   * Listado paginado del historial de una mascota.
   *
   * @returns { items, total } — items: registros de la página actual,
   *                              total: total de registros para esa mascota.
   */
  async findByMascotaPaginated(
    mascotaId: number,
    page: number,
    limit: number,
  ) {
    const skip = (page - 1) * limit;

    // $transaction([...]) ejecuta ambas queries en el mismo snapshot
    // y retorna un array con los resultados en orden.
    const [items, total] = await this.prisma.$transaction([
      this.prisma.historialClinico.findMany({
        where: { mascotaId },
        include: { _count: { select: { tratamientos: true } } },
        orderBy: { fecha: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.historialClinico.count({ where: { mascotaId } }),
    ]);

    return { items, total };
  }

  create(dto: CreateHistorialClinicoDto) {
    return this.prisma.historialClinico.create({
      data: { ...dto, fecha: new Date(dto.fecha) },
      include: { mascota: true },
    });
  }

  update(id: number, dto: UpdateHistorialClinicoDto) {
    const data: Record<string, unknown> = { ...dto };
    if (dto.fecha) data.fecha = new Date(dto.fecha);
    return this.prisma.historialClinico.update({
      where: { id },
      data,
      include: { mascota: true },
    });
  }

  remove(id: number) {
    return this.prisma.historialClinico.delete({ where: { id } });
  }
}
