/**
 * ============================================================
 * SERVICIO DE HISTORIAL CLÍNICO — Sprint 3
 * ============================================================
 *
 * REGLAS DE NEGOCIO:
 *   - findOne lanza 404 si no existe
 *   - create / update detectan P2002 (unicidad mascotaId+fecha) → 409
 *     "Ya existe un historial para esa mascota en esa fecha"
 *   - create / update detectan P2003 (FK mascotaId inválida) → 404
 *
 * MÉTODO ESPECIAL: findByMascotaPaginated()
 *   Retorna estructura uniforme con metadatos de paginación:
 *     {
 *       items: [...],            ← Registros de la página actual
 *       meta: {
 *         page,                  ← Página solicitada
 *         limit,                 ← Tamaño de página
 *         total,                 ← Total de registros (sin paginar)
 *         totalPages             ← Math.ceil(total / limit)
 *       }
 *     }
 *
 *   Esta estructura va dentro del `data` del envoltorio uniforme del
 *   ResponseInterceptor, así que el frontend recibe:
 *     { statusCode, message, data: { items, meta } }
 */
import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { HistorialClinicoRepository } from '../repository/historial-clinico.repository';
import { CreateHistorialClinicoDto } from '../dto/create-historial-clinico.dto';
import { UpdateHistorialClinicoDto } from '../dto/update-historial-clinico.dto';

@Injectable()
export class HistorialClinicoService {
  constructor(
    private readonly historialRepository: HistorialClinicoRepository,
  ) {}

  findAll() {
    return this.historialRepository.findAll();
  }

  async findOne(id: number) {
    const historial = await this.historialRepository.findOne(id);
    if (!historial) {
      throw new NotFoundException(`Historial con ID ${id} no encontrado`);
    }
    return historial;
  }

  async findByMascotaPaginated(
    mascotaId: number,
    page = 1,
    limit = 10,
  ) {
    const { items, total } =
      await this.historialRepository.findByMascotaPaginated(
        mascotaId,
        page,
        limit,
      );

    return {
      items,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit) || 1,
      },
    };
  }

  async create(dto: CreateHistorialClinicoDto) {
    try {
      return await this.historialRepository.create(dto);
    } catch (error: any) {
      if (error.code === 'P2002') {
        throw new ConflictException(
          'Ya existe un historial para esa mascota en esa fecha',
        );
      }
      if (error.code === 'P2003') {
        throw new NotFoundException('La mascota referenciada no existe');
      }
      throw error;
    }
  }

  async update(id: number, dto: UpdateHistorialClinicoDto) {
    await this.findOne(id);
    try {
      return await this.historialRepository.update(id, dto);
    } catch (error: any) {
      if (error.code === 'P2002') {
        throw new ConflictException(
          'Ya existe un historial para esa mascota en esa fecha',
        );
      }
      if (error.code === 'P2003') {
        throw new NotFoundException('La mascota referenciada no existe');
      }
      throw error;
    }
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.historialRepository.remove(id);
  }
}
