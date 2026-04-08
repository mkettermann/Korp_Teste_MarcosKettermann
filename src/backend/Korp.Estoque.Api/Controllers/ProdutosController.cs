using System.ComponentModel.DataAnnotations;
using Korp.Estoque.Api.Data;
using Korp.Estoque.Api.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Korp.Estoque.Api.Controllers;

[ApiController]
[Route("api/produtos")]
public sealed class ProdutosController(EstoqueDbContext dbContext) : ControllerBase
{
	[HttpGet]
	public async Task<ActionResult<IReadOnlyCollection<Produto>>> ListarAsync()
	{
		var produtos = await dbContext.Produtos
				.AsNoTracking()
				.OrderBy(p => p.Id)
				.ToListAsync();

		return Ok(produtos);
	}

	[HttpPost]
	public async Task<ActionResult<Produto>> CriarAsync([FromBody] CriarProdutoRequest request)
	{
		var produto = new Produto
		{
			Codigo = request.Codigo.Trim(),
			Descricao = request.Descricao.Trim(),
			Saldo = request.Saldo
		};

		dbContext.Produtos.Add(produto);
		await dbContext.SaveChangesAsync();

		return CreatedAtRoute("ObterProdutoPorId", new { id = produto.Id }, produto);
	}

	[HttpGet("{id:int}", Name = "ObterProdutoPorId")]
	public async Task<ActionResult<Produto>> ObterPorIdAsync([FromRoute] int id)
	{
		var produto = await dbContext.Produtos.AsNoTracking().FirstOrDefaultAsync(p => p.Id == id);
		return produto is null ? NotFound() : Ok(produto);
	}

	[HttpPut("{id:int}")]
	public async Task<ActionResult<Produto>> AtualizarAsync([FromRoute] int id, [FromBody] AtualizarProdutoRequest request)
	{
		var produto = await dbContext.Produtos.FirstOrDefaultAsync(p => p.Id == id);
		if (produto is null)
		{
			return NotFound();
		}

		produto.Codigo = request.Codigo.Trim();
		produto.Descricao = request.Descricao.Trim();
		produto.Saldo = request.Saldo;

		await dbContext.SaveChangesAsync();
		return Ok(produto);
	}
}

public sealed class CriarProdutoRequest
{
	[Required(ErrorMessage = "O campo Codigo é obrigatório.")]
	[RegularExpression(@".*\S.*", ErrorMessage = "O campo Codigo é obrigatório.")]
	public string Codigo { get; init; } = string.Empty;

	[Required(ErrorMessage = "O campo Descricao é obrigatório.")]
	[RegularExpression(@".*\S.*", ErrorMessage = "O campo Descricao é obrigatório.")]
	public string Descricao { get; init; } = string.Empty;

	[Range(0, int.MaxValue, ErrorMessage = "Saldo não pode ser negativo.")]
	public int Saldo { get; init; }
}

public sealed class AtualizarProdutoRequest
{
	[Required(ErrorMessage = "O campo Codigo é obrigatório.")]
	[RegularExpression(@".*\S.*", ErrorMessage = "O campo Codigo é obrigatório.")]
	public string Codigo { get; init; } = string.Empty;

	[Required(ErrorMessage = "O campo Descricao é obrigatório.")]
	[RegularExpression(@".*\S.*", ErrorMessage = "O campo Descricao é obrigatório.")]
	public string Descricao { get; init; } = string.Empty;

	[Range(0, int.MaxValue, ErrorMessage = "Saldo não pode ser negativo.")]
	public int Saldo { get; init; }
}
