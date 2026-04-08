namespace Korp.Shared.Contracts;

public sealed class EstoqueBaixaRequest
{
	public required int NotaFiscalId { get; init; }
	public required IReadOnlyCollection<EstoqueBaixaItemRequest> Itens { get; init; }
}

public sealed class EstoqueBaixaItemRequest
{
	public required int ProdutoId { get; init; }
	public required int Quantidade { get; init; }
}
