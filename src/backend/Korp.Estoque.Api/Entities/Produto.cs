namespace Korp.Estoque.Api.Entities;

public sealed class Produto
{
	public int Id { get; set; }
	public required string Codigo { get; set; }
	public required string Descricao { get; set; }
	public int Saldo { get; set; }
	public int VersaoConcorrencia { get; set; }
}
