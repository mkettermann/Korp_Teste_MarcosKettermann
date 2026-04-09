namespace Korp.Shared.Contracts;

public sealed class NormalResponse
{
	public required bool sucesso { get; init; }
	public string? mensagem { get; init; }
}
