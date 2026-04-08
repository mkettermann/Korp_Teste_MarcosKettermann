using System.Net;
using System.Net.Http.Json;
using Korp.Shared.Contracts;

namespace Korp.Faturamento.Api.Services;

public sealed class EstoqueClient(HttpClient httpClient)
{
    public async Task<(bool Sucesso, string? Mensagem, HttpStatusCode StatusCode)> BaixarEstoqueAsync(EstoqueBaixaRequest request, CancellationToken cancellationToken)
    {
        var response = await httpClient.PostAsJsonAsync("api/estoque/baixas", request, cancellationToken);
        if (response.IsSuccessStatusCode)
        {
            return (true, null, response.StatusCode);
        }

        var payload = await response.Content.ReadFromJsonAsync<EstoqueBaixaResponse>(cancellationToken: cancellationToken);
        return (false, payload?.Mensagem ?? "Falha ao baixar estoque.", response.StatusCode);
    }
}
