/**
 * MÓDULO DE TRATAMIENTOS — Sprint 4
 *
 * Tratamientos pueden estar asociados a una Cita y/o a un Historial Clínico
 * (al menos uno requerido, validado en el Service).
 */
import { Module } from '@nestjs/common';
import { TratamientosController } from './controller/tratamientos.controller';
import { TratamientosService } from './service/tratamientos.service';
import { TratamientosRepository } from './repository/tratamientos.repository';

@Module({
  controllers: [TratamientosController],
  providers: [TratamientosService, TratamientosRepository],
})
export class TratamientosModule {}
