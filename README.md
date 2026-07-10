# OVGS - Sistema de Gestão de Ordens de Venda

Aplicação monolítica modular para gestão do ciclo de vida de Ordens de Venda, com API REST mockada, regras de negócio isoladas, auditoria e UI operacional.

## Stack

- Next.js + React + TypeScript
- React Query para cache e sincronização com API REST
- Redux Toolkit + Redux Saga para estado operacional da UI
- React Hook Form + Zod para formulários e validações
- Tailwind CSS
- Docker

## Como clonar o projeto

Clone o repositório para sua máquina utilizando o Git:

```bash
git clone git@github.com:jpmuniz/thera.git
```

Em seguida, acesse o diretório do projeto:

```bash
cd thera
```
## Como executar

Execute na branch master

```bash
npm install
npm run dev
```

Acesse `http://localhost:3000`.

Com Docker:

```bash
docker compose up --build || docker-compose up --build 

```

## Scripts úteis

```bash
npm run typecheck
npm run lint
npm run build
npm run audit
npm run verify
```

## Arquitetura

O projeto segue um monolito modular. Cada contexto concentra suas próprias APIs client-side, hooks, componentes, features e helpers:

- `src/modules/sales-orders`: criação, consulta, detalhes e transição de status de ordem de vendas.
- `src/modules/scheduling`: agenda, confirmação e reagendamento.
- `src/modules/registrations`: cadastros de clientes, transportes e itens.
- `src/modules/monitoring`: filtros e visão operacional.
- `src/modules/audit`: trilha de auditoria.
- `src/server`: API REST mockada e banco em memória.
- `src/store`: Redux Toolkit e Saga.
- `src/shared`: tipos, componentes e utilitários transversais.

## Regras implementadas

- Cliente possui lista de transportes autorizados.
- Ordem de venda só é criada quando o transporte escolhido está autorizado para o cliente.
- Ordem de venda exige cliente, exatamente um transporte, ao menos um item cadastrado e status válido.
- Fluxo de status permitido: `CRIADA -> PLANEJADA -> AGENDADA -> EM_TRANSPORTE -> ENTREGUE`.
- Transições fora da sequência retornam erro pela API e são tratadas na UI.
- Agendamento permite data, janela, confirmação e reagendamento.
- Auditoria registra criação de ordem de venda, mudança de status, alteração de agenda e transporte.

## Segurança

- Headers HTTP definidos em `next.config.ts`: CSP, HSTS, X-Frame-Options, X-Content-Type-Options, Referrer-Policy e Permissions-Policy.
- Docker executa com usuário não-root, `read_only` e `no-new-privileges`.
- Script `npm run audit` incluído para checagem de vulnerabilidades.