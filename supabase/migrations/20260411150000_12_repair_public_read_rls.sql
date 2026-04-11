/*
  Reparo RLS: leitura pública da vitrine + grants.

  Problema: políticas "Public can read ... TO anon" não se aplicam a usuários
  com sessão (papel authenticated), gerando 403 em products, tenant_settings, etc.

  Solução: políticas de SELECT com USING (true) sem TO explícito (valem para
  todos os papéis) + GRANT SELECT onde faltar.

  Pedidos no painel: garante políticas e GRANT para authenticated em orders/order_items.
*/

-- ========== Catálogo público (anon + authenticated na vitrine) ==========

DROP POLICY IF EXISTS "Public can read tenants" ON tenants;
CREATE POLICY "Public can read tenants"
  ON tenants FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public can read all tenant settings" ON tenant_settings;
CREATE POLICY "Public can read all tenant settings"
  ON tenant_settings FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public can read all products" ON products;
CREATE POLICY "Public can read all products"
  ON products FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public can read all categories" ON categories;
CREATE POLICY "Public can read all categories"
  ON categories FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public can read all neighborhoods" ON neighborhoods;
CREATE POLICY "Public can read all neighborhoods"
  ON neighborhoods FOR SELECT USING (true);

-- ========== Pedidos (painel autenticado) ==========

DROP POLICY IF EXISTS "Users can read own tenant orders" ON orders;
CREATE POLICY "Users can read own tenant orders"
  ON orders FOR SELECT TO authenticated
  USING (tenant_id = (auth.jwt() -> 'user_metadata' ->> 'tenant_id')::uuid);

DROP POLICY IF EXISTS "Users can insert own tenant orders" ON orders;
CREATE POLICY "Users can insert own tenant orders"
  ON orders FOR INSERT TO authenticated
  WITH CHECK (tenant_id = (auth.jwt() -> 'user_metadata' ->> 'tenant_id')::uuid);

DROP POLICY IF EXISTS "Users can update own tenant orders" ON orders;
CREATE POLICY "Users can update own tenant orders"
  ON orders FOR UPDATE TO authenticated
  USING (tenant_id = (auth.jwt() -> 'user_metadata' ->> 'tenant_id')::uuid)
  WITH CHECK (tenant_id = (auth.jwt() -> 'user_metadata' ->> 'tenant_id')::uuid);

DROP POLICY IF EXISTS "Public can create orders" ON orders;
CREATE POLICY "Public can create orders"
  ON orders FOR INSERT TO anon
  WITH CHECK (true);

DROP POLICY IF EXISTS "Users can delete own tenant orders" ON orders;
CREATE POLICY "Users can delete own tenant orders"
  ON orders FOR DELETE TO authenticated
  USING (tenant_id = (auth.jwt() -> 'user_metadata' ->> 'tenant_id')::uuid);

DROP POLICY IF EXISTS "Users can read own tenant order items" ON order_items;
CREATE POLICY "Users can read own tenant order items"
  ON order_items FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM orders
      WHERE orders.id = order_items.order_id
        AND orders.tenant_id = (auth.jwt() -> 'user_metadata' ->> 'tenant_id')::uuid
    )
  );

DROP POLICY IF EXISTS "Users can insert own tenant order items" ON order_items;
CREATE POLICY "Users can insert own tenant order items"
  ON order_items FOR INSERT TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM orders
      WHERE orders.id = order_items.order_id
        AND orders.tenant_id = (auth.jwt() -> 'user_metadata' ->> 'tenant_id')::uuid
    )
  );

DROP POLICY IF EXISTS "Public can create order items" ON order_items;
CREATE POLICY "Public can create order items"
  ON order_items FOR INSERT TO anon
  WITH CHECK (true);

DROP POLICY IF EXISTS "Users can delete own tenant order items" ON order_items;
CREATE POLICY "Users can delete own tenant order items"
  ON order_items FOR DELETE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM orders
      WHERE orders.id = order_items.order_id
        AND orders.tenant_id = (auth.jwt() -> 'user_metadata' ->> 'tenant_id')::uuid
    )
  );

-- ========== Privilégios de tabela (se estiverem faltando) ==========

GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT SELECT ON public.tenants TO anon, authenticated;
GRANT SELECT, UPDATE ON public.tenant_settings TO authenticated;
GRANT SELECT ON public.tenant_settings TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.products TO authenticated;
GRANT SELECT ON public.products TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.categories TO authenticated;
GRANT SELECT ON public.categories TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.neighborhoods TO authenticated;
GRANT SELECT ON public.neighborhoods TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.orders TO authenticated;
GRANT INSERT ON public.orders TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.order_items TO authenticated;
GRANT INSERT ON public.order_items TO anon;
