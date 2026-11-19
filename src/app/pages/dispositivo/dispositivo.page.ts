import { Component, NgZone, OnDestroy, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
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
  IonButton,
  IonInput,
  IonItem,
  IonIcon,
  IonText,
  ToastController,
  ViewWillLeave,
} from '@ionic/angular';
import { addIcons } from 'ionicons';
import {
  playOutline,
  stopOutline,
  saveOutline,
  speedometerOutline,
  personOutline,
} from 'ionicons/icons';
import {
  DispositivoService,
  LecturaAcelerometro,
} from '../../services/dispositivo.service';

@Component({
  selector: 'app-dispositivo',
  templateUrl: './dispositivo.page.html',
  styleUrls: ['./dispositivo.page.scss'],
  imports: [
    CommonModule,
    FormsModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardSubtitle,
    IonCardContent,
    IonButton,
    IonInput,
    IonItem,
    IonIcon,
    IonText,
  ],
})
export class DispositivoPage implements OnInit, OnDestroy, ViewWillLeave {
  private readonly dispositivoService = inject(DispositivoService);
  private readonly ngZone = inject(NgZone);
  private readonly toastCtrl = inject(ToastController);

  lectura: LecturaAcelerometro = { x: 0, y: 0, z: 0 };
  sensorActivo = false;
  mensajeSensor: string | null = null;

  nombreEstudiante = '';
  nombreGuardado = '';

  constructor() {
    addIcons({
      playOutline,
      stopOutline,
      saveOutline,
      speedometerOutline,
      personOutline,
    });
  }

  ngOnInit(): void {
    void this.cargarNombreGuardado();
  }

  ionViewWillLeave(): void {
    void this.detenerLectura();
  }

  ngOnDestroy(): void {
    void this.detenerLectura();
  }

  async iniciarLectura(): Promise<void> {
    this.mensajeSensor = null;

    if (typeof window.DeviceMotionEvent === 'undefined') {
      this.mensajeSensor =
        'El acelerómetro no está disponible en este dispositivo o navegador. Pruébalo en un teléfono físico compatible.';
      return;
    }

    try {
      await this.dispositivoService.iniciarAcelerometro((datos) => {
        this.ngZone.run(() => {
          this.lectura = datos;
        });
      });
      this.sensorActivo = true;
    } catch (error) {
      this.sensorActivo = false;
      this.mensajeSensor =
        error instanceof Error
          ? error.message
          : 'No se pudo iniciar la lectura del acelerómetro en este dispositivo.';
    }
  }

  async detenerLectura(): Promise<void> {
    await this.dispositivoService.detenerAcelerometro();
    this.sensorActivo = false;
  }

  async cargarNombreGuardado(): Promise<void> {
    const nombre = await this.dispositivoService.obtenerNombre();
    this.nombreGuardado = nombre;
    this.nombreEstudiante = nombre;
  }

  async guardarNombre(): Promise<void> {
    const limpio = this.nombreEstudiante.trim();
    if (!limpio) {
      await this.mostrarToast('Ingresa un nombre antes de guardar.', 'warning');
      return;
    }

    await this.dispositivoService.guardarNombre(limpio);
    this.nombreGuardado = limpio;
    await this.mostrarToast('Nombre guardado correctamente.', 'success');
  }

  private async mostrarToast(
    message: string,
    color: 'success' | 'warning',
  ): Promise<void> {
    const toast = await this.toastCtrl.create({
      message,
      duration: 2200,
      position: 'bottom',
      color,
    });
    await toast.present();
  }
}
