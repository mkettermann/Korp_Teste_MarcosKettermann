using System.Text.Json;
using Korp.Faturamento.Api.Data;
using Korp.Faturamento.Api.Entities;
using Korp.Faturamento.Api.Services;
using Korp.Shared.Contracts;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Korp.Faturamento.Api.Controllers;

[ApiController]
[Route("api/notas")]
public sealed class NotasFiscaisController(
		FaturamentoDbContext dbContext,
		EstoqueClient estoqueClient,
		PdfService pdfService) : ControllerBase
{
	[HttpGet]
	public async Task<ActionResult<IReadOnlyCollection<NotaFiscal>>> ListarAsync()
	{
		var notas = await dbContext.NotasFiscais
				.AsNoTracking()
				.Include(x => x.Itens)
				.OrderBy(x => x.Id)
				.ToListAsync();

		return Ok(notas);
	}

	[HttpPost]
	public async Task<ActionResult<NotaFiscal>> CriarAsync([FromBody] CriarNotaRequest request)
	{
		if (request.Itens.Count == 0)
		{
			return BadRequest("A nota precisa ter pelo menos um item.");
		}

		if (request.Itens.Any(x => x.Quantidade <= 0))
		{
			return BadRequest("Todos os itens devem ter quantidade maior que zero.");
		}

		var proximoNumero = (await dbContext.NotasFiscais.MaxAsync(x => (int?)x.NumeroSequencial) ?? 0) + 1;

		var nota = new NotaFiscal
		{
			NumeroSequencial = proximoNumero,
			Status = NotaStatus.Aberta,
			Itens = request.Itens.Select(i => new ItemNotaFiscal
			{
				ProdutoId = i.ProdutoId,
				DescricaoProduto = i.DescricaoProduto,
				Quantidade = i.Quantidade
			}).ToList()
		};

		dbContext.NotasFiscais.Add(nota);
		await dbContext.SaveChangesAsync();

		return CreatedAtAction(nameof(ObterPorIdAsync), new { id = nota.Id }, nota);
	}

	[HttpGet("{id:int}")]
	public async Task<ActionResult<NotaFiscal>> ObterPorIdAsync([FromRoute] int id)
	{
		var nota = await dbContext.NotasFiscais
				.AsNoTracking()
				.Include(x => x.Itens)
				.FirstOrDefaultAsync(x => x.Id == id);

		return nota is null ? NotFound() : Ok(nota);
	}

	[HttpPost("{id:int}/imprimir")]
	public async Task<ActionResult<ImpressaoNotaResponse>> ImprimirAsync([FromRoute] int id, CancellationToken cancellationToken)
	{
		var idempotencyKey = Request.Headers["Idempotency-Key"].FirstOrDefault();
		if (string.IsNullOrWhiteSpace(idempotencyKey))
		{
			return BadRequest("Header Idempotency-Key é obrigatório.");
		}

		var endpoint = $"imprimir:{id}";

		var existente = await dbContext.IdempotencyRequests
				.AsNoTracking()
				.FirstOrDefaultAsync(x => x.Chave == idempotencyKey && x.Endpoint == endpoint, cancellationToken);

		if (existente is not null)
		{
			var cached = JsonSerializer.Deserialize<ImpressaoNotaResponse>(existente.ResponseJson);
			return StatusCode(existente.StatusCode, cached);
		}

		var nota = await dbContext.NotasFiscais
				.Include(x => x.Itens)
				.FirstOrDefaultAsync(x => x.Id == id, cancellationToken);

		if (nota is null)
		{
			return NotFound();
		}

		if (nota.Status != NotaStatus.Aberta)
		{
			return BadRequest("Apenas notas com status Aberta podem ser impressas.");
		}

		var baixaRequest = new EstoqueBaixaRequest
		{
			NotaFiscalId = nota.Id,
			Itens = nota.Itens.Select(i => new EstoqueBaixaItemRequest
			{
				ProdutoId = i.ProdutoId,
				Quantidade = i.Quantidade
			}).ToArray()
		};

		var baixa = await estoqueClient.BaixarEstoqueAsync(baixaRequest, cancellationToken);
		if (!baixa.Sucesso)
		{
			dbContext.OutboxMessages.Add(new OutboxMessage
			{
				Tipo = "FalhaBaixaEstoque",
				Payload = JsonSerializer.Serialize(new
				{
					NotaId = nota.Id,
					baixa.Mensagem,
					StatusCode = baixa.StatusCode
				})
			});

			await dbContext.SaveChangesAsync(cancellationToken);
			return StatusCode(StatusCodes.Status503ServiceUnavailable,
					new { Mensagem = baixa.Mensagem ?? "Falha ao comunicar com estoque. Tente novamente." });
		}

		nota.Status = NotaStatus.Fechada;
		var pdf = pdfService.GerarNotaFiscal(nota);

		var response = new ImpressaoNotaResponse
		{
			NotaFiscalId = nota.Id,
			Numero = nota.NumeroSequencial,
			Status = nota.Status.ToString(),
			PdfBase64 = Convert.ToBase64String(pdf)
		};

		dbContext.IdempotencyRequests.Add(new IdempotencyRequest
		{
			Chave = idempotencyKey,
			Endpoint = endpoint,
			StatusCode = StatusCodes.Status200OK,
			ResponseJson = JsonSerializer.Serialize(response)
		});

		await dbContext.SaveChangesAsync(cancellationToken);

		return Ok(response);
	}
}

public sealed record CriarNotaRequest(IReadOnlyCollection<CriarItemNotaRequest> Itens);
public sealed record CriarItemNotaRequest(int ProdutoId, string DescricaoProduto, int Quantidade);

public sealed class ImpressaoNotaResponse
{
	public required int NotaFiscalId { get; init; }
	public required int Numero { get; init; }
	public required string Status { get; init; }
	public required string PdfBase64 { get; init; }
}
