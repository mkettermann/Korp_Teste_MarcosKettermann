namespace Korp.Faturamento.Api.Entities;

public sealed class OutboxMessage
{
    public int Id { get; set; }
    public required string Tipo { get; set; }
    public required string Payload { get; set; }
    public DateTime CriadoEmUtc { get; set; } = DateTime.UtcNow;
}
