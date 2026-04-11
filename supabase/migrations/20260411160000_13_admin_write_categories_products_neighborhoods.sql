/*
  Garante GRANT e políticas RLS de escrita (INSERT/UPDATE/DELETE) no painel
  para categories, products e neighborhoods (papel authenticated + tenant_id no JWT).
*/

-- ========== categories ==========
DROP POLICY IF EXISTS "Users can read own tenant categories" ON categories;
DROP POLICY IF EXISTS "Users can insert own tenant categories" ON categories;
DROP POLICY IF EXISTS "Users can update own tenant categories" ON categories;
DROP POLICY IF EXISTS "Users can delete own tenant categories" ON categories;
DROP POLICY IF EXISTS "Public can read all categories" ON categories;

CREATE POLICY "Public can read all categories"
  ON categories FOR SELECT USING (true);

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

-- ========== products ==========
DROP POLICY IF EXISTS "Users can read own tenant products" ON products;
DROP POLICY IF EXISTS "Users can insert own tenant products" ON products;
DROP POLICY IF EXISTS "Users can update own tenant products" ON products;
DROP POLICY IF EXISTS "Users can delete own tenant products" ON products;
DROP POLICY IF EXISTS "Public can read all products" ON products;

CREATE POLICY "Public can read all products"
  ON products FOR SELECT USING (true);

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

-- ========== neighborhoods ==========
DROP POLICY IF EXISTS "Users can read own tenant neighborhoods" ON neighborhoods;
DROP POLICY IF EXISTS "Users can insert own tenant neighborhoods" ON neighborhoods;
DROP POLICY IF EXISTS "Users can update own tenant neighborhoods" ON neighborhoods;
DROP POLICY IF EXISTS "Users can delete own tenant neighborhoods" ON neighborhoods;
DROP POLICY IF EXISTS "Public can read all neighborhoods" ON neighborhoods;

CREATE POLICY "Public can read all neighborhoods"
  ON neighborhoods FOR SELECT USING (true);

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

-- ========== Privilégios de escrita (painel) ==========
GRANT SELECT, INSERT, UPDATE, DELETE ON public.categories TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.products TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.neighborhoods TO authenticated;
GRANT SELECT ON public.categories TO anon;
GRANT SELECT ON public.products TO anon;
GRANT SELECT ON public.neighborhoods TO anon;
