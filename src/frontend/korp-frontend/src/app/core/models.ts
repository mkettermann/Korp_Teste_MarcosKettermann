export interface Produto {
	id: number;
	codigo: string;
	descricao: string;
	saldo: number;
}

export interface ItemNota {
	id: number;
	produtoId: number;
	descricaoProduto: string;
	quantidade: number;
}

export interface NotaFiscal {
	id: number;
	numeroSequencial: number;
	status: 'Aberta' | 'Fechada';
	criadaEmUtc: string;
	itens: ItemNota[];
}

export interface ImpressaoNotaResponse {
	notaFiscalId: number;
	numero: number;
	status: string;
	pdfBase64: string;
}
