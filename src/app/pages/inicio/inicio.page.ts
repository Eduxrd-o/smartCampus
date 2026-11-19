import { Component, inject } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { Router } from '@angular/router';
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
  IonIcon,
  IonGrid,
  IonRow,
  IonCol,
  IonButton,
} from '@ionic/angular';
import { addIcons } from 'ionicons';
import {
  schoolOutline,
  homeOutline,
  documentTextOutline,
  peopleOutline,
  phonePortraitOutline,
  arrowForwardOutline,
} from 'ionicons/icons';

interface ModuloResumen {
  titulo: string;
  subtitulo: string;
  descripcion: string;
  icono: string;
  ruta: string;
}

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.page.html',
  styleUrls: ['./inicio.page.scss'],
  imports: [
    CommonModule,
    DatePipe,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardSubtitle,
    IonCardContent,
    IonIcon,
    IonGrid,
    IonRow,
    IonCol,
    IonButton,
  ],
})
export class InicioPage {
  private readonly router = inject(Router);

  readonly fechaActual = new Date();

  readonly modulos: ModuloResumen[] = [
    {
      titulo: 'Inicio',
      subtitulo: 'Pestaña 1',
      descripcion: 'Resumen general de SmartCampus, fecha actual y acceso directo a los módulos.',
      icono: 'home-outline',
      ruta: '/tabs/inicio',
    },
    {
      titulo: 'Actividades',
      subtitulo: 'Pestaña 2',
      descripcion: 'Registro y gestión CRUD de actividades académicas en Cloud Firestore.',
      icono: 'document-text-outline',
      ruta: '/tabs/actividades',
    },
    {
      titulo: 'Usuarios',
      subtitulo: 'Pestaña 3',
      descripcion: 'Consulta de API REST pública con búsqueda por nombre e Infinite Scroll.',
      icono: 'people-outline',
      ruta: '/tabs/usuarios',
    },
    {
      titulo: 'Dispositivo',
      subtitulo: 'Pestaña 4',
      descripcion: 'Lectura del acelerómetro en tiempo real y persistencia local con Capacitor.',
      icono: 'phone-portrait-outline',
      ruta: '/tabs/dispositivo',
    },
  ];

  constructor() {
    addIcons({
      schoolOutline,
      homeOutline,
      documentTextOutline,
      peopleOutline,
      phonePortraitOutline,
      arrowForwardOutline,
    });
  }

  irAModulo(ruta: string): void {
    this.router.navigateByUrl(ruta);
  }
}
