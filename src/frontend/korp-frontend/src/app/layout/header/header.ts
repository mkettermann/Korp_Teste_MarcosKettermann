import { Component } from '@angular/core';
import { Navegacao } from '../navegacao/navegacao';
import { BotaoClaroEscuro } from "../../shared/botao-claro-escuro/botao-claro-escuro";

@Component({
  selector: 'app-header',
  templateUrl: './header.html',
  styleUrl: './header.scss',
  imports: [Navegacao]
})
export class Header {

}
