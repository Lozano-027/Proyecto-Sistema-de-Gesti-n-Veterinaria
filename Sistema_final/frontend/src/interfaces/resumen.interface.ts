/** Datos del endpoint GET /reportes/resumen */
export interface ResumenDashboard {
  totalPropietarios: number;
  totalMascotas: number;
  totalCitas: number;
  citasHoy: number;
  citasProgramadas: number;
  totalHistoriales: number;
}
