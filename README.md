# Sistema de Microservicos entre Estoque, Faturamento e Frontend

Monorepo com frontend Angular e backend .NET para gerenciamento de produtos e emissao/impressao de notas fiscais em arquitetura de microsservicos.

## Objetivo do projeto

- Gerenciar cadastro de produtos e saldo de estoque.
- Criar notas fiscais com multiplos itens.
- Imprimir nota em PDF com fechamento da nota somente em sucesso.
- Garantir resiliencia com idempotencia, tratamento de falhas entre servicos e controle de concorrencia.

## Stack

- Backend: .NET 9, ASP.NET Core Web API, Entity Framework Core, Npgsql.
- Frontend: Angular 21 (standalone components), RxJS.
- Banco: PostgreSQL 16 (via Docker Compose, porta local 5433).
- Testes:
	- Backend: xUnit.
	- Frontend: Vitest via Angular CLI (`ng test`).

## Arquitetura (resumo)

- `Korp.Estoque.Api`: CRUD de produtos + endpoint de baixa de estoque.
- `Korp.Faturamento.Api`: CRUD de notas + impressao com PDF + chamada ao estoque.
- `Korp.Shared`: contratos compartilhados entre servicos.
- `korp-frontend`: UI Angular para produtos e notas.

Documentacao detalhada:

- Arquitetura: [docs/arquitetura.md](docs/arquitetura.md)
- Fluxos de negocio e integracao: [docs/fluxos.md](docs/fluxos.md)
- Guia de testes: [docs/testes.md](docs/testes.md)
- Padroes observados no codigo: [docs/padroes-do-projeto.md](docs/padroes-do-projeto.md)

## Estrutura do repositorio

- `src/backend/Korp.Backend.sln`
- `src/backend/Korp.Estoque.Api`
- `src/backend/Korp.Faturamento.Api`
- `src/backend/Korp.Shared`
- `src/backend/tests/Korp.Backend.Tests`
- `src/frontend/korp-frontend`
- `scripts/simular-falha-estoque.ps1`
- `docker-compose.yml`

## Como executar localmente

1. Suba o banco:

```powershell
docker compose up -d
```

2. Execute o servico de estoque (porta `5101`):

```powershell
cd src/backend/Korp.Estoque.Api
dotnet run
```

3. Em outro terminal, execute o servico de faturamento (porta `5102`):

```powershell
cd src/backend/Korp.Faturamento.Api
dotnet run
```

4. Em outro terminal, execute o frontend (porta `4200`):

```powershell
cd src/frontend/korp-frontend
npm install
npm start
```

Observacoes:

- Cada API aplica migrations automaticamente no startup.
- O frontend consome APIs em `http://localhost:5101` e `http://localhost:5102`.

## Endpoints principais

Estoque:

- `GET /api/produtos`
- `POST /api/produtos`
- `PUT /api/produtos/{id}`
- `DELETE /api/produtos/{id}`
- `POST /api/estoque/baixas`

Faturamento:

- `GET /api/notas`
- `POST /api/notas`
- `GET /api/notas/{id}`
- `POST /api/notas/{id}/imprimir` (header obrigatorio `Idempotency-Key`)

## Cenarios criticos implementados

- Idempotencia de impressao: mesma chave retorna resposta cacheada, sem duplicar efeitos.
- Conflito de concorrencia no estoque: operacao concorrente recebe `409 Conflict`.
- Falha entre microsservicos: erro no estoque retorna `503` no faturamento, nota permanece `Aberta`, evento de falha e registrado em outbox.

## Como rodar testes

Frontend:

```powershell
cd src/frontend/korp-frontend
npm run test -- --watch=false
```

Backend:

```powershell
cd src/backend
dotnet test Korp.Backend.sln
```

## Simular falha entre microsservicos

1. Inicie PostgreSQL e Faturamento.
2. Garanta que o servico de Estoque esteja parado.
3. Execute:

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\simular-falha-estoque.ps1 -NotaId 1
```

Resultado esperado:

- Retorno HTTP `503` do Faturamento.
- Nota permanece com status `Aberta`.
- Evento de falha registrado em `OutboxMessages`.
