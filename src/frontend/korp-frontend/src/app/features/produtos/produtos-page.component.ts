import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ProdutosApiService } from '../../services/produtos-api.service';
import { Produto } from './protudos-model';

@Component({
	selector: 'app-produtos-page',
	imports: [CommonModule, FormsModule],
	templateUrl: './produtos-page.component.html',
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
