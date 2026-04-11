-- Execute no SQL Editor do Supabase APÓS o schema existir (migrações aplicadas).
-- Cria a primeira loja e as configurações padrão. Ajuste nome e slug abaixo.

-- Troque estes valores:
--   'Minha Loja'  -> nome exibido
--   'minha-loja'  -> slug único (URL / subdomínio / VITE_DEFAULT_TENANT_SLUG)

WITH t AS (
  INSERT INTO tenants (name, slug, plan)
  VALUES ('Minha Loja', 'minha-loja', 'free')
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name
  RETURNING id
)
INSERT INTO tenant_settings (tenant_id, primary_color, secondary_color)
SELECT id, '#2563eb', '#10b981' FROM t
ON CONFLICT (tenant_id) DO NOTHING;

-- Confira no Table Editor: tabela tenants deve ter uma linha com slug = 'minha-loja'.
