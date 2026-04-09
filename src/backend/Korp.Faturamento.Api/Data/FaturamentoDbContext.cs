using Korp.Faturamento.Api.Entities;
using Microsoft.EntityFrameworkCore;

namespace Korp.Faturamento.Api.Data;

public sealed class FaturamentoDbContext(DbContextOptions<FaturamentoDbContext> options) : DbContext(options)
{
	public DbSet<NotaFiscal> NotasFiscais => Set<NotaFiscal>();
	public DbSet<ItemNotaFiscal> ItensNotaFiscal => Set<ItemNotaFiscal>();
	public DbSet<IdempotencyRequest> IdempotencyRequests => Set<IdempotencyRequest>();
	public DbSet<OutboxMessage> OutboxMessages => Set<OutboxMessage>();

	protected override void OnModelCreating(ModelBuilder modelBuilder)
	{
		modelBuilder.Entity<NotaFiscal>(entity =>
		{
			entity.HasKey(x => x.Id);
			entity.HasIndex(x => x.NumeroSequencial).IsUnique();
			entity.Property(x => x.Status).HasConversion<string>().HasMaxLength(20);
			entity.HasMany(x => x.Itens)
							.WithOne(x => x.NotaFiscal)
							.HasForeignKey(x => x.NotaFiscalId)
							.OnDelete(DeleteBehavior.Cascade);
		});

		modelBuilder.Entity<ItemNotaFiscal>(entity =>
		{
			entity.HasKey(x => x.Id);
			entity.Property(x => x.DescricaoProduto).HasMaxLength(200).IsRequired();
		});

		modelBuilder.Entity<IdempotencyRequest>(entity =>
		{
			entity.HasKey(x => x.Id);
			entity.HasIndex(x => new { x.Chave, x.Endpoint }).IsUnique();
			entity.Property(x => x.Chave).HasMaxLength(100).IsRequired();
			entity.Property(x => x.Endpoint).HasMaxLength(200).IsRequired();
		});

		modelBuilder.Entity<OutboxMessage>(entity =>
		{
			entity.HasKey(x => x.Id);
			entity.Property(x => x.Tipo).HasMaxLength(120).IsRequired();
			entity.Property(x => x.Payload).IsRequired();
		});
	}
}
