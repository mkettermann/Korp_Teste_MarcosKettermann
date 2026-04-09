using System.ComponentModel.DataAnnotations;

namespace Korp.Shared.Contracts;

public sealed class EstoqueBaixaRequest
{
	[Range(1, int.MaxValue, ErrorMessage = "NotaFiscalId deve ser maior que zero.")]
	public required int NotaFiscalId { get; init; }

	[Required(ErrorMessage = "O campo Itens é obrigatório.")]
	[MinLength(1, ErrorMessage = "A nota deve conter ao menos um item.")]
	public required IReadOnlyCollection<EstoqueBaixaItemRequest> Itens { get; init; }
}

public sealed class EstoqueBaixaItemRequest
{
	[Range(1, int.MaxValue, ErrorMessage = "ProdutoId deve ser maior que zero.")]
	public required int ProdutoId { get; init; }

	[Range(1, int.MaxValue, ErrorMessage = "Quantidade inválida para baixa.")]
	public required int Quantidade { get; init; }
}
