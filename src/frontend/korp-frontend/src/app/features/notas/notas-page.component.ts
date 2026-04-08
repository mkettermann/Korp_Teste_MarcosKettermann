import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NotasApiService } from '../../core/notas-api.service';
import { ProdutosApiService } from '../../core/produtos-api.service';
import { NotaFiscal, Produto } from '../../core/models';

@Component({
	selector: 'app-notas-page',
	standalone: true,
	imports: [CommonModule, FormsModule],
	template: `
    <section class="panel">
      <h2>Cadastro de Nota Fiscal</h2>
      <form class="grid" (ngSubmit)="adicionarItem()">
        <label>
          Produto
          <select name="produto" [(ngModel)]="produtoSelecionadoId" required>
            <option [ngValue]="null">Selecione...</option>
            <option *ngFor="let p of produtos" [ngValue]="p.id">{{ p.codigo }} - {{ p.descricao }} (saldo {{ p.saldo }})</option>
          </select>
        </label>
        <label>
          Quantidade
          <input name="quantidade" [(ngModel)]="quantidade" type="number" min="1" required />
        </label>
        <button type="submit">Adicionar item</button>
      </form>

      <table>
        <thead>
          <tr><th>Produto</th><th>Quantidade</th></tr>
        </thead>
        <tbody>
          <tr *ngFor="let item of itensNovaNota; let idx = index">
            <td>{{ item.descricaoProduto }}</td>
            <td>{{ item.quantidade }}</td>
            <td><button type="button" (click)="removerItem(idx)">Remover</button></td>
          </tr>
        </tbody>
      </table>

      <button [disabled]="itensNovaNota.length === 0" (click)="criarNota()">Criar Nota (status Aberta)</button>
      <p class="error" *ngIf="erro">{{ erro }}</p>
    </section>

    <section class="panel">
      <h3>Notas Fiscais</h3>
      <table>
        <thead>
          <tr><th>Número</th><th>Status</th><th>Itens</th><th>Ações</th></tr>
        </thead>
        <tbody>
          <tr *ngFor="let nota of notas">
            <td>{{ nota.numeroSequencial }}</td>
            <td>{{ nota.status }}</td>
            <td>{{ nota.itens.length }}</td>
            <td>
              <button
                [disabled]="nota.status !== 'Aberta' || imprimindoId === nota.id"
                (click)="imprimir(nota.id)">
                {{ imprimindoId === nota.id ? 'Processando...' : 'Imprimir' }}
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </section>
  `
})
export class NotasPageComponent implements OnInit {
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
		this.notasApi.criar({ itens: this.itensNovaNota }).subscribe({
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

		this.notasApi.imprimir(notaId, idempotencyKey).subscribe({
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
		this.produtosApi.listar().subscribe({
			next: (dados) => (this.produtos = dados),
			error: () => (this.erro = 'Falha ao carregar produtos.')
		});
	}

	private carregarNotas(): void {
		this.notasApi.listar().subscribe({
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
