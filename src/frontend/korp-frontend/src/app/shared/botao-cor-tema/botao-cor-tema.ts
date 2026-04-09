import { Component, computed, inject, OnInit } from '@angular/core';
import { Ui } from '../../services/base/ui.service';

@Component({
  selector: 'app-botao-cor-tema',
  templateUrl: './botao-cor-tema.html',
  styleUrl: './botao-cor-tema.scss',
  imports: [],
})
export class BotaoCorTema implements OnInit {
  private ui = inject(Ui);

  initialValue = computed(() => {
    const hue = this.ui.hue();
    return this.getHexFromHsl(hue, 100, 50);
  });

  ngOnInit(): void {
    let hue = sessionStorage.getItem('theme-color') ?? '260';
    this.ui.hue.set(Number(hue));
    document.querySelector("html")?.style.setProperty('--sys-h-cor', hue);
  }

  setColor(event: any) {
    const color = event.target.value;
    const hueNumber = this.getHueFromHex(color);
    document.documentElement.style.setProperty('--sys-h-cor', hueNumber.toString());
    sessionStorage.setItem('theme-color', hueNumber.toString());
  }

  private getHueFromHex(hex: string): number {
    const r = parseInt(hex.slice(1, 3), 16) / 255;
    const g = parseInt(hex.slice(3, 5), 16) / 255;
    const b = parseInt(hex.slice(5, 7), 16) / 255;
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0;
    if (max === min) {
      h = 0;
    } else if (max === r) {
      h = (60 * ((g - b) / (max - min)) + 360) % 360;
    } else if (max === g) {
      h = (60 * ((b - r) / (max - min)) + 120) % 360;
    } else if (max === b) {
      h = (60 * ((r - g) / (max - min)) + 240) % 360;
    }
    return h;
  }

  private getHexFromHsl(h: number, s: number, l: number): string {
    s /= 100;
    l /= 100;
    const c = (1 - Math.abs(2 * l - 1)) * s;
    const x = c * (1 - Math.abs((h / 60) % 2 - 1));
    const m = l - c / 2;
    let r = 0, g = 0, b = 0;
    if (0 <= h && h < 60) {
      r = c; g = x; b = 0;
    } else if (60 <= h && h < 120) {
      r = x; g = c; b = 0;
    } else if (120 <= h && h < 180) {
      r = 0; g = c; b = x;
    } else if (180 <= h && h < 240) {
      r = 0; g = x; b = c;
    } else if (240 <= h && h < 300) {
      r = x; g = 0; b = c;
    } else if (300 <= h && h < 360) {
      r = c; g = 0; b = x;
    }
    r = Math.round((r + m) * 255);
    g = Math.round((g + m) * 255);
    b = Math.round((b + m) * 255);

    return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
  }
}
