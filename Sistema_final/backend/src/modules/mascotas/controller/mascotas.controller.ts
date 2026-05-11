/**
 * CONTROLADOR DE MASCOTAS
 *
 * ENDPOINTS:
 *   GET    /api/v1/mascotas                       → Listar todas
 *   GET    /api/v1/mascotas/:id                   → Obtener por ID
 *   GET    /api/v1/mascotas/propietario/:propId   → Mascotas de un propietario
 *   POST   /api/v1/mascotas                       → Crear
 *   PUT    /api/v1/mascotas/:id                   → Actualizar
 *   DELETE /api/v1/mascotas/:id                   → Eliminar
 *
 * NOTA: el endpoint /propietario/:propId va ANTES de /:id en el orden
 * de los métodos para que NestJS lo enrute correctamente. (En realidad
 * NestJS los distingue por el path; este orden es solo por claridad).
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
import { MascotasService } from '../service/mascotas.service';
import { CreateMascotaDto } from '../dto/create-mascota.dto';
import { UpdateMascotaDto } from '../dto/update-mascota.dto';

@Controller('mascotas')
export class MascotasController {
  constructor(private readonly mascotasService: MascotasService) {}

  @Get()
  findAll() {
    return this.mascotasService.findAll();
  }

  @Get('propietario/:propId')
  findByPropietario(@Param('propId', ParseIntPipe) propId: number) {
    return this.mascotasService.findByPropietario(propId);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.mascotasService.findOne(id);
  }

  @Post()
  create(@Body() dto: CreateMascotaDto) {
    return this.mascotasService.create(dto);
  }

  @Put(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateMascotaDto) {
    return this.mascotasService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.mascotasService.remove(id);
  }
}
