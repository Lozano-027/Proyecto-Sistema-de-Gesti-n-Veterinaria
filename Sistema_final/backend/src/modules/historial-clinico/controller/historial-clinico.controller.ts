/**
 * ============================================================
 * CONTROLADOR DE HISTORIAL CLÍNICO
 * ============================================================
 *
 * ENDPOINTS:
 *   GET    /api/v1/historial-clinico                            → Listar todos
 *   GET    /api/v1/historial-clinico/:id                        → Por ID
 *   GET    /api/v1/historial-clinico/mascota/:mascId            → Paginado por mascota
 *           ?page=1&limit=10                                       (PaginateDto valida los query params)
 *   POST   /api/v1/historial-clinico                            → Crear
 *   PUT    /api/v1/historial-clinico/:id                        → Actualizar
 *   DELETE /api/v1/historial-clinico/:id                        → Eliminar
 *
 * USO DE @Query():
 *   @Query() pagination: PaginateDto recibe TODOS los query params.
 *   El ValidationPipe global (definido en main.ts con transform:true)
 *   convierte automáticamente "?page=2&limit=20" en un PaginateDto válido.
 */
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { HistorialClinicoService } from '../service/historial-clinico.service';
import { CreateHistorialClinicoDto } from '../dto/create-historial-clinico.dto';
import { UpdateHistorialClinicoDto } from '../dto/update-historial-clinico.dto';
import { PaginateDto } from '../dto/paginate.dto';

@Controller('historial-clinico')
export class HistorialClinicoController {
  constructor(
    private readonly historialService: HistorialClinicoService,
  ) {}

  @Get()
  findAll() {
    return this.historialService.findAll();
  }

  @Get('mascota/:mascId')
  findByMascotaPaginated(
    @Param('mascId', ParseIntPipe) mascId: number,
    @Query() pagination: PaginateDto,
  ) {
    return this.historialService.findByMascotaPaginated(
      mascId,
      pagination.page,
      pagination.limit,
    );
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.historialService.findOne(id);
  }

  @Post()
  create(@Body() dto: CreateHistorialClinicoDto) {
    return this.historialService.create(dto);
  }

  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateHistorialClinicoDto,
  ) {
    return this.historialService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.historialService.remove(id);
  }
}
