export class HistorialClinicoEntity {
  id: number;
  mascotaId: number;
  fecha: Date;
  diagnostico: string;
  observaciones: string | null;
  createdAt: Date;
  updatedAt: Date;
}
