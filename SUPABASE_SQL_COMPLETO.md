# Supabase: limpar tudo e recriar do zero (SQL + RLS)

Este documento consolida **todo o SQL e RLS** necessário para o projeto **catalago-online** funcionar, com base nas migrações em `supabase/migrations/` e no uso no código (`anon` no cadastro de loja, `user_metadata.tenant_id` no JWT, bucket `product-images`).

> **Avisos**
>
> - Os scripts abaixo removem **apenas** as tabelas de negócio listadas. Não apagam usuários do **Auth** nem o schema `auth`.
> - Faça backup antes de rodar em produção.
> - Após recriar tabelas, usuários existentes **não** terão `tenant_id` no metadata até você reconfigurar (ver seção final).

---

## Parte 1 — Remover tudo que este projeto usa no banco

Execute **no SQL Editor** do Supabase (ou `psql`), na ordem.

### 1.1 Tabelas públicas (dados + RLS)

O `DROP TABLE ... CASCADE` remove políticas RLS, índices e FKs ligados a essas tabelas.

```sql
-- Ordem: filhos primeiro
DROP TABLE IF EXISTS order_items CASCADE;
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS neighborhoods CASCADE;
DROP TABLE IF EXISTS categories CASCADE;
DROP TABLE IF EXISTS tenant_settings CASCADE;
DROP TABLE IF EXISTS subscriptions CASCADE;
DROP TABLE IF EXISTS tenants CASCADE;
```

Se você tinha **nomes antigos** de políticas em tabelas que ainda existem (migração incremental), após os drops acima não sobra nada. Se por acaso **não** dropar uma tabela e só quiser remover políticas manualmente, use os nomes abaixo (histórico do projeto):

<details>
<summary>Políticas antigas (referência — só se precisar dropar sem dropar tabela)</summary>

**products:** `Anyone can view products`, `Authenticated users can insert products`, `Authenticated users can update products`, `Authenticated users can delete products`, `Users can read own tenant products`, `Users can insert own tenant products`, `Users can update own tenant products`, `Users can delete own tenant products`, `Public can read all products`

**orders:** `Anyone can create orders`, `Authenticated users can view all orders`, `Authenticated users can update orders`, `Users can read own tenant orders`, `Users can insert own tenant orders`, `Users can update own tenant orders`, `Public can create orders`, `Users can delete own tenant orders`

**order_items:** `Anyone can create order items`, `Authenticated users can view order items`, `Users can read own tenant order items`, `Users can insert own tenant order items`, `Public can create order items`, `Users can delete own tenant order items`

**tenants:** `Users can read own tenant`, `Service role can manage all tenants`, `Anon can insert tenant for signup`, `Public can read tenants`

**categories / tenant_settings / subscriptions / neighborhoods:** políticas com os mesmos nomes das seções da Parte 2.

```sql
-- Exemplo genérico (substitua nome_tabela e nome_politica):
-- DROP POLICY IF EXISTS "nome_politica" ON nome_tabela;
```

</details>

### 1.2 Storage (bucket `product-images`)

O app usa o bucket **`product-images`** (`ProductForm.tsx`, `TenantSettings.tsx`). Para remover arquivos e o bucket via SQL:

```sql
-- Remove objetos do bucket
DELETE FROM storage.objects WHERE bucket_id = 'product-images';

-- Remove o bucket (Supabase: tabela storage.buckets)
DELETE FROM storage.buckets WHERE id = 'product-images';
```

Se o Supabase reclamar de FK ou políticas, no **Dashboard → Storage**: esvazie o bucket, apague políticas do bucket e delete o bucket pela UI.

---

## Parte 2 — Criar schema completo + RLS (um script)

Este bloco recria o estado **final** esperado pelo código atual (inclui colunas de entrega/bairros e políticas de DELETE para “zerar pedidos”).

**Ordem lógica:** `tenants` → `categories` → `neighborhoods` → `products` → `orders` → `order_items` → `subscriptions` → `tenant_settings`.

```sql
-- ========== EXTENSÕES (geralmente já existem no Supabase) ==========
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ========== TENANTS ==========
CREATE TABLE tenants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  plan text NOT NULL DEFAULT 'free',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE tenants ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own tenant"
  ON tenants FOR SELECT TO authenticated
  USING (id = (auth.jwt() -> 'user_metadata' ->> 'tenant_id')::uuid);

-- Cadastro: createTenant() roda com sessão ANÔNIMA (antes do signUp) — necessário para o fluxo atual
CREATE POLICY "Anon can insert tenant for signup"
  ON tenants FOR INSERT TO anon
  WITH CHECK (true);

CREATE POLICY "Service role can manage all tenants"
  ON tenants FOR ALL TO service_role
  USING (true) WITH CHECK (true);

-- Vitrine: getTenantBySlug / getTenantById com cliente anon (subdomínio ou localhost + env)
CREATE POLICY "Public can read tenants"
  ON tenants FOR SELECT
  USING (true);

-- ========== CATEGORIES ==========
CREATE TABLE categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  tenant_id uuid NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX idx_categories_tenant_id ON categories(tenant_id);

ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own tenant categories"
  ON categories FOR SELECT TO authenticated
  USING (tenant_id = (auth.jwt() -> 'user_metadata' ->> 'tenant_id')::uuid);

CREATE POLICY "Users can insert own tenant categories"
  ON categories FOR INSERT TO authenticated
  WITH CHECK (tenant_id = (auth.jwt() -> 'user_metadata' ->> 'tenant_id')::uuid);

CREATE POLICY "Users can update own tenant categories"
  ON categories FOR UPDATE TO authenticated
  USING (tenant_id = (auth.jwt() -> 'user_metadata' ->> 'tenant_id')::uuid)
  WITH CHECK (tenant_id = (auth.jwt() -> 'user_metadata' ->> 'tenant_id')::uuid);

CREATE POLICY "Users can delete own tenant categories"
  ON categories FOR DELETE TO authenticated
  USING (tenant_id = (auth.jwt() -> 'user_metadata' ->> 'tenant_id')::uuid);

CREATE POLICY "Public can read all categories"
  ON categories FOR SELECT USING (true);

-- ========== NEIGHBORHOODS (bairros) ==========
CREATE TABLE neighborhoods (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  name text NOT NULL,
  price numeric NOT NULL CHECK (price >= 0),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE UNIQUE INDEX idx_neighborhoods_tenant_name ON neighborhoods (tenant_id, name);
CREATE INDEX idx_neighborhoods_tenant_id ON neighborhoods(tenant_id);

ALTER TABLE neighborhoods ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own tenant neighborhoods"
  ON neighborhoods FOR SELECT TO authenticated
  USING (tenant_id = (auth.jwt() -> 'user_metadata' ->> 'tenant_id')::uuid);

CREATE POLICY "Users can insert own tenant neighborhoods"
  ON neighborhoods FOR INSERT TO authenticated
  WITH CHECK (tenant_id = (auth.jwt() -> 'user_metadata' ->> 'tenant_id')::uuid);

CREATE POLICY "Users can update own tenant neighborhoods"
  ON neighborhoods FOR UPDATE TO authenticated
  USING (tenant_id = (auth.jwt() -> 'user_metadata' ->> 'tenant_id')::uuid)
  WITH CHECK (tenant_id = (auth.jwt() -> 'user_metadata' ->> 'tenant_id')::uuid);

CREATE POLICY "Users can delete own tenant neighborhoods"
  ON neighborhoods FOR DELETE TO authenticated
  USING (tenant_id = (auth.jwt() -> 'user_metadata' ->> 'tenant_id')::uuid);

CREATE POLICY "Public can read all neighborhoods"
  ON neighborhoods FOR SELECT USING (true);

-- ========== PRODUCTS ==========
CREATE TABLE products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  price numeric NOT NULL CHECK (price > 0),
  stock_quantity integer NOT NULL CHECK (stock_quantity >= 0),
  image_url text,
  tenant_id uuid NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  category_id uuid REFERENCES categories(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX idx_products_tenant_id ON products(tenant_id);
CREATE INDEX idx_products_category_id ON products(category_id);

ALTER TABLE products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own tenant products"
  ON products FOR SELECT TO authenticated
  USING (tenant_id = (auth.jwt() -> 'user_metadata' ->> 'tenant_id')::uuid);

CREATE POLICY "Users can insert own tenant products"
  ON products FOR INSERT TO authenticated
  WITH CHECK (tenant_id = (auth.jwt() -> 'user_metadata' ->> 'tenant_id')::uuid);

CREATE POLICY "Users can update own tenant products"
  ON products FOR UPDATE TO authenticated
  USING (tenant_id = (auth.jwt() -> 'user_metadata' ->> 'tenant_id')::uuid)
  WITH CHECK (tenant_id = (auth.jwt() -> 'user_metadata' ->> 'tenant_id')::uuid);

CREATE POLICY "Users can delete own tenant products"
  ON products FOR DELETE TO authenticated
  USING (tenant_id = (auth.jwt() -> 'user_metadata' ->> 'tenant_id')::uuid);

CREATE POLICY "Public can read all products"
  ON products FOR SELECT USING (true);

-- ========== ORDERS ==========
CREATE TABLE orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name text NOT NULL,
  customer_phone text NOT NULL,
  customer_address text NOT NULL,
  total_amount numeric NOT NULL CHECK (total_amount > 0),
  status text DEFAULT 'pending',
  created_at timestamptz DEFAULT now(),
  tenant_id uuid NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  delivery_type text NOT NULL DEFAULT 'delivery',
  delivery_fee numeric NOT NULL DEFAULT 0 CHECK (delivery_fee >= 0),
  neighborhood_id uuid REFERENCES neighborhoods(id) ON DELETE SET NULL,
  neighborhood_name text,
  CONSTRAINT orders_delivery_type_check CHECK (delivery_type IN ('pickup', 'delivery'))
);

CREATE INDEX idx_orders_tenant_id ON orders(tenant_id);
CREATE INDEX idx_orders_neighborhood_id ON orders(neighborhood_id);

ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own tenant orders"
  ON orders FOR SELECT TO authenticated
  USING (tenant_id = (auth.jwt() -> 'user_metadata' ->> 'tenant_id')::uuid);

CREATE POLICY "Users can insert own tenant orders"
  ON orders FOR INSERT TO authenticated
  WITH CHECK (tenant_id = (auth.jwt() -> 'user_metadata' ->> 'tenant_id')::uuid);

CREATE POLICY "Users can update own tenant orders"
  ON orders FOR UPDATE TO authenticated
  USING (tenant_id = (auth.jwt() -> 'user_metadata' ->> 'tenant_id')::uuid)
  WITH CHECK (tenant_id = (auth.jwt() -> 'user_metadata' ->> 'tenant_id')::uuid);

CREATE POLICY "Public can create orders"
  ON orders FOR INSERT TO anon
  WITH CHECK (true);

CREATE POLICY "Users can delete own tenant orders"
  ON orders FOR DELETE TO authenticated
  USING (tenant_id = (auth.jwt() -> 'user_metadata' ->> 'tenant_id')::uuid);

-- ========== ORDER_ITEMS ==========
CREATE TABLE order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id uuid NOT NULL REFERENCES products(id) ON DELETE RESTRICT,
  quantity integer NOT NULL CHECK (quantity > 0),
  unit_price numeric NOT NULL CHECK (unit_price > 0),
  created_at timestamptz DEFAULT now()
);

CREATE INDEX idx_order_items_order_id ON order_items(order_id);
CREATE INDEX idx_order_items_product_id ON order_items(product_id);

ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own tenant order items"
  ON order_items FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM orders
      WHERE orders.id = order_items.order_id
        AND orders.tenant_id = (auth.jwt() -> 'user_metadata' ->> 'tenant_id')::uuid
    )
  );

CREATE POLICY "Users can insert own tenant order items"
  ON order_items FOR INSERT TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM orders
      WHERE orders.id = order_items.order_id
        AND orders.tenant_id = (auth.jwt() -> 'user_metadata' ->> 'tenant_id')::uuid
    )
  );

CREATE POLICY "Public can create order items"
  ON order_items FOR INSERT TO anon
  WITH CHECK (true);

CREATE POLICY "Users can delete own tenant order items"
  ON order_items FOR DELETE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM orders
      WHERE orders.id = order_items.order_id
        AND orders.tenant_id = (auth.jwt() -> 'user_metadata' ->> 'tenant_id')::uuid
    )
  );

-- ========== SUBSCRIPTIONS (tabela existe nas migrações; app pode não usar ainda) ==========
CREATE TABLE subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  plan text NOT NULL DEFAULT 'free',
  status text NOT NULL DEFAULT 'active',
  expires_at timestamptz,
  created_at timestamptz DEFAULT now(),
  CONSTRAINT valid_status CHECK (status IN ('active', 'canceled', 'expired'))
);

CREATE INDEX idx_subscriptions_tenant_id ON subscriptions(tenant_id);
CREATE INDEX idx_subscriptions_status ON subscriptions(status);

ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own tenant subscription"
  ON subscriptions FOR SELECT TO authenticated
  USING (tenant_id = (auth.jwt() -> 'user_metadata' ->> 'tenant_id')::uuid);

CREATE POLICY "Service role can manage all subscriptions"
  ON subscriptions FOR ALL TO service_role
  USING (true) WITH CHECK (true);

-- ========== TENANT_SETTINGS ==========
CREATE TABLE tenant_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid UNIQUE NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  primary_color text DEFAULT '#2563eb',
  secondary_color text DEFAULT '#10b981',
  logo_url text,
  banner_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX idx_tenant_settings_tenant_id ON tenant_settings(tenant_id);

ALTER TABLE tenant_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own tenant settings"
  ON tenant_settings FOR SELECT TO authenticated
  USING (tenant_id = (auth.jwt() -> 'user_metadata' ->> 'tenant_id')::uuid);

CREATE POLICY "Users can update own tenant settings"
  ON tenant_settings FOR UPDATE TO authenticated
  USING (tenant_id = (auth.jwt() -> 'user_metadata' ->> 'tenant_id')::uuid)
  WITH CHECK (tenant_id = (auth.jwt() -> 'user_metadata' ->> 'tenant_id')::uuid);

CREATE POLICY "Public can read all tenant settings"
  ON tenant_settings FOR SELECT USING (true);

-- createDefaultSettings() roda logo após INSERT em tenants, ainda como anon
CREATE POLICY "Anon can insert default tenant settings for signup"
  ON tenant_settings FOR INSERT TO anon
  WITH CHECK (true);
```

---

## Parte 3 — Storage: bucket `product-images` + políticas

Crie o bucket e permita leitura pública + upload para usuários autenticados (painel admin).

```sql
-- Bucket público para URLs de imagem de produto
INSERT INTO storage.buckets (id, name, public)
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO UPDATE SET public = EXCLUDED.public;
```

Políticas em `storage.objects` (nomes explícitos para poder remover depois):

```sql
DROP POLICY IF EXISTS "Public read product images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated upload product images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated update product images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated delete product images" ON storage.objects;

CREATE POLICY "Public read product images"
  ON storage.objects FOR SELECT TO public
  USING (bucket_id = 'product-images');

CREATE POLICY "Authenticated upload product images"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'product-images');

CREATE POLICY "Authenticated update product images"
  ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'product-images')
  WITH CHECK (bucket_id = 'product-images');

CREATE POLICY "Authenticated delete product images"
  ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'product-images');
```

> Se preferir políticas só pela UI do Supabase, o resultado deve ser equivalente: leitura pública no bucket e escrita para `authenticated`.

**Limpar Storage (repetindo da Parte 1):** apagar objetos + bucket conforme seção 1.2 antes de recriar.

---

## Parte 4 — O que não é SQL mas o app precisa

1. **JWT `user_metadata.tenant_id`**  
   O painel e as políticas `authenticated` esperam o UUID do tenant em `user_metadata.tenant_id`. O fluxo de **signup** no código grava isso no `signUp`. Usuários criados manualmente no Auth precisam desse campo (ou login não enxerga o tenant).

2. **Primeiro tenant / testes**  
   Você pode inserir um tenant via SQL e depois associar o usuário no Auth, ou usar o fluxo de cadastro da aplicação após o schema estar criado.

3. **Variáveis de ambiente**  
   `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY` no frontend.

4. **Segurança das políticas `anon` em `tenants` e `tenant_settings`**  
   Elas existem porque o código chama `createTenant` **antes** de `signUp` (sessão anônima). Em produção, avalie migrar para **Edge Function** com `service_role` para criar tenant + settings sem abrir INSERT anônimo.

---

## Resumo das tabelas e papéis

| Tabela             | anon SELECT | anon INSERT | authenticated |
|--------------------|-------------|-------------|----------------|
| tenants            | sim (lista) | signup      | read own       |
| categories         | sim         | —           | CRUD tenant    |
| neighborhoods      | sim         | —           | CRUD tenant    |
| products           | sim         | —           | CRUD tenant    |
| orders             | —           | checkout    | RU + delete tenant |
| order_items        | —           | checkout    | R insert + delete tenant |
| tenant_settings    | sim         | signup      | read/update    |
| subscriptions      | —           | —           | read / service_role |

---

## Checklist rápido

- [ ] Rodar **Parte 1** (limpar)
- [ ] Rodar **Parte 2** (schema + RLS)
- [ ] Rodar **Parte 3** (storage)
- [ ] Testar cadastro de loja no app ou criar tenant + usuário com `tenant_id` no metadata
- [ ] Testar vitrine (anon) e painel (authenticated)

Arquivos de referência no repositório: `supabase/migrations/*.sql` e este documento como visão única “do zero”.
