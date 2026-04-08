using System.Net;
using System.Text;
using System.Text.Json;
using Korp.Estoque.Api.Controllers;
using Korp.Estoque.Api.Data;
using Korp.Estoque.Api.Entities;
using Korp.Faturamento.Api.Controllers;
using Korp.Faturamento.Api.Data;
using Korp.Faturamento.Api.Entities;
using Korp.Faturamento.Api.Services;
using Korp.Shared.Contracts;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.Sqlite;
using Microsoft.EntityFrameworkCore;

namespace Korp.Backend.Tests;

public sealed class MicrosservicosScenariosTests
{
	[Fact]
	public async Task Estoque_ComSaldoUm_DuasBaixasSequenciais_DeveAceitarUmaERejeitarOutra()
	{
		await using var connection = new SqliteConnection("DataSource=:memory:");
		await connection.OpenAsync();

		var options = new DbContextOptionsBuilder<EstoqueDbContext>()
				.UseSqlite(connection)
				.Options;

		await using var dbContext = new EstoqueDbContext(options);
		await dbContext.Database.EnsureCreatedAsync();

		dbContext.Produtos.Add(new Produto
		{
			Codigo = "P-001",
			Descricao = "Produto teste",
			Saldo = 1
		});
		await dbContext.SaveChangesAsync();

		var controller = new EstoqueController(dbContext);
		var request = new EstoqueBaixaRequest
		{
			NotaFiscalId = 10,
			Itens =
				[
						new EstoqueBaixaItemRequest
								{
										ProdutoId = 1,
										Quantidade = 1
								}
				]
		};

		var primeiraBaixa = await controller.ProcessarBaixaAsync(request);
		var segundaBaixa = await controller.ProcessarBaixaAsync(request);

		var ok = Assert.IsType<OkObjectResult>(primeiraBaixa.Result);
		var respostaOk = Assert.IsType<EstoqueBaixaResponse>(ok.Value);
		Assert.True(respostaOk.Sucesso);

		var conflito = Assert.IsType<ConflictObjectResult>(segundaBaixa.Result);
		var respostaConflito = Assert.IsType<EstoqueBaixaResponse>(conflito.Value);
		Assert.False(respostaConflito.Sucesso);

		var produtoFinal = await dbContext.Produtos.SingleAsync();
		Assert.Equal(0, produtoFinal.Saldo);
	}

	[Fact]
	public async Task Faturamento_ComMesmaIdempotencyKey_DeveRetornarRespostaCacheada()
	{
		await using var connection = new SqliteConnection("DataSource=:memory:");
		await connection.OpenAsync();

		var options = new DbContextOptionsBuilder<FaturamentoDbContext>()
				.UseSqlite(connection)
				.Options;

		await using var dbContext = new FaturamentoDbContext(options);
		await dbContext.Database.EnsureCreatedAsync();

		var cachedResponse = new ImpressaoNotaResponse
		{
			NotaFiscalId = 1,
			Numero = 1001,
			Status = "Fechada",
			PdfBase64 = Convert.ToBase64String(Encoding.UTF8.GetBytes("pdf-cache"))
		};

		dbContext.IdempotencyRequests.Add(new IdempotencyRequest
		{
			Chave = "idem-123",
			Endpoint = "imprimir:1",
			StatusCode = StatusCodes.Status200OK,
			ResponseJson = JsonSerializer.Serialize(cachedResponse)
		});
		await dbContext.SaveChangesAsync();

		var estoqueClient = CreateEstoqueClient(HttpStatusCode.OK, new EstoqueBaixaResponse { Sucesso = true });
		var controller = new NotasFiscaisController(dbContext, estoqueClient, new PdfService())
		{
			ControllerContext = new ControllerContext
			{
				HttpContext = new DefaultHttpContext()
			}
		};
		controller.Request.Headers["Idempotency-Key"] = "idem-123";

		var resultado = await controller.ImprimirAsync(1, CancellationToken.None);

		var objectResult = Assert.IsType<ObjectResult>(resultado.Result);
		Assert.Equal(StatusCodes.Status200OK, objectResult.StatusCode);

		var payload = Assert.IsType<ImpressaoNotaResponse>(objectResult.Value);
		Assert.Equal(1001, payload.Numero);
		Assert.Equal("Fechada", payload.Status);
	}

	[Fact]
	public async Task Faturamento_QuandoEstoqueFalha_DeveRetornar503_ManterNotaAbertaERegistrarOutbox()
	{
		await using var connection = new SqliteConnection("DataSource=:memory:");
		await connection.OpenAsync();

		var options = new DbContextOptionsBuilder<FaturamentoDbContext>()
				.UseSqlite(connection)
				.Options;

		await using var dbContext = new FaturamentoDbContext(options);
		await dbContext.Database.EnsureCreatedAsync();

		dbContext.NotasFiscais.Add(new NotaFiscal
		{
			NumeroSequencial = 1,
			Status = NotaStatus.Aberta,
			Itens =
				[
						new ItemNotaFiscal
								{
										ProdutoId = 99,
										DescricaoProduto = "Produto indisponivel",
										Quantidade = 1
								}
				]
		});
		await dbContext.SaveChangesAsync();

		var estoqueClient = CreateEstoqueClient(
				HttpStatusCode.ServiceUnavailable,
				new EstoqueBaixaResponse { Sucesso = false, Mensagem = "Estoque indisponivel" });

		var controller = new NotasFiscaisController(dbContext, estoqueClient, new PdfService())
		{
			ControllerContext = new ControllerContext
			{
				HttpContext = new DefaultHttpContext()
			}
		};
		controller.Request.Headers["Idempotency-Key"] = "idem-falha";

		var resultado = await controller.ImprimirAsync(1, CancellationToken.None);

		var objectResult = Assert.IsType<ObjectResult>(resultado.Result);
		Assert.Equal(StatusCodes.Status503ServiceUnavailable, objectResult.StatusCode);

		var nota = await dbContext.NotasFiscais.SingleAsync();
		Assert.Equal(NotaStatus.Aberta, nota.Status);

		var outboxCount = await dbContext.OutboxMessages.CountAsync();
		Assert.Equal(1, outboxCount);
	}

	private static EstoqueClient CreateEstoqueClient(HttpStatusCode statusCode, EstoqueBaixaResponse payload)
	{
		var handler = new StubHttpMessageHandler(_ =>
		{
			var json = JsonSerializer.Serialize(payload);
			var response = new HttpResponseMessage(statusCode)
			{
				Content = new StringContent(json, Encoding.UTF8, "application/json")
			};

			return response;
		});

		var httpClient = new HttpClient(handler)
		{
			BaseAddress = new Uri("http://localhost:5101/")
		};

		return new EstoqueClient(httpClient);
	}

	private sealed class StubHttpMessageHandler(Func<HttpRequestMessage, HttpResponseMessage> responder)
			: HttpMessageHandler
	{
		protected override Task<HttpResponseMessage> SendAsync(HttpRequestMessage request, CancellationToken cancellationToken)
				=> Task.FromResult(responder(request));
	}
}
