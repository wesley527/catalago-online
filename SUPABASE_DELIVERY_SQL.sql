-- 🔥 SQL COMPLETO PARA DELIVERY_AREAS - Cole TODO no Supabase > SQL Editor > Execute

-- 1. Criar tabela
CREATE TABLE IF NOT EXISTS delivery_areas (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id UUID NOT NULL REFERENCES public.tenants(id
