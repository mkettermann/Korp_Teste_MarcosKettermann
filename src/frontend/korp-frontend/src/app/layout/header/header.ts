import { Component } from '@angular/core';
import { Navegacao } from '../navegacao/navegacao';

@Component({
  selector: 'app-header',
  templateUrl: './header.html',
  styleUrl: './header.scss',
  imports: [Navegacao]
})
export class Header {

}
