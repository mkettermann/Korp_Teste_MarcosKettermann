import { Component, OnDestroy, OnInit, effect, inject, signal } from '@angular/core';
import { ProdutosApiService } from '../../services/produtos-api.service';
import { Produto } from './produtos-model';
import { Subject, takeUntil, delay } from 'rxjs';
import { IErrosPadroes } from '../../services/base/base-api.model';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
	selector: 'app-produtos-page',
	templateUrl: './produtos-page.component.html',
	styleUrl: './produtos-page.component.scss',
	imports: [RouterOutlet, RouterLink, RouterLinkActive],
})
export class ProdutosPageComponent implements OnInit, OnDestroy {

	private subs = new Subject<void>();
	protected readonly produtosApi = inject(ProdutosApiService);

	erro = signal<IErrosPadroes | null>(null);
	produtos = signal<Produto[]>([]);
	listagemCarregando = signal(false);

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
		this.listagemCarregando.set(true);
		this.produtosApi.listar().pipe(
			// delay(3000),
			takeUntil(this.subs)).subscribe({
				next: (dados) => {
					this.produtos.set(dados);
					this.listagemCarregando.set(false);
				},
				error: () => {
					this.erro.set({ mensagem: 'Falha ao carregar produtos.', erros: null });
					this.listagemCarregando.set(false);
				}
			});
	}

}
