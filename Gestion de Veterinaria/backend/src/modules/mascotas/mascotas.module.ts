import { Module } from '@nestjs/common';
import { MascotasController } from './controller/mascotas.controller';
import { MascotasService } from './service/mascotas.service';
import { MascotasRepository } from './repository/mascotas.repository';

@Module({
  controllers: [MascotasController],
  providers: [MascotasService, MascotasRepository],
  exports: [MascotasService],
})
export class MascotasModule {}
