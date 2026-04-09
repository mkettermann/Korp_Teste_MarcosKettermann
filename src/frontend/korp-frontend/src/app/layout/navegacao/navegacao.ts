import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { BotaoClaroEscuro } from "../../shared/botao-claro-escuro/botao-claro-escuro";
import { BotaoCorTema } from '../../shared/botao-cor-tema/botao-cor-tema';

@Component({
  selector: 'app-navegacao',
  imports: [RouterLink, RouterLinkActive, BotaoClaroEscuro, BotaoCorTema],
  templateUrl: './navegacao.html',
  styleUrl: './navegacao.scss',
})
export class Navegacao {

}
