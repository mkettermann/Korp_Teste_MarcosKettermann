import { Component, inject, signal } from '@angular/core';
import { IErrosPadroes } from '../../../services/base/base-api.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProdutosApiService } from '../../../services/produtos-api.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-produtos-novo',
  templateUrl: './produtos-novo.html',
  styleUrl: './produtos-novo.scss',
  imports: [CommonModule, FormsModule],
})
export class ProdutosNovo {
  private subs = new Subject<void>();
  private readonly produtosApi = inject(ProdutosApiService);

  erro = signal<IErrosPadroes | null>(null);
  codigo = signal('');
  descricao = signal('');
  saldo = signal(0);

  criarProduto(): void {
    this.erro.set(null);
    this.produtosApi
      .criar({ codigo: this.codigo(), descricao: this.descricao(), saldo: this.saldo() })
      .pipe(takeUntil(this.subs))
      .subscribe({
        next: () => {
          this.codigo.set('');
          this.descricao.set('');
          this.saldo.set(0);
          this.produtosApi.controleReloadListagem.set(true);
          // this.recarregar();
        },
        error: (err) => this.erro.set(err?.error ?? { mensagem: 'Falha ao cadastrar produto.', erros: null })
      });
  }

}
