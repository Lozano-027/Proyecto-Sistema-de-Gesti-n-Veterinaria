import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { MascotasService } from '../service/mascotas.service';
import { CreateMascotaDto, UpdateMascotaDto } from '../dto/mascota.dto';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { ParseIntPipe } from '../../../common/pipes/parse-int.pipe';

@Controller('mascotas')
@UseGuards(JwtAuthGuard)
export class MascotasController {
  constructor(private readonly service: MascotasService) {}

  @Get()
  findAll() { return this.service.findAll(); }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) { return this.service.findOne(id); }

  @Get('propietario/:propietarioId')
  findByPropietario(@Param('propietarioId', ParseIntPipe) propietarioId: number) {
    return this.service.findByPropietario(propietarioId);
  }

  @Post()
  create(@Body() dto: CreateMascotaDto) { return this.service.create(dto); }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateMascotaDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) { return this.service.remove(id); }
}
