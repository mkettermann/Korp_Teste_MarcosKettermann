using Korp.Estoque.Api.Entities;
using Microsoft.EntityFrameworkCore;

namespace Korp.Estoque.Api.Data;

public sealed class EstoqueDbContext(DbContextOptions<EstoqueDbContext> options) : DbContext(options)
{
	public DbSet<Produto> Produtos => Set<Produto>();

	protected override void OnModelCreating(ModelBuilder modelBuilder)
	{
		modelBuilder.Entity<Produto>(entity =>
		{
			entity.HasKey(p => p.Id);
			entity.HasIndex(p => p.Codigo).IsUnique();
			entity.Property(p => p.Codigo).HasMaxLength(40).IsRequired();
			entity.Property(p => p.Descricao).HasMaxLength(200).IsRequired();
			entity.Property(p => p.Ativo).HasDefaultValue(true).IsRequired();
			entity.Property(p => p.VersaoConcorrencia)
				.HasDefaultValue(0)
				.IsConcurrencyToken();
		});
	}
}
