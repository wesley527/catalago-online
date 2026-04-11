/*
  # Bairros (neighborhoods) e entrega nos pedidos

  1. Tabela `neighborhoods`
  2. Colunas em `orders`: tipo de entrega, taxa, bairro
  3. RLS para neighborhoods
  4. Políticas DELETE em orders e order_items (zerar pedidos)
*/

-- ========== neighborhoods ==========
CREATE TABLE IF NOT EXISTS neighborhoods (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  name text NOT NULL,
  price numeric NOT NULL CHECK (price >= 0),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_neighborhoods_tenant_name
  ON neighborhoods (tenant_id, name);

CREATE INDEX IF NOT EXISTS idx_neighborhoods_tenant_id ON neighborhoods(tenant_id);

ALTER TABLE neighborhoods ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own tenant neighborhoods"
  ON neighborhoods
  FOR SELECT
  TO authenticated
  USING (tenant_id = (auth.jwt() -> 'user_metadata' ->> 'tenant_id')::uuid);

CREATE POLICY "Users can insert own tenant neighborhoods"
  ON neighborhoods
  FOR INSERT
  TO authenticated
  WITH CHECK (tenant_id = (auth.jwt() -> 'user_metadata' ->> 'tenant_id')::uuid);

CREATE POLICY "Users can update own tenant neighborhoods"
  ON neighborhoods
  FOR UPDATE
  TO authenticated
  USING (tenant_id = (auth.jwt() -> 'user_metadata' ->> 'tenant_id')::uuid)
  WITH CHECK (tenant_id = (auth.jwt() -> 'user_metadata' ->> 'tenant_id')::uuid);

CREATE POLICY "Users can delete own tenant neighborhoods"
  ON neighborhoods
  FOR DELETE
  TO authenticated
  USING (tenant_id = (auth.jwt() -> 'user_metadata' ->> 'tenant_id')::uuid);

CREATE POLICY "Public can read all neighborhoods"
  ON neighborhoods
  FOR SELECT
  TO anon
  USING (true);

-- ========== orders: entrega ==========
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'orders' AND column_name = 'delivery_type'
  ) THEN
    ALTER TABLE orders ADD COLUMN delivery_type text NOT NULL DEFAULT 'delivery';
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'orders' AND column_name = 'delivery_fee'
  ) THEN
    ALTER TABLE orders ADD COLUMN delivery_fee numeric NOT NULL DEFAULT 0 CHECK (delivery_fee >= 0);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'orders' AND column_name = 'neighborhood_id'
  ) THEN
    ALTER TABLE orders ADD COLUMN neighborhood_id uuid REFERENCES neighborhoods(id) ON DELETE SET NULL;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'orders' AND column_name = 'neighborhood_name'
  ) THEN
    ALTER TABLE orders ADD COLUMN neighborhood_name text;
  END IF;
END $$;

ALTER TABLE orders DROP CONSTRAINT IF EXISTS orders_delivery_type_check;

ALTER TABLE orders ADD CONSTRAINT orders_delivery_type_check
  CHECK (delivery_type IN ('pickup', 'delivery'));

CREATE INDEX IF NOT EXISTS idx_orders_neighborhood_id ON orders(neighborhood_id);

-- ========== DELETE pedidos (autenticado, mesmo tenant) ==========
CREATE POLICY "Users can delete own tenant orders"
  ON orders
  FOR DELETE
  TO authenticated
  USING (tenant_id = (auth.jwt() -> 'user_metadata' ->> 'tenant_id')::uuid);

CREATE POLICY "Users can delete own tenant order items"
  ON order_items
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM orders
      WHERE orders.id = order_items.order_id
      AND orders.tenant_id = (auth.jwt() -> 'user_metadata' ->> 'tenant_id')::uuid
    )
  );
