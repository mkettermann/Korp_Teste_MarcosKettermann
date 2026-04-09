import { Component, computed, inject, OnInit } from '@angular/core';
import { Ui } from '../../services/base/ui.service';

@Component({
  selector: 'app-botao-claro-escuro',
  templateUrl: './botao-claro-escuro.html',
  styleUrl: './botao-claro-escuro.scss',
  imports: [],
})
export class BotaoClaroEscuro implements OnInit {
  private ui = inject(Ui);

  lightness = computed(() => { return this.ui.lightness(); });

  ngOnInit(): void {
    if (sessionStorage.getItem('theme') === 'dark') {
      document.querySelector("html")?.classList.add('dark-theme');
      this.ui.lightness.set('dark');
    } else {
      document.querySelector("html")?.classList.add('light-theme');
      this.ui.lightness.set('light');
    }
  }

  setlightDark() {
    // UPDATE
    if (this.lightness() === 'light') {
      this.ui.lightness.set('dark');
      document.querySelector("html")?.classList.add('dark-theme');
      document.querySelector("html")?.classList.remove('light-theme');
      sessionStorage.setItem('theme', 'dark');
    } else {
      this.ui.lightness.set('light');
      document.querySelector("html")?.classList.add('light-theme');
      document.querySelector("html")?.classList.remove('dark-theme');
      sessionStorage.setItem('theme', 'light');
    }
  }

}
