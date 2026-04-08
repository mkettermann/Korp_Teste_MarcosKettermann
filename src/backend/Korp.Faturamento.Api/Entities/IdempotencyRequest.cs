namespace Korp.Faturamento.Api.Entities;

public sealed class IdempotencyRequest
{
	public int Id { get; set; }
	public required string Chave { get; set; }
	public required string Endpoint { get; set; }
	public int StatusCode { get; set; }
	public required string ResponseJson { get; set; }
	public DateTime CriadoEmUtc { get; set; } = DateTime.UtcNow;
}
