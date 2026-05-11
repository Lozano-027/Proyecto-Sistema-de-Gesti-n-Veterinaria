/**
 * CONTROLADOR DE CITAS
 *
 * ENDPOINTS:
 *   GET    /api/v1/citas                   → Listar todas
 *   GET    /api/v1/citas/:id               → Obtener por ID
 *   GET    /api/v1/citas/mascota/:mascId   → Citas de una mascota
 *   POST   /api/v1/citas                   → Crear (valida disponibilidad)
 *   PUT    /api/v1/citas/:id               → Actualizar (re-valida disponibilidad)
 *   DELETE /api/v1/citas/:id               → Eliminar
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
import { CitasService } from '../service/citas.service';
import { CreateCitaDto } from '../dto/create-cita.dto';
import { UpdateCitaDto } from '../dto/update-cita.dto';

@Controller('citas')
export class CitasController {
  constructor(private readonly citasService: CitasService) {}

  @Get()
  findAll() {
    return this.citasService.findAll();
  }

  @Get('mascota/:mascId')
  findByMascota(@Param('mascId', ParseIntPipe) mascId: number) {
    return this.citasService.findByMascota(mascId);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.citasService.findOne(id);
  }

  @Post()
  create(@Body() dto: CreateCitaDto) {
    return this.citasService.create(dto);
  }

  @Put(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateCitaDto) {
    return this.citasService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.citasService.remove(id);
  }
}
