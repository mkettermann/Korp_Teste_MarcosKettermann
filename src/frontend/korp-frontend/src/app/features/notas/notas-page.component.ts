import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ProdutosApiService } from '../../services/produtos-api.service';
import { NotaFiscal } from './notas-model';
import { Produto } from '../produtos/protudos-model';
import { NotasApiService } from '../../services/notas-api.service';
import { Subject, Subscription, takeUntil } from 'rxjs';

@Component({
	selector: 'app-notas-page',
	imports: [CommonModule, FormsModule],
	templateUrl: './notas-page.component.html',
})
export class NotasPageComponent implements OnInit, OnDestroy {

	private subs = new Subject<void>();

	private readonly notasApi = inject(NotasApiService);
	private readonly produtosApi = inject(ProdutosApiService);

	produtos: Produto[] = [];
	notas: NotaFiscal[] = [];
	itensNovaNota: Array<{ produtoId: number; descricaoProduto: string; quantidade: number }> = [];

	produtoSelecionadoId: number | null = null;
	quantidade = 1;
	erro = '';
	imprimindoId: number | null = null;

	ngOnInit(): void {
		this.carregarProdutos();
		this.carregarNotas();
	}
	ngOnDestroy(): void {
		this.subs.next();
		this.subs.complete();
	}

	adicionarItem(): void {
		if (!this.produtoSelecionadoId || this.quantidade <= 0) {
			return;
		}

		const produto = this.produtos.find((p) => p.id === this.produtoSelecionadoId);
		if (!produto) {
			return;
		}

		this.itensNovaNota.push({
			produtoId: produto.id,
			descricaoProduto: produto.descricao,
			quantidade: this.quantidade
		});

		this.produtoSelecionadoId = null;
		this.quantidade = 1;
	}

	removerItem(index: number): void {
		this.itensNovaNota.splice(index, 1);
	}

	criarNota(): void {
		this.erro = '';
		this.notasApi.criar({ itens: this.itensNovaNota }).pipe(takeUntil(this.subs)).subscribe({
			next: () => {
				this.itensNovaNota = [];
				this.carregarNotas();
			},
			error: (err) => {
				this.erro = err?.error?.title ?? err?.error ?? 'Falha ao criar nota fiscal.';
			}
		});
	}

	imprimir(notaId: number): void {
		this.erro = '';
		this.imprimindoId = notaId;
		const idempotencyKey = crypto.randomUUID();

		this.notasApi.imprimir(notaId, idempotencyKey).pipe(takeUntil(this.subs)).subscribe({
			next: (response) => {
				this.downloadPdf(response.pdfBase64, `nota-${response.numero}.pdf`);
				this.carregarNotas();
				this.carregarProdutos();
			},
			error: (err) => {
				this.erro = err?.error?.mensagem ?? err?.error?.title ?? 'Falha ao imprimir nota fiscal.';
			},
			complete: () => {
				this.imprimindoId = null;
			}
		});
	}

	private carregarProdutos(): void {
		this.produtosApi.listar().pipe(takeUntil(this.subs)).subscribe({
			next: (dados) => (this.produtos = dados),
			error: () => (this.erro = 'Falha ao carregar produtos.')
		});
	}

	private carregarNotas(): void {
		this.notasApi.listar().pipe(takeUntil(this.subs)).subscribe({
			next: (dados) => (this.notas = dados),
			error: () => (this.erro = 'Falha ao carregar notas fiscais.')
		});
	}

	private downloadPdf(base64: string, nomeArquivo: string): void {
		const binary = atob(base64);
		const bytes = new Uint8Array(binary.length);
		for (let i = 0; i < binary.length; i++) {
			bytes[i] = binary.charCodeAt(i);
		}

		const blob = new Blob([bytes], { type: 'application/pdf' });
		const url = URL.createObjectURL(blob);
		const link = document.createElement('a');
		link.href = url;
		link.download = nomeArquivo;
		link.click();
		URL.revokeObjectURL(url);
	}
}
