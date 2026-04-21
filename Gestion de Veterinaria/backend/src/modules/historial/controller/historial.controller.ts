import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { HistorialService } from '../service/historial.service';
import { CreateHistorialDto, UpdateHistorialDto } from '../dto/historial.dto';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { ParseIntPipe } from '../../../common/pipes/parse-int.pipe';

@Controller('historial')
@UseGuards(JwtAuthGuard)
export class HistorialController {
  constructor(private readonly service: HistorialService) {}

  @Get()
  findAll() { return this.service.findAll(); }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) { return this.service.findOne(id); }

  @Get('mascota/:mascotaId')
  findByMascota(@Param('mascotaId', ParseIntPipe) mascotaId: number) {
    return this.service.findByMascota(mascotaId);
  }

  @Post()
  create(@Body() dto: CreateHistorialDto) { return this.service.create(dto); }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateHistorialDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) { return this.service.remove(id); }
}
