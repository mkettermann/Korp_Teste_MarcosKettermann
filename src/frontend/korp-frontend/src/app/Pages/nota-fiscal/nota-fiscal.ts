import { Component, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { NotasApiService } from '../../services/notas-api.service';
import { ProdutosApiService } from '../../services/produtos-api.service';
import { Produto } from '../produtos/produtos-model';
import { ItemNotaInput, NotaFiscal } from './nota-fiscal.model';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-nota-fiscal',
  templateUrl: './nota-fiscal.html',
  styleUrl: './nota-fiscal.scss',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, FormsModule],
})
export class RotaNotaFiscal {

  private subs = new Subject<void>();
  private readonly notasApi = inject(NotasApiService);
  private readonly produtosApi = inject(ProdutosApiService);

  produtos = signal<Produto[]>([]);
  notas = signal<NotaFiscal[]>([]);
  itensNovaNota = signal<ItemNotaInput[]>([]);

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
    if (this.produtoSelecionadoId == null || this.quantidade <= 0) return;

    const produto = this.produtos().find((p) => p.id === this.produtoSelecionadoId);
    if (!produto) return;

    this.itensNovaNota.update((itens) => [
      ...itens,
      {
        produtoId: produto.id,
        descricaoProduto: produto.descricao,
        quantidade: this.quantidade
      }
    ]);

    this.produtoSelecionadoId = null;
    this.quantidade = 1;
  }

  removerItem(index: number): void {
    this.itensNovaNota.update((itens) => {
      const novosItens = [...itens];
      novosItens.splice(index, 1);
      return novosItens;
    });
  }

  criarNota(): void {
    this.erro = '';
    this.notasApi.criar({ itens: this.itensNovaNota() })
      .pipe(takeUntil(this.subs))
      .subscribe({
        next: () => {
          this.itensNovaNota.set([]);
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
    // A geração da UUID está sendo feita aqui no frontend para garantir a idempotência da requisição, evitando impressões duplicadas caso o usuário clique mais de uma vez ou haja instabilidade na rede.
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
      next: (dados) => this.produtos.set(dados),
      error: () => (this.erro = 'Falha ao carregar produtos.')
    });
  }

  private carregarNotas(): void {
    this.notasApi.listar().pipe(takeUntil(this.subs)).subscribe({
      next: (dados) => this.notas.set(dados),
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
