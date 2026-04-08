import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ProdutosApiService } from '../../services/produtos-api.service';
import { Produto } from './protudos-model';
import { Subject, takeUntil } from 'rxjs';

@Component({
	selector: 'app-produtos-page',
	imports: [CommonModule, FormsModule],
	templateUrl: './produtos-page.component.html',
})
export class ProdutosPageComponent implements OnInit, OnDestroy {
	private subs = new Subject<void>();
	private readonly produtosApi = inject(ProdutosApiService);

	produtos: Produto[] = [];
	codigo = '';
	descricao = '';
	saldo = 0;
	erro = '';

	ngOnInit(): void {
		this.recarregar();
	}
	ngOnDestroy(): void {
		this.subs.next();
		this.subs.complete();
	}

	criarProduto(): void {
		this.erro = '';
		this.produtosApi
			.criar({ codigo: this.codigo, descricao: this.descricao, saldo: this.saldo })
			.pipe(takeUntil(this.subs))
			.subscribe({
				next: () => {
					this.codigo = '';
					this.descricao = '';
					this.saldo = 0;
					this.recarregar();
				},
				error: (err) => (this.erro = err?.error?.title ?? err?.error ?? 'Falha ao cadastrar produto.')
			});
	}

	private recarregar(): void {
		this.produtosApi.listar().pipe(takeUntil(this.subs)).subscribe({
			next: (dados) => (this.produtos = dados),
			error: () => (this.erro = 'Falha ao carregar produtos.')
		});
	}
}
