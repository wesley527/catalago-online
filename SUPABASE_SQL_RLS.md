# Supabase: SQL e RLS (bairros, entrega e zerar pedidos)

Este documento descreve o que foi adicionado ao banco para **cadastro de bairros com taxa**, **dados de entrega nos pedidos** e **exclusão em massa de pedidos** pelo painel autenticado.

## Pré-requisitos

- Projeto Supabase com as migrações anteriores já aplicadas (`tenants`, `orders` com `tenant_id`, etc.).
- Usuários autenticados do painel devem ter `user_metadata.tenant_id` preenchido com o UUID do tenant (padrão já usado neste projeto).

## Como aplicar

1. **CLI Supabase** (recomendado): na raiz do projeto, com o projeto linkado:
   ```bash
   supabase db push
   ```
2. **SQL Editor** no dashboard do Supabase: copie e execute o conteúdo do arquivo de migração:
   - `supabase/migrations/20260410120000_09_neighborhoods_and_order_delivery.sql`

## 1. Tabela `neighborhoods` (bairros)

| Coluna        | Tipo        | Descrição                          |
|---------------|-------------|------------------------------------|
| `id`          | uuid PK     | Identificador                      |
| `tenant_id`   | uuid FK     | Loja (`tenants.id`), CASCADE delete |
| `name`        | text        | Nome do bairro                     |
| `price`       | numeric ≥ 0 | Taxa de entrega                    |
| `created_at`  | timestamptz |                                    |
| `updated_at`  | timestamptz |                                    |

- Índice único `(tenant_id, name)` evita duplicar o mesmo nome por loja.
- Índice `tenant_id` para listagens.

## 2. Colunas em `orders`

| Coluna              | Tipo        | Descrição |
|---------------------|-------------|-----------|
| `delivery_type`     | text        | `'pickup'` ou `'delivery'` (default `'delivery'` para linhas antigas) |
| `delivery_fee`      | numeric ≥ 0 | Taxa aplicada no pedido |
| `neighborhood_id`   | uuid nullable FK → `neighborhoods` | Bairro escolhido (SET NULL se o bairro for removido) |
| `neighborhood_name` | text nullable | Nome do bairro no momento do pedido (histórico) |

O **`total_amount`** do pedido deve ser o valor final (produtos + taxa), calculado no app.

## 3. Políticas RLS

### `neighborhoods`

- **authenticated**: SELECT / INSERT / UPDATE / DELETE apenas onde `tenant_id` = `tenant_id` do JWT (`auth.jwt() -> 'user_metadata' ->> 'tenant_id'`).
- **anon**: SELECT em todas as linhas (`USING (true)`), para o catálogo público listar bairros no checkout.

### `orders` (novas)

- **DELETE** para **authenticated**: apenas pedidos do próprio tenant — necessário para a função **“Zerar todos os pedidos”** no painel.

As políticas já existentes de SELECT/INSERT/UPDATE em `orders` (por tenant ou `anon` criando pedido) **não são removidas** por esta migração.

### `order_items` (nova)

- **DELETE** para **authenticated**: permite remover itens quando o pedido pai pertence ao tenant (necessário porque a exclusão em cascata pode exigir permissão nas linhas filhas).

> **Importante:** quem compra sem login usa a chave **anon**; as políticas de INSERT em `orders` e `order_items` com `WITH CHECK (true)` continuam válidas para o fluxo da loja pública.

## 4. SQL completo (referência)

O arquivo fonte da migração é a referência canônica:

`supabase/migrations/20260410120000_09_neighborhoods_and_order_delivery.sql`

Ele contém:

- `CREATE TABLE neighborhoods` + índices + `ENABLE ROW LEVEL SECURITY`;
- `CREATE POLICY` para `neighborhoods` (authenticated + anon leitura);
- `ALTER TABLE orders` com colunas e `CHECK (delivery_type IN ('pickup','delivery'))`;
- `CREATE POLICY` de DELETE em `orders` e `order_items` para usuários autenticados do tenant.

## 5. Segurança e boas práticas

- Valide no app que, em **`delivery`**, o cliente escolheu um bairro da mesma loja e que a taxa confere com o cadastro (evita manipulação de payload).
- A política **anon** em `neighborhoods` só expõe dados que o catálogo já precisa (nome e preço por loja); não há segredo de negócio crítico, mas o volume de dados é pequeno.
- Para ambientes novos, rode sempre todas as migrações em ordem em `supabase/migrations/`.

## 6. Resolução de problemas

| Problema | Verificação |
|----------|-------------|
| Erro ao salvar bairro no painel | Usuário logado com `tenant_id` no metadata; políticas `authenticated` em `neighborhoods`. |
| Checkout não lista bairros | Política **anon** SELECT em `neighborhoods`; `tenant_id` correto na loja. |
| “Zerar pedidos” falha | Política DELETE em `orders` para `authenticated`; usuário com mesmo `tenant_id` do pedido. |
| Constraint `delivery_type` | Valores permitidos apenas `pickup` ou `delivery`. |
