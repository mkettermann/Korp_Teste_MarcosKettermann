# Padroes do projeto (analise)

## 1. Organizacao em monorepo por camada e dominio

- Backend separado por microsservico (`Estoque`, `Faturamento`) + projeto compartilhado (`Shared`).
- Frontend isolado em aplicacao Angular dentro do mesmo repositorio.

## 2. Padroes de API no backend

- Controllers enxutos com regras de aplicacao diretas.
- DataAnnotations para validacao de entrada.
- Padrao comum de resposta para `ModelState` invalido.
- Tratamento global de erro 500 com resposta JSON simplificada.
- Uso de `AsNoTracking` em leituras para reduzir overhead de rastreamento.

## 3. Persistencia e consistencia

- EF Core com mapeamentos explicitos em `OnModelCreating`.
- Migrations por servico, aplicadas no startup.
- Concurrency token inteiro em estoque (`VersaoConcorrencia`) para cenarios concorrentes.

## 4. Integracao entre microsservicos

- Integracao sincrona HTTP do Faturamento para Estoque via HttpClient tipado.
- Timeout curto (5s) para evitar travamentos longos.
- Padrao de degradacao controlada: em falha externa, retorno amigavel + registro em outbox.

## 5. Idempotencia

- Chave obrigatoria em endpoint critico de impressao.
- Persistencia de resposta por `chave + endpoint`.
- Reexecucao segura sem duplicar efeitos (baixa de estoque/fechamento).

## 6. Padroes de frontend

- Angular standalone components e roteamento com rotas filhas.
- Servicos de API por dominio herdando classe base HTTP.
- Estado local com Signals e recarga coordenada por flags de sinal.
- Fluxo de idempotencia iniciado no cliente com `crypto.randomUUID()`.

## 7. Testabilidade

- Backend: testes de cenarios de negocio usando SQLite em memoria e stubs para HTTP externo.
- Frontend: testes de componentes com setup de roteamento simplificado via `provideRouter`.

## 8. Riscos/limites observados

- CORS totalmente aberto (adequado para dev, nao para producao).
- Numero sequencial da nota calculado por maximo atual (revisar sob alta concorrencia).
- Outbox registrado, mas sem processador dedicado implementado nesta etapa.
