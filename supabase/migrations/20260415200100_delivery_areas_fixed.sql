-- SQL CORRIGIDO - Cole no Supabase Dashboard > SQL Editor e execute:

-- 1. Criar tabela
CREATE TABLE delivery_areas (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id UUID REFERENCES tenants(id
