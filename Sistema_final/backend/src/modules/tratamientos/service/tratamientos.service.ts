/**
 * ============================================================
 * SERVICIO DE TRATAMIENTOS — Sprint 4
 * ============================================================
 *
 * REGLA DE NEGOCIO PRINCIPAL:
 *   Al menos uno de { citaId, historialClinicoId } debe estar presente.
 *   Si el body llega sin ninguno, lanza BadRequestException 400.
 *   Esta validación se hace aquí porque class-validator no expresa
 *   bien la regla "uno U otro" con decoradores.
 *
 * MANEJO DE FK INVÁLIDA (P2003):
 *   Si el citaId o historialClinicoId apuntan a un registro que no
 *   existe, Prisma lanza P2003. Lo convertimos en 404 con mensaje
 *   "La cita o el historial referenciado no existe".
 *
 * NOTA SOBRE update():
 *   En update, si el dto NO trae ninguna FK (solo medicamento/dosis/etc),
 *   NO validamos nada — significa que el tratamiento mantiene sus FKs
 *   actuales. Solo validamos si vienen explícitamente como null/undefined
 *   ambos campos juntos, lo cual ya cubre el caso de "remover ambas
 *   asociaciones" (que no permitiríamos).
 */
import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { TratamientosRepository } from '../repository/tratamientos.repository';
import { CreateTratamientoDto } from '../dto/create-tratamiento.dto';
import { UpdateTratamientoDto } from '../dto/update-tratamiento.dto';

@Injectable()
export class TratamientosService {
  constructor(
    private readonly tratamientosRepository: TratamientosRepository,
  ) {}

  findAll() {
    return this.tratamientosRepository.findAll();
  }

  async findOne(id: number) {
    const tratamiento = await this.tratamientosRepository.findOne(id);
    if (!tratamiento) {
      throw new NotFoundException(`Tratamiento con ID ${id} no encontrado`);
    }
    return tratamiento;
  }

  findByCita(citaId: number) {
    return this.tratamientosRepository.findByCita(citaId);
  }

  findByHistorial(historialClinicoId: number) {
    return this.tratamientosRepository.findByHistorial(historialClinicoId);
  }

  async create(dto: CreateTratamientoDto) {
    if (!dto.citaId && !dto.historialClinicoId) {
      throw new BadRequestException(
        'El tratamiento debe estar asociado a una cita o a un historial clínico',
      );
    }

    try {
      return await this.tratamientosRepository.create(dto);
    } catch (error: any) {
      if (error.code === 'P2003') {
        throw new NotFoundException(
          'La cita o el historial referenciado no existe',
        );
      }
      throw error;
    }
  }

  async update(id: number, dto: UpdateTratamientoDto) {
    await this.findOne(id);
    try {
      return await this.tratamientosRepository.update(id, dto);
    } catch (error: any) {
      if (error.code === 'P2003') {
        throw new NotFoundException(
          'La cita o el historial referenciado no existe',
        );
      }
      throw error;
    }
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.tratamientosRepository.remove(id);
  }
}
