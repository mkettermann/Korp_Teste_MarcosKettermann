using Korp.Faturamento.Api.Entities;
using QuestPDF.Fluent;
using QuestPDF.Helpers;
using QuestPDF.Infrastructure;

namespace Korp.Faturamento.Api.Services;

public sealed class PdfService
{	
	public byte[] GerarNotaFiscal(NotaFiscal nota)
	{
		QuestPDF.Settings.License = LicenseType.Community;

		return Document.Create(container =>
		{
			container.Page(page =>
					{
					page.Size(PageSizes.A4);
					page.Margin(30);
					page.Content().Column(col =>
							{
							col.Spacing(8);
							col.Item().Text($"Nota Fiscal #{nota.NumeroSequencial}").Bold().FontSize(20);
							col.Item().Text($"Status: {nota.Status}");
							col.Item().Text($"Emitida em: {DateTime.UtcNow:dd/MM/yyyy HH:mm:ss} UTC");
							col.Item().LineHorizontal(1);

							foreach (var item in nota.Itens)
							{
								col.Item().Text($"Produto {item.ProdutoId} - {item.DescricaoProduto} - Qtd: {item.Quantidade}");
							}
						});
				});
		}).GeneratePdf();
	}
}
