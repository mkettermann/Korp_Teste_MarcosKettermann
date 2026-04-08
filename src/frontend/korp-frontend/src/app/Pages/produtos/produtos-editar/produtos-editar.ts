import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { IErrosPadroes } from '../../../services/base/base-api.model';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';
import { ProdutosApiService } from '../../../services/produtos-api.service';

@Component({
  selector: 'app-produtos-editar',
  templateUrl: './produtos-editar.html',
  styleUrl: './produtos-editar.scss',
  imports: [CommonModule, FormsModule],
})
export class ProdutosEditar implements OnInit, OnDestroy {
  private subs = new Subject<void>();
  private readonly produtosApi = inject(ProdutosApiService);

  erro = signal<IErrosPadroes | null>(null);

  codigo = signal('');
  descricao = signal('');
  saldo = signal(0);

  ngOnInit(): void {
    // Aqui você pode carregar os dados do produto a ser editado, usando um serviço para buscar pelo ID
  }
  ngOnDestroy(): void {
    this.subs.next();
    this.subs.complete();
  }

  editarProduto(): void {
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
        },
        error: (err) => this.erro.set(err?.error ?? { mensagem: 'Falha ao cadastrar produto.', erros: null })
      });
  }
}
