-- FIX RLS para delivery_areas (execute no Supabase SQL Editor)
/*
1. Desabilita RLS temporariamente
2. Cria policy INSERT/UPDATE com tenant_id fixo (substitua SEU_TENANT_ID)
3. Reabilita RLS
*/

-- 1. Desabilita RLS
ALTER TABLE delivery_areas DISABLE ROW LEVEL SECURITY;

-- 2. Drop policy antiga se existir
DROP POLICY IF EXISTS tenant_delivery_areas ON delivery_areas;

-- 3. Nova policy para ALL (test)
CREATE POLICY tenant_delivery_areas_all ON delivery_areas 
  FOR ALL TO authenticated 
  USING (true) WITH CHECK (true);

-- 4. Reabilita RLS
ALTER TABLE delivery_areas ENABLE ROW LEVEL SECURITY;

-- Test INSERT direto
INSERT INTO delivery_areas (tenant_id, name, delivery_fee) 
VALUES (
  'SEU_TENANT_ID_AQUI',  -- pegue de tenants table
  'Centro',
  5.00
);

-- Verifique
SELECT * FROM delivery_areas;

