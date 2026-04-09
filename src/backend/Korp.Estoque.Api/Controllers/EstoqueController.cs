using Korp.Estoque.Api.Data;
using Korp.Shared.Contracts;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Korp.Estoque.Api.Controllers;

[ApiController]
[Route("api/estoque")]
public sealed class EstoqueController(EstoqueDbContext dbContext) : ControllerBase
{
	[HttpPost("baixas")]
	public async Task<ActionResult<NormalResponse>> ProcessarBaixaAsync([FromBody] EstoqueBaixaRequest request)
	{
		if (request.Itens.Count == 0)
		{
			return BadRequest(new NormalResponse { sucesso = false, mensagem = "A nota deve conter ao menos um item." });
		}

		await using var tx = await dbContext.Database.BeginTransactionAsync();

		try
		{
			foreach (var item in request.Itens)
			{
				if (item.Quantidade <= 0)
				{
					return BadRequest(new NormalResponse { sucesso = false, mensagem = "Quantidade inválida para baixa." });
				}

				var produto = await dbContext.Produtos.FirstOrDefaultAsync(p => p.Id == item.ProdutoId);
				if (produto is null)
				{
					return NotFound(new NormalResponse { sucesso = false, mensagem = $"Produto {item.ProdutoId} não encontrado." });
				}

				if (produto.Saldo < item.Quantidade)
				{
					return Conflict(new NormalResponse { sucesso = false, mensagem = $"Estoque insuficiente de {produto.Descricao}. Disponível: {produto.Saldo}." });
				}

				produto.Saldo -= item.Quantidade;
				produto.VersaoConcorrencia++;
			}

			await dbContext.SaveChangesAsync();
			await tx.CommitAsync();

			return Ok(new NormalResponse { sucesso = true });
		}
		catch (DbUpdateConcurrencyException)
		{
			await tx.RollbackAsync();
			return Conflict(new NormalResponse
			{
				sucesso = false,
				mensagem = "Conflito de concorrência detectado. Refaça a operação."
			});
		}
	}
}
