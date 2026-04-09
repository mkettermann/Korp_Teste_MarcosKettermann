import { Component, inject, signal } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { NotasApiService } from '../../services/notas-api.service';
import { ProdutosApiService } from '../../services/produtos-api.service';
import { Produto } from '../produtos/produtos-model';
import { ItemNotaInput, NotaFiscal } from './nota-fiscal.model';
import { FormsModule } from '@angular/forms';
import { Ui } from '../../services/base/ui.service';

@Component({
  selector: 'app-nota-fiscal',
  templateUrl: './nota-fiscal.html',
  styleUrl: './nota-fiscal.scss',
  imports: [FormsModule],
})
export class RotaNotaFiscal {

  private subs = new Subject<void>();
  private readonly notasApi = inject(NotasApiService);
  private readonly produtosApi = inject(ProdutosApiService);

  produtos = signal<Produto[]>([]);
  notas = signal<NotaFiscal[]>([]);
  itensNovaNota = signal<ItemNotaInput[]>([]);

  produtoInputId = signal<number | null>(null);
  quantidadeInput = signal<number>(1);
  erroInclusaoProduto = signal<string>('');

  erroGeracaoNota = signal<string>('');
  erroListagemNotas = signal<string>('');
  imprimindoId = signal<number[]>([]);

  recarregandoProdutos = signal(false);

  ngOnInit(): void {
    this.carregarProdutos();
    this.carregarNotas();
  }
  ngOnDestroy(): void {
    this.subs.next();
    this.subs.complete();
  }

  adicionarItem(): void {
    if (this.produtoInputId() == null || this.quantidadeInput() <= 0) return;

    const produto = this.produtos().find((p) => p.id === this.produtoInputId());
    if (!produto) return;

    // Verificamos o estoque considerando a quantidade já presente na nota para o mesmo produto, somada à nova quantidade que o usuário deseja adicionar.
    const quantidadeTotal = this.itensNovaNota().reduce((total, item) => {
      return item.produtoId === produto.id ? total + item.quantidade : total;
    }, 0) + this.quantidadeInput();
    if (produto.saldo < quantidadeTotal) {
      this.erroInclusaoProduto.set(`Produto "${produto.descricao}" com estoque insuficiente. Disponível: ${produto.saldo}.`);
      return;
    }

    // Primeiro adicionamos o item normalmente, mesmo que já exista um item do mesmo produto.
    this.itensNovaNota.update((itens) => [
      ...itens,
      {
        produtoId: produto.id,
        codigoProduto: produto.codigo,
        descricaoProduto: produto.descricao,
        quantidade: this.quantidadeInput(),
      }
    ]);

    // Após o update, unificamos produtos com mesmo ID para evitar múltiplas linhas do mesmo produto na nota.
    this.itensNovaNota.update((itens) => {
      const itensMap = new Map<number, ItemNotaInput>();
      for (const item of itens) {
        if (itensMap.has(item.produtoId)) {
          const existente = itensMap.get(item.produtoId)!;
          existente.quantidade += item.quantidade;
        } else {
          itensMap.set(item.produtoId, { ...item });
        }
      }
      return Array.from(itensMap.values());
    });

    this.erroInclusaoProduto.set('');
    this.produtoInputId.set(null);
    this.quantidadeInput.set(1);
  }

  removerItem(item: ItemNotaInput): void {
    this.itensNovaNota.update((itens) => {
      const novosItens = [...itens];
      const index = novosItens.indexOf(item);
      if (index !== -1) {
        novosItens.splice(index, 1);
      }
      return novosItens;
    });
  }

  gerarNota(): void {
    this.erroGeracaoNota.set('');
    this.notasApi.criar({ itens: this.itensNovaNota() })
      .pipe(takeUntil(this.subs))
      .subscribe({
        next: () => {
          this.itensNovaNota.set([]);
          this.carregarNotas();
        },
        error: (err) => {
          this.erroGeracaoNota.set(err?.error?.title ?? err?.error ?? 'Falha ao criar nota fiscal.');
        }
      });
  }

  async imprimir(notaId: number): Promise<void> {
    this.erroGeracaoNota.set('');
    this.imprimindoId.update((ids) => [...ids, notaId]);

    // A geração da UUID está sendo feita aqui no frontend para garantir a idempotência da requisição, evitando impressões duplicadas caso o usuário clique mais de uma vez ou haja instabilidade na rede.
    const idempotencyKey = crypto.randomUUID();

    this.notasApi.imprimir(notaId, idempotencyKey).pipe(takeUntil(this.subs)).subscribe({
      next: (response) => {
        this.downloadPdf(response.pdfBase64, `nota-${response.numero}.pdf`);
        this.carregarNotas();
        this.carregarProdutos();
        this.imprimindoId.update((ids) => ids.filter((id) => id !== notaId));
      },
      error: (err) => {
        this.erroListagemNotas.set(err?.error?.mensagem ?? err?.error?.title ?? 'Falha ao imprimir nota fiscal.');
        this.imprimindoId.update((ids) => ids.filter((id) => id !== notaId));
      },
    });
  }

  protected carregarProdutos(): void {
    this.recarregandoProdutos.set(true);
    this.produtosApi.listar(true).pipe(takeUntil(this.subs)).subscribe({
      next: (dados) => {
        this.produtos.set(dados);
        this.recarregandoProdutos.set(false);
      },
      error: () => {
        this.erroInclusaoProduto.set('Falha ao carregar produtos.');
        this.recarregandoProdutos.set(false);
      }
    });
  }

  private carregarNotas(): void {
    this.notasApi.listar().pipe(takeUntil(this.subs)).subscribe({
      next: (dados) => this.notas.set(dados),
      error: () => this.erroListagemNotas.set('Falha ao carregar notas fiscais.')
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
