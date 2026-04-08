import { Component, OnDestroy, OnInit, effect, inject, signal } from '@angular/core';
import { ProdutosApiService } from '../../services/produtos-api.service';
import { Produto } from './protudos-model';
import { Subject, takeUntil } from 'rxjs';
import { IErrosPadroes } from '../../services/base/base-api.model';
import { RouterOutlet } from '@angular/router';

@Component({
	selector: 'app-produtos-page',
	imports: [RouterOutlet],
	templateUrl: './produtos-page.component.html',
	styleUrl: './produtos-page.component.scss'
})
export class ProdutosPageComponent implements OnInit, OnDestroy {
	private subs = new Subject<void>();
	private readonly produtosApi = inject(ProdutosApiService);

	erro = signal<IErrosPadroes | null>(null);
	produtos = signal<Produto[]>([]);

	constructor() {
		effect(() => {
			if (this.produtosApi.controleReloadListagem()) {
				this.recarregar();
				this.produtosApi.controleReloadListagem.set(false);
			}
		});
	}
	ngOnInit(): void {
		this.recarregar();
	}
	ngOnDestroy(): void {
		this.subs.next();
		this.subs.complete();
	}

	private recarregar(): void {
		this.produtosApi.listar().pipe(takeUntil(this.subs)).subscribe({
			next: (dados) => this.produtos.set(dados),
			error: () => this.erro.set({ mensagem: 'Falha ao carregar produtos.', erros: null })
		});
	}
}
