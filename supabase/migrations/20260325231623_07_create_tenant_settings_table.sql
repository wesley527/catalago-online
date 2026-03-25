/*
  # Create tenant_settings table

  1. New Tables
    - `tenant_settings`
      - `id` (uuid, primary key)
      - `tenant_id` (uuid, foreign key, unique) - Vínculo com tenant
      - `primary_color` (text) - Cor primária do tema
      - `secondary_color` (text) - Cor secundária
      - `logo_url` (text) - URL do logo
      - `banner_url` (text) - URL do banner
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
  
  2. Security
    - Enable RLS on `tenant_settings` table
    - Add policies for tenant isolation
*/

CREATE TABLE IF NOT EXISTS tenant_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid UNIQUE NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  primary_color text DEFAULT '#2563eb',
  secondary_color text DEFAULT '#10b981',
  logo_url text,
  banner_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_tenant_settings_tenant_id ON tenant_settings(tenant_id);

ALTER TABLE tenant_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own tenant settings"
  ON tenant_settings
  FOR SELECT
  TO authenticated
  USING (tenant_id = (auth.jwt() -> 'user_metadata' ->> 'tenant_id')::uuid);

CREATE POLICY "Users can update own tenant settings"
  ON tenant_settings
  FOR UPDATE
  TO authenticated
  USING (tenant_id = (auth.jwt() -> 'user_metadata' ->> 'tenant_id')::uuid)
  WITH CHECK (tenant_id = (auth.jwt() -> 'user_metadata' ->> 'tenant_id')::uuid);

CREATE POLICY "Public can read all tenant settings"
  ON tenant_settings
  FOR SELECT
  TO anon
  USING (true);