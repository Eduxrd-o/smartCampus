export type TipoActividad = 'Tarea' | 'Proyecto' | 'Examen' | 'Investigación' | 'Taller';
export type PrioridadActividad = 'Alta' | 'Media' | 'Baja';

export interface Actividad {
  id?: string;
  titulo: string;
  descripcion: string;
  tipo: TipoActividad;
  fechaEntrega: string;
  prioridad: PrioridadActividad;
  completada: boolean;
}
