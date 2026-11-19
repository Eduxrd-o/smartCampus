import { Injectable } from '@angular/core';
import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import {
  getFirestore,
  Firestore,
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
} from 'firebase/firestore';
import { environment } from '../../environments/environment';
import { Actividad } from '../models/actividad.model';

@Injectable({
  providedIn: 'root',
})
export class ActividadesService {
  private readonly coleccion = 'actividades';
  private db: Firestore | null = null;

  private getFirestoreInstance(): Firestore {
    if (
      !environment.firebaseConfig.apiKey ||
      environment.firebaseConfig.apiKey === 'TU_API_KEY'
    ) {
      throw new Error('Configura tus credenciales de Firebase en src/environments/environment.ts.');
    }

    if (!this.db) {
      const app: FirebaseApp = getApps().length
        ? getApp()
        : initializeApp(environment.firebaseConfig);
      this.db = getFirestore(app);
    }

    return this.db;
  }

  async obtenerActividades(): Promise<Actividad[]> {
    const db = this.getFirestoreInstance();
    const snapshot = await getDocs(collection(db, this.coleccion));
    return snapshot.docs.map((documento) => ({
      id: documento.id,
      ...(documento.data() as Omit<Actividad, 'id'>),
    }));
  }

  async crearActividad(actividad: Omit<Actividad, 'id'>): Promise<string> {
    const db = this.getFirestoreInstance();
    const docRef = await addDoc(collection(db, this.coleccion), actividad);
    return docRef.id;
  }

  async actualizarEstado(id: string, completada: boolean): Promise<void> {
    const db = this.getFirestoreInstance();
    const docRef = doc(db, this.coleccion, id);
    await updateDoc(docRef, { completada });
  }

  async eliminarActividad(id: string): Promise<void> {
    const db = this.getFirestoreInstance();
    const docRef = doc(db, this.coleccion, id);
    await deleteDoc(docRef);
  }
}
