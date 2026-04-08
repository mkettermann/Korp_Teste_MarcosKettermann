import { Component, effect, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { IErrosPadroes } from '../../../services/base/base-api.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProdutosApiService } from '../../../services/produtos-api.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-produtos-excluir',
  templateUrl: './produtos-excluir.html',
  styleUrls: ['./produtos-excluir.scss'],
  imports: [CommonModule, FormsModule],
})
export class ProdutosExcluir implements OnDestroy {
  private subs = new Subject<void>();
  private readonly produtosApi = inject(ProdutosApiService);

  erro = signal<IErrosPadroes | null>(null);

  codigo = signal('');
  descricao = signal('');
  saldo = signal(0);

  constructor() {
    effect(() => {
      const produto = this.produtosApi.modificandoProduto();
      if (produto) {
        this.codigo.set(produto.codigo);
        this.descricao.set(produto.descricao);
        this.saldo.set(produto.saldo);
      }
    });
  }
  ngOnDestroy(): void {
    this.subs.next();
    this.subs.complete();
  }

  excluirProduto(): void {
    this.erro.set(null);
    this.produtosApi
      .excluir({ codigo: this.codigo(), descricao: this.descricao(), saldo: this.saldo() })
      .pipe(takeUntil(this.subs))
      .subscribe({
        next: () => {
          this.codigo.set('');
          this.descricao.set('');
          this.saldo.set(0);

          this.produtosApi.controleReloadListagem.set(true);
        },
        error: (err) => this.erro.set(err?.error ?? { mensagem: 'Falha ao excluir produto.', erros: null })
      });
  }

}
