/*
  Função única para ler tenant_id do JWT (user_metadata OU app_metadata).
  As políticas RLS passam a usar public.auth_tenant_id_from_jwt() para o painel
  funcionar mesmo se o Supabase expuser o id em metadados diferentes.
*/

CREATE OR REPLACE FUNCTION public.auth_tenant_id_from_jwt()
RETURNS uuid
LANGUAGE sql
STABLE
AS $$
  SELECT COALESCE(
    CASE
      WHEN (auth.jwt() -> 'user_metadata' ->> 'tenant_id') ~ '^[0-9a-fA-F-]{36}$'
      THEN (auth.jwt() -> 'user_metadata' ->> 'tenant_id')::uuid
    END,
    CASE
      WHEN (auth.jwt() -> 'app_metadata' ->> 'tenant_id') ~ '^[0-9a-fA-F-]{36}$'
      THEN (auth.jwt() -> 'app_metadata' ->> 'tenant_id')::uuid
    END
  );
$$;

GRANT EXECUTE ON FUNCTION public.auth_tenant_id_from_jwt() TO anon, authenticated;

-- ========== tenants ==========
DROP POLICY IF EXISTS "Users can read own tenant" ON tenants;
CREATE POLICY "Users can read own tenant"
  ON tenants FOR SELECT TO authenticated
  USING (id = auth_tenant_id_from_jwt());

-- ========== tenant_settings ==========
DROP POLICY IF EXISTS "Users can read own tenant settings" ON tenant_settings;
DROP POLICY IF EXISTS "Users can update own tenant settings" ON tenant_settings;

CREATE POLICY "Users can read own tenant settings"
  ON tenant_settings FOR SELECT TO authenticated
  USING (tenant_id = auth_tenant_id_from_jwt());

CREATE POLICY "Users can update own tenant settings"
  ON tenant_settings FOR UPDATE TO authenticated
  USING (tenant_id = auth_tenant_id_from_jwt())
  WITH CHECK (tenant_id = auth_tenant_id_from_jwt());

-- ========== categories ==========
DROP POLICY IF EXISTS "Users can read own tenant categories" ON categories;
DROP POLICY IF EXISTS "Users can insert own tenant categories" ON categories;
DROP POLICY IF EXISTS "Users can update own tenant categories" ON categories;
DROP POLICY IF EXISTS "Users can delete own tenant categories" ON categories;

CREATE POLICY "Users can read own tenant categories"
  ON categories FOR SELECT TO authenticated
  USING (tenant_id = auth_tenant_id_from_jwt());

CREATE POLICY "Users can insert own tenant categories"
  ON categories FOR INSERT TO authenticated
  WITH CHECK (tenant_id = auth_tenant_id_from_jwt());

CREATE POLICY "Users can update own tenant categories"
  ON categories FOR UPDATE TO authenticated
  USING (tenant_id = auth_tenant_id_from_jwt())
  WITH CHECK (tenant_id = auth_tenant_id_from_jwt());

CREATE POLICY "Users can delete own tenant categories"
  ON categories FOR DELETE TO authenticated
  USING (tenant_id = auth_tenant_id_from_jwt());

-- ========== products ==========
DROP POLICY IF EXISTS "Users can read own tenant products" ON products;
DROP POLICY IF EXISTS "Users can insert own tenant products" ON products;
DROP POLICY IF EXISTS "Users can update own tenant products" ON products;
DROP POLICY IF EXISTS "Users can delete own tenant products" ON products;

CREATE POLICY "Users can read own tenant products"
  ON products FOR SELECT TO authenticated
  USING (tenant_id = auth_tenant_id_from_jwt());

CREATE POLICY "Users can insert own tenant products"
  ON products FOR INSERT TO authenticated
  WITH CHECK (tenant_id = auth_tenant_id_from_jwt());

CREATE POLICY "Users can update own tenant products"
  ON products FOR UPDATE TO authenticated
  USING (tenant_id = auth_tenant_id_from_jwt())
  WITH CHECK (tenant_id = auth_tenant_id_from_jwt());

CREATE POLICY "Users can delete own tenant products"
  ON products FOR DELETE TO authenticated
  USING (tenant_id = auth_tenant_id_from_jwt());

-- ========== neighborhoods ==========
DROP POLICY IF EXISTS "Users can read own tenant neighborhoods" ON neighborhoods;
DROP POLICY IF EXISTS "Users can insert own tenant neighborhoods" ON neighborhoods;
DROP POLICY IF EXISTS "Users can update own tenant neighborhoods" ON neighborhoods;
DROP POLICY IF EXISTS "Users can delete own tenant neighborhoods" ON neighborhoods;

CREATE POLICY "Users can read own tenant neighborhoods"
  ON neighborhoods FOR SELECT TO authenticated
  USING (tenant_id = auth_tenant_id_from_jwt());

CREATE POLICY "Users can insert own tenant neighborhoods"
  ON neighborhoods FOR INSERT TO authenticated
  WITH CHECK (tenant_id = auth_tenant_id_from_jwt());

CREATE POLICY "Users can update own tenant neighborhoods"
  ON neighborhoods FOR UPDATE TO authenticated
  USING (tenant_id = auth_tenant_id_from_jwt())
  WITH CHECK (tenant_id = auth_tenant_id_from_jwt());

CREATE POLICY "Users can delete own tenant neighborhoods"
  ON neighborhoods FOR DELETE TO authenticated
  USING (tenant_id = auth_tenant_id_from_jwt());

-- ========== orders ==========
DROP POLICY IF EXISTS "Users can read own tenant orders" ON orders;
DROP POLICY IF EXISTS "Users can insert own tenant orders" ON orders;
DROP POLICY IF EXISTS "Users can update own tenant orders" ON orders;
DROP POLICY IF EXISTS "Users can delete own tenant orders" ON orders;

CREATE POLICY "Users can read own tenant orders"
  ON orders FOR SELECT TO authenticated
  USING (tenant_id = auth_tenant_id_from_jwt());

CREATE POLICY "Users can insert own tenant orders"
  ON orders FOR INSERT TO authenticated
  WITH CHECK (tenant_id = auth_tenant_id_from_jwt());

CREATE POLICY "Users can update own tenant orders"
  ON orders FOR UPDATE TO authenticated
  USING (tenant_id = auth_tenant_id_from_jwt())
  WITH CHECK (tenant_id = auth_tenant_id_from_jwt());

CREATE POLICY "Users can delete own tenant orders"
  ON orders FOR DELETE TO authenticated
  USING (tenant_id = auth_tenant_id_from_jwt());

-- ========== order_items ==========
DROP POLICY IF EXISTS "Users can read own tenant order items" ON order_items;
DROP POLICY IF EXISTS "Users can insert own tenant order items" ON order_items;
DROP POLICY IF EXISTS "Users can delete own tenant order items" ON order_items;

CREATE POLICY "Users can read own tenant order items"
  ON order_items FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM orders o
      WHERE o.id = order_items.order_id
        AND o.tenant_id = auth_tenant_id_from_jwt()
    )
  );

CREATE POLICY "Users can insert own tenant order items"
  ON order_items FOR INSERT TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM orders o
      WHERE o.id = order_items.order_id
        AND o.tenant_id = auth_tenant_id_from_jwt()
    )
  );

CREATE POLICY "Users can delete own tenant order items"
  ON order_items FOR DELETE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM orders o
      WHERE o.id = order_items.order_id
        AND o.tenant_id = auth_tenant_id_from_jwt()
    )
  );
