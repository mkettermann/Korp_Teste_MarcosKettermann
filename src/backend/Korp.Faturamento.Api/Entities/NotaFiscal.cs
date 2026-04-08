using Korp.Shared.Contracts;

namespace Korp.Faturamento.Api.Entities;

public sealed class NotaFiscal
{
	public int Id { get; set; }
	public int NumeroSequencial { get; set; }
	public NotaStatus Status { get; set; } = NotaStatus.Aberta;
	public DateTime CriadaEmUtc { get; set; } = DateTime.UtcNow;
	public ICollection<ItemNotaFiscal> Itens { get; set; } = [];
}
