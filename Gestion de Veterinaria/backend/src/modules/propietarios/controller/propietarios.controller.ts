import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { PropietariosService } from '../service/propietarios.service';
import { CreatePropietarioDto, UpdatePropietarioDto } from '../dto/propietario.dto';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { ParseIntPipe } from '../../../common/pipes/parse-int.pipe';

@Controller('propietarios')
@UseGuards(JwtAuthGuard)
export class PropietariosController {
  constructor(private readonly service: PropietariosService) {}

  @Get()
  findAll() { return this.service.findAll(); }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) { return this.service.findOne(id); }

  @Post()
  create(@Body() dto: CreatePropietarioDto) { return this.service.create(dto); }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdatePropietarioDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) { return this.service.remove(id); }
}
