# Korp_Teste_MarcosKettermann

Monorepo com frontend Angular e backend .NET para emissão de notas fiscais em arquitetura de microsserviços.

## Arquitetura atual

- Microsserviço de Estoque: cadastro de produtos e baixa de saldo.
- Microsserviço de Faturamento: cadastro de notas, impressão (PDF) e fechamento da nota.
- Frontend Angular: telas de Produtos e Notas com fluxo de impressão.
- Banco de dados: PostgreSQL real, com migrations EF Core em cada serviço.

## Estrutura

- src/backend/Korp.Backend.sln
- src/backend/Korp.Estoque.Api
- src/backend/Korp.Faturamento.Api
- src/backend/Korp.Shared
- src/frontend/korp-frontend
- docker-compose.yml

## Requisitos implementados nesta etapa

- Cadastro de produtos com campos obrigatórios: Código, Descrição e Saldo.
- Cadastro de notas com numeração sequencial e status inicial Aberta.
- Inclusão de múltiplos produtos por nota.
- Impressão com geração de PDF real no faturamento.
- Fechamento da nota após impressão bem-sucedida.
- Bloqueio de impressão para nota diferente de Aberta.
- Baixa de estoque no momento da impressão.
- Persistência física em PostgreSQL.
- Idempotência no endpoint de impressão via header Idempotency-Key.
- Tratamento de falha entre serviços com retorno de erro amigável.
- Tratamento de concorrência no estoque com token de versão e conflito controlado.

## Executar localmente

1. Subir PostgreSQL:

```powershell
docker compose up -d
```

2. Subir serviço de Estoque (porta 5101):

```powershell
cd src/backend/Korp.Estoque.Api
dotnet run
```

3. Subir serviço de Faturamento (porta 5102):

```powershell
cd src/backend/Korp.Faturamento.Api
dotnet run
```

4. Subir frontend Angular (porta 4200):

```powershell
cd src/frontend/korp-frontend
npm install
npm start
```

## Endpoints principais

Estoque:
- GET /api/produtos
- POST /api/produtos
- PUT /api/produtos/{id}
- POST /api/estoque/baixas

Faturamento:
- GET /api/notas
- POST /api/notas
- GET /api/notas/{id}
- POST /api/notas/{id}/imprimir (requer header Idempotency-Key)

## Cenários técnicos

Falha entre microsserviços:
- Se a baixa no estoque falhar durante a impressão, a nota permanece Aberta e a API retorna erro para o frontend.

Concorrência:
- Produto com saldo 1 em duas impressões simultâneas: uma operação conclui, outra recebe conflito/insuficiência de saldo.

Idempotência:
- Repetir impressão com a mesma chave Idempotency-Key retorna o resultado anterior sem duplicar efeitos.

## Testes automatizados

Frontend:

```powershell
cd src/frontend/korp-frontend
ng test --watch=false
```

Backend:

```powershell
cd src/backend
dotnet test Korp.Backend.sln
```

Cobertura atual dos testes backend:
- Concorrência funcional de estoque (saldo 1 em duas baixas consecutivas).
- Idempotência no endpoint de impressão.
- Falha de integração Faturamento -> Estoque com retorno 503 e registro em outbox.

## Simulação de falha entre microsserviços

1. Inicie PostgreSQL e Faturamento.
2. Garanta que o serviço de Estoque esteja parado.
3. Execute:

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\simular-falha-estoque.ps1 -NotaId 1
```

Resultado esperado:
- Retorno HTTP 503 do Faturamento.
- Nota permanece com status Aberta.
- Evento de falha registrado em outbox no banco do Faturamento.
