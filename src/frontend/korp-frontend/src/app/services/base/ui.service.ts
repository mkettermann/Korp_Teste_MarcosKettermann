import { Injectable, signal } from '@angular/core';
import { IThemeLightness } from './base-api.model';

@Injectable({ providedIn: 'root' })
export class Ui {

  lightness = signal<IThemeLightness>('light');
  hue = signal<number>(260);

  static wait = (ms: number) => {
    return new Promise(r => setTimeout(r, ms))
  };

}

