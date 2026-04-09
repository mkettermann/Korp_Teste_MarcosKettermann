export interface NotaFiscal {
	id: number;
	numeroSequencial: number;
	status: 'Aberta' | 'Fechada';
	criadaEmUtc: string;
	itens: ItemNota[];
}

export interface ItemNotaInput {
	produtoId: number;
	descricaoProduto: string;
	quantidade: number;
}

export interface ItemNota extends ItemNotaInput {
	id: number;
}

export interface NotaFiscalCriarItem {
	itens: ItemNotaInput[]
}

export interface ImpressaoNotaResponse {
	notaFiscalId: number;
	numero: number;
	status: string;
	pdfBase64: string;
}