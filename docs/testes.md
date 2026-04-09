# Testes

## Visao geral

O projeto possui testes automatizados no backend e frontend.

- Backend: cenarios de integracao/fluxo com xUnit e SQLite em memoria.
- Frontend: testes de componentes com Vitest via Angular CLI.

## Pre-requisitos

- .NET SDK 9
- Node.js + npm
- Dependencias instaladas no frontend (`npm install`)

## 1. Executar testes do frontend

No diretorio do frontend:

```powershell
cd src/frontend/korp-frontend
npm run test -- --watch=false
```

Observacao importante:

- O projeto usa Vitest no `ng test`.
- Nao usar `--browsers=ChromeHeadless` sem instalar pacotes `@vitest/browser-*`, pois isso falha por dependencia ausente.

## 2. Executar testes do backend

No diretorio de backend:

```powershell
cd src/backend
dotnet test Korp.Backend.sln
```

## 3. O que os testes backend cobrem hoje

Arquivo principal:

- `src/backend/tests/Korp.Backend.Tests/MicrosservicosScenariosTests.cs`

Cenarios cobertos:

- Concorrencia no estoque:
  - saldo inicial 1;
  - duas baixas sequenciais;
  - primeira deve passar e segunda deve falhar com conflito.
- Idempotencia da impressao:
  - chamada repetida com mesma chave devolve resposta cacheada.
- Falha de integracao faturamento->estoque:
  - retorno `503` para cliente;
  - nota permanece `Aberta`;
  - registro em `OutboxMessages`.

## 4. Teste manual de resiliencia (script)

Script disponivel:

- `scripts/simular-falha-estoque.ps1`

Execucao:

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\simular-falha-estoque.ps1 -NotaId 1
```

Resultado esperado:

- Status `503` no faturamento.
- Nota nao fecha.
- Evidencia de falha em outbox.

## 5. Sugestao de rotina local

1. `docker compose up -d`
2. Subir APIs (`dotnet run` em cada servico)
3. Subir frontend (`npm start`)
4. Rodar testes automatizados (frontend e backend)
5. Executar script de falha para validar resiliencia operacional
