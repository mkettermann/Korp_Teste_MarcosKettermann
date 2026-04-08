namespace Korp.Shared.Contracts;

public sealed class EstoqueBaixaResponse
{
	public required bool Sucesso { get; init; }
	public string? Mensagem { get; init; }
}
