/*
  # Create tenants table

  1. New Tables
    - `tenants`
      - `id` (uuid, primary key)
      - `name` (text) - Nome da empresa/cliente
      - `slug` (text, unique) - Identificador único para subdomínio
      - `plan` (text) - Tipo de plano (free, basic, premium)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
  
  2. Security
    - Enable RLS on `tenants` table
    - Add policy for authenticated users to read their own tenant data
*/

CREATE TABLE IF NOT EXISTS tenants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  plan text NOT NULL DEFAULT 'free',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE tenants ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own tenant"
  ON tenants
  FOR SELECT
  TO authenticated
  USING (id = (auth.jwt() -> 'user_metadata' ->> 'tenant_id')::uuid);

CREATE POLICY "Service role can manage all tenants"
  ON tenants
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);