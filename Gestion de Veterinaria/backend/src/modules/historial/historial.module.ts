import { Module } from '@nestjs/common';
import { HistorialController } from './controller/historial.controller';
import { HistorialService } from './service/historial.service';
import { HistorialRepository } from './repository/historial.repository';

@Module({
  controllers: [HistorialController],
  providers: [HistorialService, HistorialRepository],
  exports: [HistorialService],
})
export class HistorialModule {}
