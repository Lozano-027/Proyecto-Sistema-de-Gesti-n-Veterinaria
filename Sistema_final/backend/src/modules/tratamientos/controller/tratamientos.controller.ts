/**
 * CONTROLADOR DE TRATAMIENTOS — Sprint 4
 *
 * ENDPOINTS:
 *   GET    /api/v1/tratamientos                       → Listar todos
 *   GET    /api/v1/tratamientos/:id                   → Obtener por ID
 *   GET    /api/v1/tratamientos/cita/:citaId          → Por cita
 *   GET    /api/v1/tratamientos/historial/:histId     → Por historial
 *   POST   /api/v1/tratamientos                       → Crear
 *   PUT    /api/v1/tratamientos/:id                   → Actualizar
 *   DELETE /api/v1/tratamientos/:id                   → Eliminar
 */
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { TratamientosService } from '../service/tratamientos.service';
import { CreateTratamientoDto } from '../dto/create-tratamiento.dto';
import { UpdateTratamientoDto } from '../dto/update-tratamiento.dto';

@Controller('tratamientos')
export class TratamientosController {
  constructor(private readonly tratamientosService: TratamientosService) {}

  @Get()
  findAll() {
    return this.tratamientosService.findAll();
  }

  @Get('cita/:citaId')
  findByCita(@Param('citaId', ParseIntPipe) citaId: number) {
    return this.tratamientosService.findByCita(citaId);
  }

  @Get('historial/:histId')
  findByHistorial(@Param('histId', ParseIntPipe) histId: number) {
    return this.tratamientosService.findByHistorial(histId);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.tratamientosService.findOne(id);
  }

  @Post()
  create(@Body() dto: CreateTratamientoDto) {
    return this.tratamientosService.create(dto);
  }

  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateTratamientoDto,
  ) {
    return this.tratamientosService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.tratamientosService.remove(id);
  }
}
