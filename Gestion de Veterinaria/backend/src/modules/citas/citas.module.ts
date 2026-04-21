import { Module } from '@nestjs/common';
import { CitasController } from './controller/citas.controller';
import { CitasService } from './service/citas.service';
import { CitasRepository } from './repository/citas.repository';

@Module({
  controllers: [CitasController],
  providers: [CitasService, CitasRepository],
  exports: [CitasService],
})
export class CitasModule {}
