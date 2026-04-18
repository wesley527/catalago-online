# 📊 DIAGRAMA DO BANCO DE DADOS

## 🏗️ Estrutura Completa

```
┌──────────────────────────────────────────────────────────────────┐
│                      CATÁLOGO ONLINE                             │
│                   DATABASE SCHEMA                                 │
└──────────────────────────────────────────────────────────────────┘

                         ┌─────────────┐
                         │   TENANTS   │
                         │  (Lojas)    │
                         └──────┬──────┘
                                │
                ┌───────────────┼───────────────┐
                │               │               │
                ▼               ▼               ▼
         ┌──────────────┐ ┌──────────────┐ ┌──────────────┐
         │ CATEGORIES   │ │NEIGHBORHOODS │ │    ORDERS    │
         │(Categorias)  │ │  (Bairros)   │ │  (Pedidos)   │
         └──────┬───────┘ └──────────────┘ └──────┬───────┘
                │                                   │
                ▼                                   ▼
         ┌──────────────┐                    ┌──────────────┐
         │   PRODUCTS   │                    │ ORDER_ITEMS  │
         │  (Produtos)  │◄───────────────────┤ (Itens)      │
         └──────────────┘                    └──────────────┘
                │
                │
         ┌──────────────┐
         │  AUTH_USERS  │
         │ (Usuários)   │
         └──────────────┘
```

---

## 📋 Tabelas Detalhadas

### 1. TENANTS (Lojas)
```
┌─────────────────────────────────────────────────┐
│ tenants                                         │
├─────────────────────────────────────────────────┤
│ id              UUID (PK)                       │
│ name            VARCHAR(255) NOT NULL           │
│ slug            VARCHAR(255) UNIQUE             │
│ logo_url        TEXT                            │
│ color           VARCHAR(7)                      │
│ theme           VARCHAR(50)                     │
│ created_at      TIMESTAMP                       │
│ updated_at      TIMESTAMP                       │
└─────────────────────────────────────────────────┘
```

**Índices:**
- Primary Key: `id`
- Unique: `slug`

**Relacionamentos (1:N):**
- → categories
- → products
- → neighborhoods
- → orders
- → auth_users

---

### 2. CATEGORIES (Categorias)
```
┌─────────────────────────────────────────────────┐
│ categories                                      │
├─────────────────────────────────────────────────┤
│ id              UUID (PK)                       │
│ tenant_id       UUID (FK) → tenants             │
│ name            VARCHAR(255) NOT NULL           │
│ description     TEXT                            │
│ icon            VARCHAR(50)                     │
│ active          BOOLEAN DEFAULT true            │
│ created_at      TIMESTAMP                       │
│ updated_at      TIMESTAMP                       │
└─────────────────────────────────────────────────┘
```

**Índices:**
- Primary Key: `id`
- Foreign Key: `tenant_id`

**Relacionamentos:**
- ← tenants (N:1)
- → products (1:N)

---

### 3. PRODUCTS (Produtos)
```
┌─────────────────────────────────────────────────┐
│ products                                        │
├─────────────────────────────────────────────────┤
│ id              UUID (PK)                       │
│ tenant_id       UUID (FK) → tenants             │
│ category_id     UUID (FK) → categories          │
│ name            VARCHAR(255) NOT NULL           │
│ description     TEXT                            │
│ price           DECIMAL(10,2) CHECK >= 0       │
│ image_url       TEXT                            │
│ stock_quantity  INTEGER CHECK >= 0              │
│ active          BOOLEAN DEFAULT true            │
│ created_at      TIMESTAMP                       │
│ updated_at      TIMESTAMP                       │
└─────────────────────────────────────────────────┘
```

**Índices:**
- Primary Key: `id`
- Foreign Keys: `tenant_id`, `category_id`

**Relacionamentos:**
- ← tenants (N:1)
- ← categories (N:1)
- → order_items (1:N)

---

### 4. NEIGHBORHOODS (Bairros)
```
┌─────────────────────────────────────────────────┐
│ neighborhoods                                   │
├─────────────────────────────────────────────────┤
│ id              UUID (PK)                       │
│ tenant_id       UUID (FK) → tenants             │
│ name            VARCHAR(255) NOT NULL           │
│ zip_codes       TEXT[] (Array)                  │
│ delivery_fee    DECIMAL(10,2) CHECK >= 0       │
│ active          BOOLEAN DEFAULT true            │
│ created_at      TIMESTAMP                       │
│ updated_at      TIMESTAMP                       │
└─────────────────────────────────────────────────┘
```

**Índices:**
- Primary Key: `id`
- Foreign Key: `tenant_id`

**Relacionamentos:**
- ← tenants (N:1)
- → orders (1:N)

---

### 5. ORDERS (Pedidos)
```
┌──────────────────────────────────────────────────┐
│ orders                                           │
├──────────────────────────────────────────────────┤
│ id               UUID (PK)                       │
│ tenant_id        UUID (FK) → tenants             │
│ customer_name    VARCHAR(255) NOT NULL           │
│ customer_email   VARCHAR(255)                    │
│ customer_phone   VARCHAR(20)                     │
│ customer_address TEXT                            │
│ total_amount     DECIMAL(10,2) NOT NULL          │
│ delivery_type    VARCHAR(50) (pickup|delivery)  │
│ delivery_fee     DECIMAL(10,2)                   │
│ neighborhood_id  UUID (FK) → neighborhoods      │
│ neighborhood_name VARCHAR(255)                   │
│ payment_method   VARCHAR(50)                     │
│ status           VARCHAR(50) (pending|etc)      │
│ notes            TEXT                            │
│ created_at       TIMESTAMP                       │
│ updated_at       TIMESTAMP                       │
└──────────────────────────────────────────────────┘
```

**Índices:**
- Primary Key: `id`
- Foreign Keys: `tenant_id`, `neighborhood_id`
- Status: `status`
- Temporal: `created_at DESC`

**Relacionamentos:**
- ← tenants (N:1)
- ← neighborhoods (N:1)
- → order_items (1:N)

---

### 6. ORDER_ITEMS (Itens do Pedido)
```
┌──────────────────────────────────────────────────┐
│ order_items                                      │
├──────────────────────────────────────────────────┤
│ id               UUID (PK)                       │
│ order_id         UUID (FK) → orders              │
│ product_id       UUID (FK) → products            │
│ quantity         INTEGER CHECK > 0               │
│ unit_price       DECIMAL(10,2) CHECK >= 0       │
│ created_at       TIMESTAMP                       │
└──────────────────────────────────────────────────┘
```

**Índices:**
- Primary Key: `id`
- Foreign Keys: `order_id`, `product_id`

**Relacionamentos:**
- ← orders (N:1)
- ← products (N:1)

---

### 7. AUTH_USERS (Usuários)
```
┌──────────────────────────────────────────────────┐
│ auth_users                                       │
├──────────────────────────────────────────────────┤
│ id               UUID (PK)                       │
│ tenant_id        UUID (FK) → tenants             │
│ email            VARCHAR(255) NOT NULL           │
│ full_name        VARCHAR(255)                    │
│ role             VARCHAR(50) (admin|manager|etc)│
│ active           BOOLEAN DEFAULT true            │
│ created_at       TIMESTAMP                       │
│ updated_at       TIMESTAMP                       │
│ UNIQUE(tenant_id, email)                        │
└──────────────────────────────────────────────────┘
```

**Índices:**
- Primary Key: `id`
- Foreign Key: `tenant_id`
- Unique: `(tenant_id, email)`
- Email: `email`

**Relacionamentos:**
- ← tenants (N:1)

---

## 🔄 Relacionamentos Detalhados

### 1:N (Um para Muitos)
```
tenants (1) ──────────→ (N) categories
tenants (1) ──────────→ (N) products
tenants (1) ──────────→ (N) neighborhoods
tenants (1) ──────────→ (N) orders
tenants (1) ──────────→ (N) auth_users
categories (1) ───────→ (N) products
neighborhoods (1) ────→ (N) orders
orders (1) ───────────→ (N) order_items
products (1) ─────────→ (N) order_items
```

### N:M (Muitos para Muitos) - Implícito
```
products (N) ──→ order_items ←── (N) orders
```

---

## 🔐 Constraints (Restrições)

### Primary Keys (PK)
- ✅ Todas as tabelas têm um UUID único como PK

### Foreign Keys (FK)
- ✅ `categories.tenant_id` → `tenants.id` (CASCADE DELETE)
- ✅ `products.tenant_id` → `tenants.id` (CASCADE Delete)
- ✅ `products.category_id` → `categories.id` (SET NULL)
- ✅ `neighborhoods.tenant_id` → `tenants.id` (CASCADE Delete)
- ✅ `orders.tenant_id` → `tenants.id` (CASCADE Delete)
- ✅ `orders.neighborhood_id` → `neighborhoods.id` (SET NULL)
- ✅ `order_items.order_id` → `orders.id` (CASCADE Delete)
- ✅ `order_items.product_id` → `products.id` (RESTRICT)
- ✅ `auth_users.tenant_id` → `tenants.id` (CASCADE Delete)

### CHECK Constraints
- ✅ `price >= 0` em products
- ✅ `stock_quantity >= 0` em products
- ✅ `delivery_fee >= 0` em neighborhoods
- ✅ `unit_price >= 0` em order_items
- ✅ `quantity > 0` em order_items
- ✅ `total_amount > 0` em orders

### UNIQUE Constraints
- ✅ `tenants.slug` deve ser único
- ✅ `(tenant_id, email)` em auth_users deve ser único

---

## 📈 Índices de Performance

```
idx_categories_tenant_id      → Buscar categorias de uma loja
idx_products_tenant_id         → Buscar produtos de uma loja
idx_products_category_id       → Buscar produtos de uma categoria
idx_neighborhoods_tenant_id    → Buscar bairros de uma loja
idx_orders_tenant_id           → Buscar pedidos de uma loja
idx_orders_status              → Filtrar pedidos por status
idx_orders_created_at          → Ordenar pedidos por data
idx_order_items_order_id       → Buscar itens de um pedido
idx_order_items_product_id     → Buscar vendas de um produto
idx_auth_users_tenant_id       → Buscar usuários de uma loja
idx_auth_users_email           → Buscar usuário por email
```

---

## 🗄️ Triggers

```
┌──────────────────────────────────────┐
│  update_updated_at_column()          │
│  (Função PostgreSQL)                 │
├──────────────────────────────────────┤
│ Atualiza o campo updated_at          │
│ automaticamente quando há UPDATE      │
└──────────────────────────────────────┘

Aplicado em:
  ✅ tenants
  ✅ categories
  ✅ products
  ✅ neighborhoods
  ✅ orders
  ✅ auth_users
```

---

## 🎯 Fluxo de Dados

### Criação de Pedido
```
1. Cliente vê produtos (leitura pública)
2. Cliente seleciona bairro (leitura pública)
3. Cliente cria pedido
   → Insere em orders
   → Insere em order_items
   → Atualiza estoque em products
4. Admin vê pedido (política RLS)
5. Admin muda status
6. Triggers atualizam updated_at
```

### Estrutura Exemplo
```json
{
  "order": {
    "id": "uuid",
    "tenant_id": "uuid",
    "customer_name": "João",
    "items": [
      {
        "product_id": "uuid",
        "quantity": 2,
        "unit_price": 29.90
      }
    ],
    "total": 59.80,
    "delivery": {
      "type": "delivery",
      "fee": 5.50,
      "neighborhood": "Centro"
    }
  }
}
```

---

## 📊 Exemplo de Query com JOIN

```sql
SELECT 
  o.id AS pedido_id,
  o.customer_name,
  o.total_amount,
  oi.product_id,
  p.name AS produto,
  oi.quantity,
  c.name AS categoria,
  n.name AS bairro,
  o.status
FROM orders o
LEFT JOIN order_items oi ON o.id = oi.order_id
LEFT JOIN products p ON oi.product_id = p.id
LEFT JOIN categories c ON p.category_id = c.id
LEFT JOIN neighborhoods n ON o.neighborhood_id = n.id
WHERE o.tenant_id = 'uuid'
ORDER BY o.created_at DESC;
```

---

## 🎓 Normalização

✅ **1NF (First Normal Form):** Todos os campos contêm valores atômicos
✅ **2NF (Second Normal Form):** Não há dependências parciais
✅ **3NF (Third Normal Form):** Não há dependências transitivas

---

## 💾 Backup & Recovery

Estrutura otimizada para:
- ✅ Backups automáticos (Supabase faz)
- ✅ Recovery rápido
- ✅ Cascata de deletes segura
- ✅ Integridade referencial

---

**Diagrama criado em:** 2024
**Versão do Database:** 1.0
**Status:** ✅ Pronto para Produção
