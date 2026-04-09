export interface NotaFiscal {
	id: number;
	numeroSequencial: number;
	status: NotaStatus;
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
	status: NotaStatus;
	pdfBase64: string;
}

export enum NotaStatus {
	Aberta = 1,
	Fechada = 2
}