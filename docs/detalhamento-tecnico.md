# Detalhamento Tecnico

## 1. Ciclos de vida do Angular utilizados

No frontend Angular, os ciclos de vida identificados no codigo foram:

- OnInit (metodo ngOnInit): usado para inicializacao de estado, carga inicial de dados e aplicacao de tema.
- OnDestroy (metodo ngOnDestroy): usado para liberar subscriptions RxJS com Subject + takeUntil e evitar vazamento de memoria.

Observacao:

- Existem componentes que implementam explicitamente as interfaces OnInit/OnDestroy.
- Existe tambem componente que declara os metodos ngOnInit/ngOnDestroy sem declarar a interface, mas o ciclo de vida ainda e executado pelo Angular.
- Nao foi identificado uso de OnChanges, AfterViewInit, AfterContentInit ou hooks equivalentes.

## 2. Uso de RxJS

Sim, houve uso de RxJS no frontend.

Principais usos observados:

- Observable: retorno padrao dos servicos HTTP para listar/criar/editar/excluir entidades.
- pipe + map: transformacao/log da resposta no servico base de API.
- Subject<void>: controle de ciclo de vida de assinaturas em componentes.
- takeUntil: encerramento de subscriptions no ngOnDestroy.
- subscribe (next/error): tratamento de sucesso e erro de chamadas HTTP.

Padrao adotado:

- Cada componente que consome chamadas assincronas cria um Subject interno.
- No destroy, executa next() e complete().
- Todas as chamadas assinadas usam takeUntil(subject).

## 3. Outras bibliotecas utilizadas e finalidade

### Frontend

- @angular/common, @angular/core, @angular/forms, @angular/router, @angular/platform-browser:
  base do framework Angular para componentes, formularios, roteamento e runtime.
- rxjs:
  programacao reativa para fluxo HTTP e gerenciamento de subscriptions.
- bootstrap-icons:
  pacote de icones utilizado na interface.
- tslib:
  suporte a helpers TypeScript no build.
- Ferramentas de desenvolvimento: @angular/cli, @angular/build, @angular/compiler-cli, vitest, jsdom, typescript.

### Backend C#

- Microsoft.AspNetCore.OpenApi:
  suporte de OpenAPI no runtime ASP.NET Core.
- Microsoft.EntityFrameworkCore.Design:
  suporte de design-time para EF Core (migrations e tooling).
- Npgsql.EntityFrameworkCore.PostgreSQL:
  provider EF Core para PostgreSQL.
- QuestPDF:
  geracao de PDF da nota fiscal.

## 4. Bibliotecas para componentes visuais

As bibliotecas visualmente relevantes no frontend sao:

- bootstrap-icons: icones usados na UI.

Complementos de UI no projeto:

- SCSS customizado proprio do projeto (tokens CSS, temas claro/escuro, componentes de layout e utilitarios).
- Nao foi identificado uso de biblioteca de componentes como Angular Material, PrimeNG, NG-ZORRO ou Bootstrap JS.

## 5. Gerenciamento de dependencias no Golang

Nao aplicavel neste repositorio.

- Nao foram encontrados arquivos Go (ex.: .go).
- Nao foram encontrados manifestos de dependencia Go (go.mod/go.sum).

## 6. Frameworks utilizados no Golang ou C#

- Golang: nao aplicavel (nao utilizado no projeto).
- C#: ASP.NET Core (.NET 9) para APIs HTTP.
- Persistencia C#: Entity Framework Core 9 com provider Npgsql para PostgreSQL.

## 7. Tratamento de erros e excecoes no backend

O backend adota tratamento em camadas:

- Validacao de ModelState customizada (ApiBehaviorOptions):
  retorna 400 com payload padronizado de mensagem e erros por campo.
- Middleware global de excecao (UseExceptionHandler):
  captura excecoes nao tratadas e retorna 500 com mensagem padrao em JSON.
- Retornos HTTP por regra de negocio nos controllers:
  - 400 para entradas invalidas.
  - 404 para recurso nao encontrado.
  - 409 para conflito de negocio/concorrencia.
  - 503 para falhas de integracao com servico externo.
- Tratamento especifico de concorrencia no estoque:
  captura DbUpdateConcurrencyException e converte para 409 com mensagem orientativa.
- Integracao com idempotencia no faturamento:
  header Idempotency-Key obrigatorio e reutilizacao de resposta ja persistida.
- Registro de falha transitoria em outbox:
  quando a baixa de estoque falha em faixa 5xx, registra OutboxMessage para tratamento posterior.

## 8. Uso de LINQ no C# e como foi aplicado

Sim, LINQ foi utilizado de forma ampla.

Principais aplicacoes:

- Consultas e filtros:
  Where, OrderByDescending, Include, AsNoTracking, FirstOrDefaultAsync, ToListAsync.
- Projecao/mapeamento:
  Select para converter itens de request em entidades e para montar payloads de integracao.
- Agregacao:
  MaxAsync para calcular proximo numero sequencial de nota.
- Processamento de erros de validacao:
  Where + ToDictionary + Select na montagem da resposta de ModelState.

No contexto EF Core, essas expressoes LINQ sao traduzidas para SQL e executadas no banco quando aplicavel.
