import { Module } from '@nestjs/common';
import { PropietariosController } from './controller/propietarios.controller';
import { PropietariosService } from './service/propietarios.service';
import { PropietariosRepository } from './repository/propietarios.repository';

@Module({
  controllers: [PropietariosController],
  providers: [PropietariosService, PropietariosRepository],
  exports: [PropietariosService],
})
export class PropietariosModule {}
