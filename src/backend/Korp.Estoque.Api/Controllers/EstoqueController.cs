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
	public async Task<ActionResult<EstoqueBaixaResponse>> ProcessarBaixaAsync([FromBody] EstoqueBaixaRequest request)
	{
		if (request.Itens.Count == 0)
		{
			return BadRequest(new EstoqueBaixaResponse { Sucesso = false, Mensagem = "A nota deve conter ao menos um item." });
		}

		await using var tx = await dbContext.Database.BeginTransactionAsync();

		try
		{
			foreach (var item in request.Itens)
			{
				if (item.Quantidade <= 0)
				{
					return BadRequest(new EstoqueBaixaResponse { Sucesso = false, Mensagem = "Quantidade inválida para baixa." });
				}

				var produto = await dbContext.Produtos.FirstOrDefaultAsync(p => p.Id == item.ProdutoId);
				if (produto is null)
				{
					return NotFound(new EstoqueBaixaResponse { Sucesso = false, Mensagem = $"Produto {item.ProdutoId} não encontrado." });
				}

				if (produto.Saldo < item.Quantidade)
				{
					return Conflict(new EstoqueBaixaResponse { Sucesso = false, Mensagem = $"Saldo insuficiente para o produto {produto.Codigo}." });
				}

				produto.Saldo -= item.Quantidade;
				produto.VersaoConcorrencia++;
			}

			await dbContext.SaveChangesAsync();
			await tx.CommitAsync();

			return Ok(new EstoqueBaixaResponse { Sucesso = true });
		}
		catch (DbUpdateConcurrencyException)
		{
			await tx.RollbackAsync();
			return Conflict(new EstoqueBaixaResponse
			{
				Sucesso = false,
				Mensagem = "Conflito de concorrência detectado. Refaça a operação."
			});
		}
	}
}
