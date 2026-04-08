import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ProdutosApiService } from '../../core/produtos-api.service';
import { Produto } from '../../core/models';

@Component({
	selector: 'app-produtos-page',
	standalone: true,
	imports: [CommonModule, FormsModule],
	template: `
    <section class="panel">
      <h2>Cadastro de Produtos</h2>
      <form class="grid" (ngSubmit)="criarProduto()">
        <label>
          Código
          <input name="codigo" [(ngModel)]="codigo" required />
        </label>
        <label>
          Descrição
          <input name="descricao" [(ngModel)]="descricao" required />
        </label>
        <label>
          Saldo
          <input name="saldo" [(ngModel)]="saldo" type="number" min="0" required />
        </label>
        <button type="submit">Salvar Produto</button>
      </form>
      <p class="error" *ngIf="erro">{{ erro }}</p>
    </section>

    <section class="panel">
      <h3>Produtos cadastrados</h3>
      <table>
        <thead>
          <tr>
            <th>ID</th><th>Código</th><th>Descrição</th><th>Saldo</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let produto of produtos">
            <td>{{ produto.id }}</td>
            <td>{{ produto.codigo }}</td>
            <td>{{ produto.descricao }}</td>
            <td>{{ produto.saldo }}</td>
          </tr>
        </tbody>
      </table>
    </section>
  `
})
export class ProdutosPageComponent implements OnInit {
	private readonly produtosApi = inject(ProdutosApiService);

	produtos: Produto[] = [];
	codigo = '';
	descricao = '';
	saldo = 0;
	erro = '';

	ngOnInit(): void {
		this.recarregar();
	}

	criarProduto(): void {
		this.erro = '';
		this.produtosApi.criar({ codigo: this.codigo, descricao: this.descricao, saldo: this.saldo }).subscribe({
			next: () => {
				this.codigo = '';
				this.descricao = '';
				this.saldo = 0;
				this.recarregar();
			},
			error: (err) => {
				this.erro = err?.error?.title ?? err?.error ?? 'Falha ao cadastrar produto.';
			}
		});
	}

	private recarregar(): void {
		this.produtosApi.listar().subscribe({
			next: (dados) => (this.produtos = dados),
			error: () => (this.erro = 'Falha ao carregar produtos.')
		});
	}
}
