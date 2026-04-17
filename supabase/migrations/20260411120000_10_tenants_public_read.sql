/*
  # Leitura pública de tenants (vitrine / subdomínio)

  A vitrine usa getTenantBySlug e getTenantById com cliente anon ou sem JWT
  alinhado ao tenant. A política anterior só permitia SELECT para authenticated
  quando id = user_metadata.tenant_id, o que bloqueava a loja pública (403).

  Esta política permite SELECT em tenants para qualquer um, espelhando o padrão
  de "Public can read all products" / categories.
*/

DROP POLICY IF EXISTS "Public can read tenants" ON tenants;

CREATE POLICY "Public can read tenants"
  ON tenants
  FOR SELECT
  USING (true);
