/**
 * ============================================================
 * SERVICIO DE CITAS — Sprint 2
 * ============================================================
 *
 * REGLA DE NEGOCIO PRINCIPAL: VALIDACIÓN DE DISPONIBILIDAD HORARIA
 *
 *   No puede haber dos citas activas (no canceladas) que coincidan en:
 *     - Mismo veterinario (usuarioId) + misma fecha + misma hora
 *     - Misma mascota   (mascotaId) + misma fecha + misma hora
 *
 *   La validación se hace ANTES de insertar/actualizar (Service), no en
 *   la capa de BD. Si hay conflicto, lanza ConflictException 409 con un
 *   mensaje claro indicando si el choque es por veterinario o por mascota.
 *
 * FLUJO de create():
 *   1. Convierte fecha string a Date (truncada a día).
 *   2. Llama a findConflict(): si encuentra conflicto, 409.
 *   3. Llama a repository.create(); si la FK no existe (P2003), 404.
 *
 * FLUJO de update():
 *   1. Verifica que la cita exista (404 si no).
 *   2. Mergea: usa el dato nuevo si vino, si no el actual (current).
 *   3. Llama a findConflict() pasando excludeId=id para no chocar consigo misma.
 *   4. Llama a repository.update(); si la FK no existe, 404.
 *
 * CÓDIGOS DE ERROR DE PRISMA:
 *   P2003 → Violación de FK (mascota o veterinario inexistente)
 */
import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { CitasRepository } from '../repository/citas.repository';
import { CreateCitaDto } from '../dto/create-cita.dto';
import { UpdateCitaDto } from '../dto/update-cita.dto';

@Injectable()
export class CitasService {
  constructor(private readonly citasRepository: CitasRepository) {}

  findAll() {
    return this.citasRepository.findAll();
  }

  async findOne(id: number) {
    const cita = await this.citasRepository.findOne(id);
    if (!cita) throw new NotFoundException(`Cita con ID ${id} no encontrada`);
    return cita;
  }

  findByMascota(mascotaId: number) {
    return this.citasRepository.findByMascota(mascotaId);
  }

  async create(dto: CreateCitaDto) {
    const fecha = new Date(dto.fecha);
    await this.assertNoConflict(fecha, dto.hora, dto.usuarioId, dto.mascotaId);

    try {
      return await this.citasRepository.create(dto);
    } catch (error: any) {
      if (error.code === 'P2003') {
        throw new NotFoundException(
          'La mascota o el veterinario referenciado no existe',
        );
      }
      throw error;
    }
  }

  async update(id: number, dto: UpdateCitaDto) {
    const current = await this.findOne(id);

    // Si alguno de los 4 campos críticos cambia, hay que revalidar.
    const fecha = dto.fecha ? new Date(dto.fecha) : current.fecha;
    const hora = dto.hora ?? current.hora;
    const usuarioId = dto.usuarioId ?? current.usuarioId;
    const mascotaId = dto.mascotaId ?? current.mascotaId;
    const estadoFinal = dto.estado ?? current.estado;

    // Solo validamos disponibilidad si la cita NO está siendo cancelada.
    if (estadoFinal !== 'cancelada') {
      await this.assertNoConflict(fecha, hora, usuarioId, mascotaId, id);
    }

    try {
      return await this.citasRepository.update(id, dto);
    } catch (error: any) {
      if (error.code === 'P2003') {
        throw new NotFoundException(
          'La mascota o el veterinario referenciado no existe',
        );
      }
      throw error;
    }
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.citasRepository.remove(id);
  }

  /**
   * Lanza ConflictException con mensaje específico si ya existe una cita
   * en conflicto. Si el conflicto es con la misma mascota Y mismo
   * veterinario, prioriza el mensaje de veterinario (es más informativo).
   */
  private async assertNoConflict(
    fecha: Date,
    hora: string,
    usuarioId: number,
    mascotaId: number,
    excludeId?: number,
  ) {
    const conflict = await this.citasRepository.findConflict(
      fecha,
      hora,
      usuarioId,
      mascotaId,
      excludeId,
    );
    if (!conflict) return;

    if (conflict.usuarioId === usuarioId) {
      throw new ConflictException(
        `El veterinario ya tiene una cita asignada el ${fecha
          .toISOString()
          .slice(0, 10)} a las ${hora}`,
      );
    }
    throw new ConflictException(
      `La mascota ya tiene una cita asignada el ${fecha
        .toISOString()
        .slice(0, 10)} a las ${hora}`,
    );
  }
}
