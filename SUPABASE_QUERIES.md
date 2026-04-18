# 📝 QUERIES ÚTEIS PARA O SUPABASE

## 🔍 QUERIES DE CONSULTA

### 1. Listar todas as lojas
```sql
SELECT * FROM public.tenants ORDER BY created_at DESC;
```

### 2. Listar categorias de uma loja
```sql
SELECT * FROM public.categories 
WHERE tenant_id = 'uuid-da-loja' AND active = true
ORDER BY name;
```

### 3. Listar produtos de uma categoria
```sql
SELECT p.* FROM public.products p
WHERE p.category_id = 'uuid-da-categoria' AND p.active = true
ORDER BY p.name;
```

### 4. Listar todos os produtos com suas categorias
```sql
SELECT 
  p.id,
  p.name,
  p.price,
  p.stock_quantity,
  c.name AS category_name
FROM public.products p
LEFT JOIN public.categories c ON p.category_id = c.id
WHERE p.tenant_id = 'uuid-da-loja'
ORDER BY c.name, p.name;
```

### 5. Listar bairros de uma loja
```sql
SELECT * FROM public.neighborhoods
WHERE tenant_id = 'uuid-da-loja' AND active = true
ORDER BY name;
```

### 6. Listar pedidos de uma loja
```sql
SELECT * FROM public.orders
WHERE tenant_id = 'uuid-da-loja'
ORDER BY created_at DESC;
```

### 7. Listar pedidos com itens detalhados
```sql
SELECT 
  o.id AS order_id,
  o.customer_name,
  o.customer_phone,
  o.total_amount,
  o.status,
  o.created_at,
  oi.product_id,
  p.name AS product_name,
  oi.quantity,
  oi.unit_price,
  (oi.quantity * oi.unit_price) AS subtotal
FROM public.orders o
LEFT JOIN public.order_items oi ON o.id = oi.order_id
LEFT JOIN public.products p ON oi.product_id = p.id
WHERE o.tenant_id = 'uuid-da-loja'
ORDER BY o.created_at DESC, o.id;
```

### 8. Listar usuários de uma loja
```sql
SELECT id, email, full_name, role, active 
FROM public.auth_users
WHERE tenant_id = 'uuid-da-loja'
ORDER BY created_at DESC;
```

### 9. Verificar estoque baixo
```sql
SELECT 
  id,
  name,
  price,
  stock_quantity,
  CASE 
    WHEN stock_quantity < 5 THEN 'CRÍTICO'
    WHEN stock_quantity < 10 THEN 'BAIXO'
    ELSE 'OK'
  END AS status_estoque
FROM public.products
WHERE tenant_id = 'uuid-da-loja' AND active = true
ORDER BY stock_quantity ASC;
```

### 10. Listar pedidos do dia
```sql
SELECT 
  id,
  customer_name,
  customer_phone,
  total_amount,
  status
FROM public.orders
WHERE tenant_id = 'uuid-da-loja'
  AND DATE(created_at) = CURRENT_DATE
ORDER BY created_at DESC;
```

---

## ➕ QUERIES DE INSERÇÃO

### 1. Adicionar novo produto
```sql
INSERT INTO public.products 
(tenant_id, category_id, name, description, price, stock_quantity, active)
VALUES (
  'uuid-da-loja',
  'uuid-da-categoria',
  'Nome do Produto',
  'Descrição do produto',
  29.90,
  50,
  true
);
```

### 2. Adicionar nova categoria
```sql
INSERT INTO public.categories 
(tenant_id, name, description, icon, active)
VALUES (
  'uuid-da-loja',
  'Nome da Categoria',
  'Descrição',
  '🍕',
  true
);
```

### 3. Adicionar novo bairro
```sql
INSERT INTO public.neighborhoods 
(tenant_id, name, zip_codes, delivery_fee, active)
VALUES (
  'uuid-da-loja',
  'Nome do Bairro',
  ARRAY['01000-000', '01100-000'],
  5.50,
  true
);
```

### 4. Adicionar usuário à loja
```sql
INSERT INTO public.auth_users 
(tenant_id, email, full_name, role, active)
VALUES (
  'uuid-da-loja',
  'usuario@email.com',
  'Nome do Usuário',
  'manager',
  true
);
```

---

## ✏️ QUERIES DE ATUALIZAÇÃO

### 1. Atualizar preço de um produto
```sql
UPDATE public.products
SET price = 39.90
WHERE id = 'uuid-do-produto';
```

### 2. Atualizar estoque
```sql
UPDATE public.products
SET stock_quantity = stock_quantity - 5
WHERE id = 'uuid-do-produto';
```

### 3. Ativar/Desativar produto
```sql
UPDATE public.products
SET active = false
WHERE id = 'uuid-do-produto';
```

### 4. Mudar status do pedido
```sql
UPDATE public.orders
SET status = 'completed'
WHERE id = 'uuid-do-pedido';
```

### 5. Editar categoria
```sql
UPDATE public.categories
SET name = 'Novo Nome', description = 'Nova descrição'
WHERE id = 'uuid-da-categoria';
```

### 6. Desativar bairro
```sql
UPDATE public.neighborhoods
SET active = false
WHERE id = 'uuid-do-bairro';
```

---

## 🗑️ QUERIES DE DELEÇÃO

### 1. Deletar produto (com cuidado!)
```sql
DELETE FROM public.products
WHERE id = 'uuid-do-produto' AND tenant_id = 'uuid-da-loja';
```

### 2. Deletar categoria (se não tiver produtos)
```sql
DELETE FROM public.categories
WHERE id = 'uuid-da-categoria' AND tenant_id = 'uuid-da-loja';
```

### 3. Deletar pedido (com cuidado!)
```sql
DELETE FROM public.orders
WHERE id = 'uuid-do-pedido' AND tenant_id = 'uuid-da-loja';
```

---

## 📊 QUERIES ANALÍTICAS

### 1. Total de pedidos por dia
```sql
SELECT 
  DATE(created_at) AS data,
  COUNT(*) AS total_pedidos,
  SUM(total_amount) AS receita
FROM public.orders
WHERE tenant_id = 'uuid-da-loja'
GROUP BY DATE(created_at)
ORDER BY data DESC;
```

### 2. Produtos mais vendidos
```sql
SELECT 
  p.name,
  SUM(oi.quantity) AS total_vendido,
  SUM(oi.quantity * oi.unit_price) AS receita
FROM public.order_items oi
JOIN public.products p ON oi.product_id = p.id
JOIN public.orders o ON oi.order_id = o.id
WHERE o.tenant_id = 'uuid-da-loja'
GROUP BY p.id, p.name
ORDER BY total_vendido DESC
LIMIT 10;
```

### 3. Métodos de pagamento preferidos
```sql
SELECT 
  payment_method,
  COUNT(*) AS total,
  SUM(total_amount) AS receita
FROM public.orders
WHERE tenant_id = 'uuid-da-loja'
GROUP BY payment_method
ORDER BY total DESC;
```

### 4. Estatísticas de entrega
```sql
SELECT 
  delivery_type,
  COUNT(*) AS total_pedidos,
  AVG(delivery_fee) AS taxa_media,
  SUM(delivery_fee) AS receita_total
FROM public.orders
WHERE tenant_id = 'uuid-da-loja'
GROUP BY delivery_type;
```

### 5. Ticket médio
```sql
SELECT 
  COUNT(*) AS total_pedidos,
  AVG(total_amount) AS ticket_medio,
  MIN(total_amount) AS pedido_minimo,
  MAX(total_amount) AS pedido_maximo,
  SUM(total_amount) AS receita_total
FROM public.orders
WHERE tenant_id = 'uuid-da-loja';
```

---

## 🔐 QUERIES DE SEGURANÇA / RLS

### 1. Listar todas as policies
```sql
SELECT tablename, policyname, permissive, roles, qual, with_check
FROM pg_policies
ORDER BY tablename;
```

### 2. Verificar RLS habilitado
```sql
SELECT schemaname, tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY tablename;
```

### 3. Listar triggers
```sql
SELECT trigger_name, event_manipulation, event_object_table
FROM information_schema.triggers
WHERE trigger_schema = 'public'
ORDER BY event_object_table;
```

---

## 💡 DICAS ÚTEIS

### Dica 1: Usar variáveis
```sql
-- No Supabase SQL Editor você pode usar variáveis assim:
SELECT * FROM public.products 
WHERE tenant_id = '{{tenant_id}}' 
LIMIT 10;
```

### Dica 2: Combinar filtros
```sql
SELECT * FROM public.products
WHERE tenant_id = 'uuid' 
  AND active = true
  AND stock_quantity > 0
  AND price BETWEEN 10 AND 50
ORDER BY price DESC;
```

### Dica 3: Usar JSON agregado
```sql
SELECT 
  o.id,
  o.customer_name,
  json_agg(
    json_build_object(
      'product', p.name,
      'quantity', oi.quantity,
      'price', oi.unit_price
    )
  ) AS items
FROM public.orders o
LEFT JOIN public.order_items oi ON o.id = oi.order_id
LEFT JOIN public.products p ON oi.product_id = p.id
WHERE o.tenant_id = 'uuid'
GROUP BY o.id, o.customer_name;
```

---

## ⚠️ IMPORTANTE

- ✅ **SEMPRE** especifique o `tenant_id` em queries
- ✅ Use **prepared statements** na aplicação
- ✅ Verifique **RLS policies** antes de deletar dados
- ✅ Faça **backups** regularmente
- ✅ Teste queries em um **ambiente de desenvolvimento** primeiro

---

**Salve este arquivo para consulta rápida!** 📚
