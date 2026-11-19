import { Injectable } from '@angular/core';
import { PluginListenerHandle } from '@capacitor/core';
import { Motion } from '@capacitor/motion';
import { Preferences } from '@capacitor/preferences';

export interface LecturaAcelerometro {
  x: number;
  y: number;
  z: number;
}

@Injectable({
  providedIn: 'root',
})
export class DispositivoService {
  private readonly claveNombre = 'nombre_estudiante';
  private accelListener: PluginListenerHandle | null = null;

  async iniciarAcelerometro(
    onData: (lectura: LecturaAcelerometro) => void,
  ): Promise<void> {
    await this.detenerAcelerometro();

    const win = window as Window & {
      DeviceMotionEvent?: typeof DeviceMotionEvent & {
        requestPermission?: () => Promise<'granted' | 'denied'>;
      };
    };

    if (typeof win.DeviceMotionEvent?.requestPermission === 'function') {
      const permiso = await win.DeviceMotionEvent.requestPermission();
      if (permiso !== 'granted') {
        throw new Error('Permiso de sensor denegado por el usuario.');
      }
    }

    this.accelListener = await Motion.addListener('accel', (event) => {
      const acc = event.accelerationIncludingGravity ?? event.acceleration;
      if (acc) {
        onData({
          x: acc.x ?? 0,
          y: acc.y ?? 0,
          z: acc.z ?? 0,
        });
      }
    });
  }

  async detenerAcelerometro(): Promise<void> {
    if (this.accelListener) {
      await this.accelListener.remove();
      this.accelListener = null;
    }
  }

  async guardarNombre(nombre: string): Promise<void> {
    await Preferences.set({
      key: this.claveNombre,
      value: nombre.trim(),
    });
  }

  async obtenerNombre(): Promise<string> {
    const { value } = await Preferences.get({ key: this.claveNombre });
    return value ?? '';
  }
}
