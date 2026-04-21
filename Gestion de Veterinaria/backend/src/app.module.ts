import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsuariosModule } from './modules/usuarios/usuarios.module';
import { PropietariosModule } from './modules/propietarios/propietarios.module';
import { MascotasModule } from './modules/mascotas/mascotas.module';
import { CitasModule } from './modules/citas/citas.module';
import { HistorialModule } from './modules/historial/historial.module';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    UsuariosModule,
    PropietariosModule,
    MascotasModule,
    CitasModule,
    HistorialModule,
  ],
})
export class AppModule {}
