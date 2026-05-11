/**
 * REPOSITORIO DE MASCOTAS
 *
 * Se incluye `propietario` en findAll/findOne para que el frontend
 * pueda mostrar el dueño junto a la mascota sin hacer 2 peticiones.
 *
 * fechaNacimiento llega como string del DTO (formato ISO) y se convierte
 * a Date antes de guardarla en BD (Prisma exige Date para columnas TIMESTAMP).
 */
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { CreateMascotaDto } from '../dto/create-mascota.dto';
import { UpdateMascotaDto } from '../dto/update-mascota.dto';

@Injectable()
export class MascotasRepository {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.mascota.findMany({
      include: { propietario: true },
      orderBy: { id: 'asc' },
    });
  }

  findOne(id: number) {
    return this.prisma.mascota.findUnique({
      where: { id },
      include: { propietario: true },
    });
  }

  /** Sprint 2 — listar mascotas de un propietario específico */
  findByPropietario(propietarioId: number) {
    return this.prisma.mascota.findMany({
      where: { propietarioId },
      include: { propietario: true },
      orderBy: { id: 'asc' },
    });
  }

  create(dto: CreateMascotaDto) {
    return this.prisma.mascota.create({
      data: { ...dto, fechaNacimiento: new Date(dto.fechaNacimiento) },
      include: { propietario: true },
    });
  }

  update(id: number, dto: UpdateMascotaDto) {
    const data: Record<string, unknown> = { ...dto };
    if (dto.fechaNacimiento) {
      data.fechaNacimiento = new Date(dto.fechaNacimiento);
    }
    return this.prisma.mascota.update({
      where: { id },
      data,
      include: { propietario: true },
    });
  }

  remove(id: number) {
    return this.prisma.mascota.delete({ where: { id } });
  }
}
