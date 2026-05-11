export class TratamientoEntity {
  id: number;
  historialClinicoId: number | null;
  citaId: number | null;
  medicamento: string;
  dosis: string;
  duracion: string;
  indicaciones: string | null;
  createdAt: Date;
  updatedAt: Date;
}
