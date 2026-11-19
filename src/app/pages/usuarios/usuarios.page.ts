import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonSearchbar,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonCardContent,
  IonIcon,
  IonInfiniteScroll,
  IonInfiniteScrollContent,
  IonSpinner,
  IonButton,
  IonText,
  InfiniteScrollCustomEvent,
} from '@ionic/angular';
import { addIcons } from 'ionicons';
import { mailOutline, callOutline, personCircleOutline, refreshOutline } from 'ionicons/icons';
import { Usuario } from '../../models/usuario.model';
import { UsuariosService } from '../../services/usuarios.service';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.page.html',
  styleUrls: ['./usuarios.page.scss'],
  imports: [
    CommonModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonSearchbar,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardSubtitle,
    IonCardContent,
    IonIcon,
    IonInfiniteScroll,
    IonInfiniteScrollContent,
    IonSpinner,
    IonButton,
    IonText,
  ],
})
export class UsuariosPage implements OnInit {
  private readonly usuariosService = inject(UsuariosService);

  private readonly tamanioPagina = 4;
  private todosUsuarios: Usuario[] = [];
  private usuariosFiltrados: Usuario[] = [];

  usuariosVisibles: Usuario[] = [];
  terminoBusqueda = '';
  cargando = false;
  errorMensaje: string | null = null;

  constructor() {
    addIcons({
      mailOutline,
      callOutline,
      personCircleOutline,
      refreshOutline,
    });
  }

  ngOnInit(): void {
    this.cargarUsuarios();
  }

  get hayMasUsuarios(): boolean {
    return this.usuariosVisibles.length < this.usuariosFiltrados.length;
  }

  cargarUsuarios(): void {
    this.cargando = true;
    this.errorMensaje = null;

    this.usuariosService.obtenerUsuarios().subscribe({
      next: (usuarios) => {
        this.todosUsuarios = usuarios;
        this.aplicarFiltroYReiniciarLista();
        this.cargando = false;
      },
      error: () => {
        this.errorMensaje =
          'No se pudo obtener la lista de usuarios. Verifica tu conexión e inténtalo nuevamente.';
        this.cargando = false;
      },
    });
  }

  buscarUsuario(event: CustomEvent): void {
    const valor = (event.detail.value ?? '') as string;
    this.terminoBusqueda = valor.trim().toLowerCase();
    this.aplicarFiltroYReiniciarLista();
  }

  cargarMas(event: InfiniteScrollCustomEvent): void {
    const inicio = this.usuariosVisibles.length;
    const siguientes = this.usuariosFiltrados.slice(inicio, inicio + this.tamanioPagina);
    this.usuariosVisibles = [...this.usuariosVisibles, ...siguientes];
    void event.target.complete();
  }

  private aplicarFiltroYReiniciarLista(): void {
    if (!this.terminoBusqueda) {
      this.usuariosFiltrados = [...this.todosUsuarios];
    } else {
      this.usuariosFiltrados = this.todosUsuarios.filter((usuario) =>
        usuario.name.toLowerCase().includes(this.terminoBusqueda),
      );
    }
    this.usuariosVisibles = this.usuariosFiltrados.slice(0, this.tamanioPagina);
  }
}
