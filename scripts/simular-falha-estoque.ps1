param(
    [int]$NotaId = 1,
    [string]$FaturamentoBaseUrl = "http://localhost:5102",
    [string]$IdempotencyKey = "sim-falha-estoque"
)

Write-Host "Simulacao de falha entre microsservicos" -ForegroundColor Cyan
Write-Host "1) Pare o servico de Estoque (porta 5101)."
Write-Host "2) Mantenha o servico de Faturamento ativo."
Write-Host "3) Execute este script para disparar a impressao da nota."

$uri = "$FaturamentoBaseUrl/api/notas/$NotaId/imprimir"
$headers = @{ "Idempotency-Key" = $IdempotencyKey }

try {
    $response = Invoke-RestMethod -Method Post -Uri $uri -Headers $headers -ContentType "application/json" -Body "{}"
    Write-Host "Resposta inesperada de sucesso:" -ForegroundColor Yellow
    $response | ConvertTo-Json -Depth 5
}
catch {
    if ($_.Exception.Response) {
        $statusCode = [int]$_.Exception.Response.StatusCode
        Write-Host "Status retornado: $statusCode" -ForegroundColor Red

        if ($statusCode -eq 503) {
            Write-Host "Cenario validado: falha no Estoque tratada com retorno 503." -ForegroundColor Green
        }
    }
    else {
        Write-Host "Falha de comunicacao com Faturamento: $($_.Exception.Message)" -ForegroundColor Red
    }
}
