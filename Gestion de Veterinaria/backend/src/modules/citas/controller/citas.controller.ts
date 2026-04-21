import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { CitasService } from '../service/citas.service';
import { CreateCitaDto, UpdateCitaDto } from '../dto/cita.dto';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { ParseIntPipe } from '../../../common/pipes/parse-int.pipe';

@Controller('citas')
@UseGuards(JwtAuthGuard)
export class CitasController {
  constructor(private readonly service: CitasService) {}

  @Get()
  findAll() { return this.service.findAll(); }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) { return this.service.findOne(id); }

  @Get('mascota/:mascotaId')
  findByMascota(@Param('mascotaId', ParseIntPipe) mascotaId: number) {
    return this.service.findByMascota(mascotaId);
  }

  @Post()
  create(@Body() dto: CreateCitaDto) { return this.service.create(dto); }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateCitaDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) { return this.service.remove(id); }
}
