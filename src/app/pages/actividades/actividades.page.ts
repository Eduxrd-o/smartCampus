import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonCardContent,
  IonList,
  IonItem,
  IonLabel,
  IonInput,
  IonTextarea,
  IonSelect,
  IonSelectOption,
  IonDatetime,
  IonDatetimeButton,
  IonModal,
  IonRadioGroup,
  IonRadio,
  IonCheckbox,
  IonButton,
  IonBadge,
  IonIcon,
  IonText,
  IonSpinner,
  ToastController,
  AlertController,
} from '@ionic/angular';
import { addIcons } from 'ionicons';
import {
  addCircleOutline,
  checkmarkCircleOutline,
  ellipseOutline,
  trashOutline,
  calendarOutline,
} from 'ionicons/icons';
import {
  Actividad,
  PrioridadActividad,
  TipoActividad,
} from '../../models/actividad.model';
import { ActividadesService } from '../../services/actividades.service';

@Component({
  selector: 'app-actividades',
  templateUrl: './actividades.page.html',
  styleUrls: ['./actividades.page.scss'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardSubtitle,
    IonCardContent,
    IonList,
    IonItem,
    IonLabel,
    IonInput,
    IonTextarea,
    IonSelect,
    IonSelectOption,
    IonDatetime,
    IonDatetimeButton,
    IonModal,
    IonRadioGroup,
    IonRadio,
    IonCheckbox,
    IonButton,
    IonBadge,
    IonIcon,
    IonText,
    IonSpinner,
  ],
})
export class ActividadesPage implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly actividadesService = inject(ActividadesService);
  private readonly toastCtrl = inject(ToastController);
  private readonly alertCtrl = inject(AlertController);

  readonly tipos: TipoActividad[] = [
    'Tarea',
    'Proyecto',
    'Examen',
    'Investigación',
    'Taller',
  ];
  readonly prioridades: PrioridadActividad[] = ['Alta', 'Media', 'Baja'];

  actividades: Actividad[] = [];
  cargando = false;
  guardando = false;
  errorCarga: string | null = null;

  readonly form = this.fb.nonNullable.group({
    titulo: ['', [Validators.required]],
    descripcion: ['', [Validators.required, Validators.minLength(10)]],
    tipo: ['' as TipoActividad | '', [Validators.required]],
    fechaEntrega: [this.hoyISO(), [Validators.required]],
    prioridad: ['Media' as PrioridadActividad, [Validators.required]],
    completada: [false],
  });

  constructor() {
    addIcons({
      addCircleOutline,
      checkmarkCircleOutline,
      ellipseOutline,
      trashOutline,
      calendarOutline,
    });
  }

  ngOnInit(): void {
    void this.cargarActividades();
  }

  private hoyISO(): string {
    return new Date().toISOString().split('T')[0];
  }

  async cargarActividades(): Promise<void> {
    this.cargando = true;
    this.errorCarga = null;
    try {
      this.actividades = await this.actividadesService.obtenerActividades();
    } catch (error) {
      this.errorCarga =
        error instanceof Error
          ? error.message
          : 'No se pudieron cargar las actividades.';
    } finally {
      this.cargando = false;
    }
  }

  onFechaChange(event: CustomEvent): void {
    const valor = event.detail.value;
    if (typeof valor === 'string') {
      this.form.patchValue({ fechaEntrega: valor.split('T')[0] });
    }
  }

  async guardarActividad(): Promise<void> {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      await this.mostrarToast('Completa correctamente todos los campos requeridos.', 'warning');
      return;
    }

    const raw = this.form.getRawValue();
    const nuevaActividad: Omit<Actividad, 'id'> = {
      titulo: raw.titulo.trim(),
      descripcion: raw.descripcion.trim(),
      tipo: raw.tipo as TipoActividad,
      fechaEntrega: raw.fechaEntrega.split('T')[0],
      prioridad: raw.prioridad,
      completada: raw.completada,
    };

    this.guardando = true;
    try {
      await this.actividadesService.crearActividad(nuevaActividad);
      await this.mostrarToast('Actividad guardada en Firestore.', 'success');
      this.form.reset({
        titulo: '',
        descripcion: '',
        tipo: '',
        fechaEntrega: this.hoyISO(),
        prioridad: 'Media',
        completada: false,
      });
      await this.cargarActividades();
    } catch (error) {
      const mensaje =
        error instanceof Error ? error.message : 'Error al guardar la actividad.';
      await this.mostrarToast(mensaje, 'danger');
    } finally {
      this.guardando = false;
    }
  }

  async alternarCompletada(actividad: Actividad): Promise<void> {
    if (!actividad.id) return;

    const nuevoEstado = !actividad.completada;
    try {
      await this.actividadesService.actualizarEstado(actividad.id, nuevoEstado);
      actividad.completada = nuevoEstado;
      await this.mostrarToast(
        nuevoEstado ? 'Actividad marcada como completada.' : 'Actividad marcada como pendiente.',
        'success',
      );
    } catch {
      await this.mostrarToast('No se pudo actualizar el estado.', 'danger');
    }
  }

  async confirmarEliminacion(actividad: Actividad): Promise<void> {
    if (!actividad.id) return;

    const alert = await this.alertCtrl.create({
      header: 'Eliminar actividad',
      message: `¿Seguro que deseas eliminar "${actividad.titulo}"?`,
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Eliminar',
          role: 'destructive',
          handler: () => {
            void this.eliminarActividad(actividad.id!);
          },
        },
      ],
    });

    await alert.present();
  }

  private async eliminarActividad(id: string): Promise<void> {
    try {
      await this.actividadesService.eliminarActividad(id);
      this.actividades = this.actividades.filter((item) => item.id !== id);
      await this.mostrarToast('Actividad eliminada.', 'success');
    } catch {
      await this.mostrarToast('No se pudo eliminar la actividad.', 'danger');
    }
  }

  colorPrioridad(prioridad: PrioridadActividad): string {
    switch (prioridad) {
      case 'Alta':
        return 'danger';
      case 'Media':
        return 'warning';
      case 'Baja':
        return 'success';
    }
  }

  private async mostrarToast(
    message: string,
    color: 'success' | 'warning' | 'danger',
  ): Promise<void> {
    const toast = await this.toastCtrl.create({
      message,
      duration: 2500,
      position: 'bottom',
      color,
    });
    await toast.present();
  }
}
