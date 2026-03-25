/*
  # Alter existing tables to add tenant_id and category support

  1. Changes to existing tables
    - Add `tenant_id` to `products` table
    - Add `category_id` to `products` table
    - Add `tenant_id` to `orders` table
    - Add `tenant_id` to `order_items` table (via orders)
  
  2. Indexes
    - Add indexes for performance on tenant_id columns
  
  3. Security
    - Drop existing RLS policies
    - Create new RLS policies with tenant isolation
  
  Note: This migration safely handles existing data by allowing NULL values initially
*/

-- Add tenant_id to products
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'products' AND column_name = 'tenant_id'
  ) THEN
    ALTER TABLE products ADD COLUMN tenant_id uuid REFERENCES tenants(id) ON DELETE CASCADE;
  END IF;
END $$;

-- Add category_id to products
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'products' AND column_name = 'category_id'
  ) THEN
    ALTER TABLE products ADD COLUMN category_id uuid REFERENCES categories(id) ON DELETE SET NULL;
  END IF;
END $$;

-- Add tenant_id to orders
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'orders' AND column_name = 'tenant_id'
  ) THEN
    ALTER TABLE orders ADD COLUMN tenant_id uuid REFERENCES tenants(id) ON DELETE CASCADE;
  END IF;
END $$;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_products_tenant_id ON products(tenant_id);
CREATE INDEX IF NOT EXISTS idx_products_category_id ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_orders_tenant_id ON orders(tenant_id);

-- Drop existing policies on products
DROP POLICY IF EXISTS "Public can read all products" ON products;
DROP POLICY IF EXISTS "Service role can manage products" ON products;

-- Create new RLS policies for products with tenant isolation
CREATE POLICY "Users can read own tenant products"
  ON products
  FOR SELECT
  TO authenticated
  USING (tenant_id = (auth.jwt() -> 'user_metadata' ->> 'tenant_id')::uuid);

CREATE POLICY "Users can insert own tenant products"
  ON products
  FOR INSERT
  TO authenticated
  WITH CHECK (tenant_id = (auth.jwt() -> 'user_metadata' ->> 'tenant_id')::uuid);

CREATE POLICY "Users can update own tenant products"
  ON products
  FOR UPDATE
  TO authenticated
  USING (tenant_id = (auth.jwt() -> 'user_metadata' ->> 'tenant_id')::uuid)
  WITH CHECK (tenant_id = (auth.jwt() -> 'user_metadata' ->> 'tenant_id')::uuid);

CREATE POLICY "Users can delete own tenant products"
  ON products
  FOR DELETE
  TO authenticated
  USING (tenant_id = (auth.jwt() -> 'user_metadata' ->> 'tenant_id')::uuid);

CREATE POLICY "Public can read all products"
  ON products
  FOR SELECT
  TO anon
  USING (true);

-- Drop existing policies on orders
DROP POLICY IF EXISTS "Public can read all orders" ON orders;
DROP POLICY IF EXISTS "Service role can manage orders" ON orders;

-- Create new RLS policies for orders with tenant isolation
CREATE POLICY "Users can read own tenant orders"
  ON orders
  FOR SELECT
  TO authenticated
  USING (tenant_id = (auth.jwt() -> 'user_metadata' ->> 'tenant_id')::uuid);

CREATE POLICY "Users can insert own tenant orders"
  ON orders
  FOR INSERT
  TO authenticated
  WITH CHECK (tenant_id = (auth.jwt() -> 'user_metadata' ->> 'tenant_id')::uuid);

CREATE POLICY "Users can update own tenant orders"
  ON orders
  FOR UPDATE
  TO authenticated
  USING (tenant_id = (auth.jwt() -> 'user_metadata' ->> 'tenant_id')::uuid)
  WITH CHECK (tenant_id = (auth.jwt() -> 'user_metadata' ->> 'tenant_id')::uuid);

CREATE POLICY "Public can create orders"
  ON orders
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Update RLS policies for order_items to check via orders
DROP POLICY IF EXISTS "Public can read all order_items" ON order_items;
DROP POLICY IF EXISTS "Service role can manage order_items" ON order_items;

CREATE POLICY "Users can read own tenant order items"
  ON order_items
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM orders
      WHERE orders.id = order_items.order_id
      AND orders.tenant_id = (auth.jwt() -> 'user_metadata' ->> 'tenant_id')::uuid
    )
  );

CREATE POLICY "Users can insert own tenant order items"
  ON order_items
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM orders
      WHERE orders.id = order_items.order_id
      AND orders.tenant_id = (auth.jwt() -> 'user_metadata' ->> 'tenant_id')::uuid
    )
  );

CREATE POLICY "Public can create order items"
  ON order_items
  FOR INSERT
  TO anon
  WITH CHECK (true);