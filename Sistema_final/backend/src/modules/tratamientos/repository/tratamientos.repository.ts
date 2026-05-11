/**
 * ============================================================
 * REPOSITORIO DE TRATAMIENTOS
 * ============================================================
 *
 * INCLUDES:
 *   findAll/findOne incluyen `cita` (con mascota) y `historialClinico`
 *   (con mascota) para que el frontend pueda mostrar contexto sin
 *   peticiones adicionales.
 *
 * MÉTODOS ESPECIALES:
 *   findByCita()      → Tratamientos asociados a una cita.
 *   findByHistorial() → Tratamientos asociados a un historial.
 *
 *   Ambos los usará el frontend del Sprint 5 (vista detallada de
 *   historial completo). Aquí ya están listos.
 */
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { CreateTratamientoDto } from '../dto/create-tratamiento.dto';
import { UpdateTratamientoDto } from '../dto/update-tratamiento.dto';

@Injectable()
export class TratamientosRepository {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.tratamiento.findMany({
      include: {
        cita: { include: { mascota: true, usuario: true } },
        historialClinico: { include: { mascota: true } },
      },
      orderBy: { id: 'desc' },
    });
  }

  findOne(id: number) {
    return this.prisma.tratamiento.findUnique({
      where: { id },
      include: {
        cita: { include: { mascota: true, usuario: true } },
        historialClinico: { include: { mascota: true } },
      },
    });
  }

  findByCita(citaId: number) {
    return this.prisma.tratamiento.findMany({
      where: { citaId },
      orderBy: { id: 'asc' },
    });
  }

  findByHistorial(historialClinicoId: number) {
    return this.prisma.tratamiento.findMany({
      where: { historialClinicoId },
      orderBy: { id: 'asc' },
    });
  }

  create(dto: CreateTratamientoDto) {
    return this.prisma.tratamiento.create({
      data: dto,
      include: {
        cita: { include: { mascota: true } },
        historialClinico: { include: { mascota: true } },
      },
    });
  }

  update(id: number, dto: UpdateTratamientoDto) {
    return this.prisma.tratamiento.update({
      where: { id },
      data: dto,
      include: {
        cita: { include: { mascota: true } },
        historialClinico: { include: { mascota: true } },
      },
    });
  }

  remove(id: number) {
    return this.prisma.tratamiento.delete({ where: { id } });
  }
}
