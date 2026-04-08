import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ProdutosApiService } from '../../services/produtos-api.service';
import { Produto } from './protudos-model';
import { Subject, takeUntil } from 'rxjs';
import { IErrosPadroes } from '../../services/base/base-api.model';

@Component({
	selector: 'app-produtos-page',
	imports: [CommonModule, FormsModule],
	templateUrl: './produtos-page.component.html',
	styleUrl: './produtos-page.component.scss'
})
export class ProdutosPageComponent implements OnInit, OnDestroy {
	private subs = new Subject<void>();
	private readonly produtosApi = inject(ProdutosApiService);

	erro = signal<IErrosPadroes | null>(null);
	produtos = signal<Produto[]>([]);
	codigo = signal('');
	descricao = signal('');
	saldo = signal(0);

	ngOnInit(): void {
		this.recarregar();
	}
	ngOnDestroy(): void {
		this.subs.next();
		this.subs.complete();
	}

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
					this.recarregar();
				},
				error: (err) => this.erro.set(err?.error ?? { mensagem: 'Falha ao cadastrar produto.', erros: null })
			});
	}

	private recarregar(): void {
		this.produtosApi.listar().pipe(takeUntil(this.subs)).subscribe({
			next: (dados) => this.produtos.set(dados),
			error: () => this.erro.set({ mensagem: 'Falha ao carregar produtos.', erros: null })
		});
	}
}
