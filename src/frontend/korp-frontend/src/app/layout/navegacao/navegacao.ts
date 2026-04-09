import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { BotaoClaroEscuro } from "../../shared/botao-claro-escuro/botao-claro-escuro";

@Component({
  selector: 'app-navegacao',
  imports: [RouterLink, RouterLinkActive, BotaoClaroEscuro],
  templateUrl: './navegacao.html',
  styleUrl: './navegacao.scss',
})
export class Navegacao {

}
