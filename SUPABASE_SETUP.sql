-- ============================================
-- CATÁLOGO ONLINE - SQL SETUP PARA SUPABASE
-- ============================================
-- Este arquivo contém todas as tabelas, índices e políticas RLS necessárias
-- Execute este SQL no SQL Editor do Supabase

-- ============================================
-- 1. ENABLE EXTENSIONS
-- ============================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgtrgm";

-- ============================================
-- 2. CRIAR TABELAS
-- ============================================

-- Tabela: tenants (lojas)
CREATE TABLE IF NOT EXISTS public.tenants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL UNIQUE,
  logo_url TEXT,
  color VARCHAR(7) DEFAULT '#FF6B35',
  theme VARCHAR(50) DEFAULT 'light',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela: categories (categorias de produtos)
CREATE TABLE IF NOT EXISTS public.categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  icon VARCHAR(50),
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela: products (produtos)
CREATE TABLE IF NOT EXISTS public.products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL CHECK (price >= 0),
  image_url TEXT,
  stock_quantity INTEGER DEFAULT 0 CHECK (stock_quantity >= 0),
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela: neighborhoods (bairros para entrega)
CREATE TABLE IF NOT EXISTS public.neighborhoods (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  zip_codes TEXT[] DEFAULT ARRAY[]::TEXT[],
  delivery_fee DECIMAL(10, 2) NOT NULL CHECK (delivery_fee >= 0),
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela: orders (pedidos)
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  customer_name VARCHAR(255) NOT NULL,
  customer_email VARCHAR(255),
  customer_phone VARCHAR(20),
  customer_address TEXT,
  total_amount DECIMAL(10, 2) NOT NULL,
  delivery_type VARCHAR(50) DEFAULT 'pickup',
  delivery_fee DECIMAL(10, 2) DEFAULT 0,
  neighborhood_id UUID REFERENCES public.neighborhoods(id) ON DELETE SET NULL,
  neighborhood_name VARCHAR(255),
  payment_method VARCHAR(50),
  status VARCHAR(50) DEFAULT 'pending',
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela: order_items (itens do pedido)
CREATE TABLE IF NOT EXISTS public.order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE RESTRICT,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  unit_price DECIMAL(10, 2) NOT NULL CHECK (unit_price >= 0),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela: auth_users (usuários do sistema)
CREATE TABLE IF NOT EXISTS public.auth_users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  email VARCHAR(255) NOT NULL,
  full_name VARCHAR(255),
  role VARCHAR(50) DEFAULT 'staff',
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(tenant_id, email)
);

-- ============================================
-- 3. CRIAR ÍNDICES
-- ============================================

-- Índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_categories_tenant_id ON public.categories(tenant_id);
CREATE INDEX IF NOT EXISTS idx_products_tenant_id ON public.products(tenant_id);
CREATE INDEX IF NOT EXISTS idx_products_category_id ON public.products(category_id);
CREATE INDEX IF NOT EXISTS idx_neighborhoods_tenant_id ON public.neighborhoods(tenant_id);
CREATE INDEX IF NOT EXISTS idx_orders_tenant_id ON public.orders(tenant_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON public.orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON public.order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_product_id ON public.order_items(product_id);
CREATE INDEX IF NOT EXISTS idx_auth_users_tenant_id ON public.auth_users(tenant_id);
CREATE INDEX IF NOT EXISTS idx_auth_users_email ON public.auth_users(email);

-- ============================================
-- 4. POLÍTICAS RLS (ROW LEVEL SECURITY)
-- ============================================

-- ENABLE RLS em todas as tabelas
ALTER TABLE public.tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.neighborhoods ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.auth_users ENABLE ROW LEVEL SECURITY;

-- ============================================
-- TENANTS - Políticas RLS
-- ============================================
-- Permitir leitura pública (para ver disponibilidade da loja)
CREATE POLICY "public_read_tenants" ON public.tenants
  FOR SELECT
  USING (true);

-- Apenas admin pode criar/editar/deletar
CREATE POLICY "admin_all_tenants" ON public.tenants
  FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- ============================================
-- CATEGORIES - Políticas RLS
-- ============================================
-- Permitir leitura pública (categorias visíveis)
CREATE POLICY "public_read_categories" ON public.categories
  FOR SELECT
  USING (active = true);

-- Apenas proprietário da loja pode gerenciar
CREATE POLICY "tenant_manage_categories" ON public.categories
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.auth_users
      WHERE auth_users.tenant_id = categories.tenant_id
        AND auth_users.id = auth.uid()
        AND auth_users.role IN ('admin', 'manager')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.auth_users
      WHERE auth_users.tenant_id = categories.tenant_id
        AND auth_users.id = auth.uid()
        AND auth_users.role IN ('admin', 'manager')
    )
  );

-- ============================================
-- PRODUCTS - Políticas RLS
-- ============================================
-- Permitir leitura pública de produtos ativos
CREATE POLICY "public_read_products" ON public.products
  FOR SELECT
  USING (active = true);

-- Apenas proprietário da loja pode gerenciar
CREATE POLICY "tenant_manage_products" ON public.products
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.auth_users
      WHERE auth_users.tenant_id = products.tenant_id
        AND auth_users.id = auth.uid()
        AND auth_users.role IN ('admin', 'manager')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.auth_users
      WHERE auth_users.tenant_id = products.tenant_id
        AND auth_users.id = auth.uid()
        AND auth_users.role IN ('admin', 'manager')
    )
  );

-- ============================================
-- NEIGHBORHOODS - Políticas RLS
-- ============================================
-- Permitir leitura pública de bairros ativos
CREATE POLICY "public_read_neighborhoods" ON public.neighborhoods
  FOR SELECT
  USING (active = true);

-- Apenas proprietário da loja pode gerenciar
CREATE POLICY "tenant_manage_neighborhoods" ON public.neighborhoods
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.auth_users
      WHERE auth_users.tenant_id = neighborhoods.tenant_id
        AND auth_users.id = auth.uid()
        AND auth_users.role IN ('admin', 'manager')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.auth_users
      WHERE auth_users.tenant_id = neighborhoods.tenant_id
        AND auth_users.id = auth.uid()
        AND auth_users.role IN ('admin', 'manager')
    )
  );

-- ============================================
-- ORDERS - Políticas RLS
-- ============================================
-- Apenas proprietário da loja pode ver seus pedidos
CREATE POLICY "tenant_read_orders" ON public.orders
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.auth_users
      WHERE auth_users.tenant_id = orders.tenant_id
        AND auth_users.id = auth.uid()
    )
  );

-- Permitir criar pedidos (qualquer usuário autenticado)
CREATE POLICY "anyone_create_orders" ON public.orders
  FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

-- Apenas proprietário pode editar/deletar
CREATE POLICY "tenant_manage_orders" ON public.orders
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.auth_users
      WHERE auth_users.tenant_id = orders.tenant_id
        AND auth_users.id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.auth_users
      WHERE auth_users.tenant_id = orders.tenant_id
        AND auth_users.id = auth.uid()
    )
  );

CREATE POLICY "tenant_delete_orders" ON public.orders
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.auth_users
      WHERE auth_users.tenant_id = orders.tenant_id
        AND auth_users.id = auth.uid()
    )
  );

-- ============================================
-- ORDER_ITEMS - Políticas RLS
-- ============================================
-- Apenas proprietário da loja pode ver itens
CREATE POLICY "tenant_read_order_items" ON public.order_items
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.orders
      WHERE orders.id = order_items.order_id
        AND EXISTS (
          SELECT 1 FROM public.auth_users
          WHERE auth_users.tenant_id = orders.tenant_id
            AND auth_users.id = auth.uid()
        )
    )
  );

-- Permitir criar itens de pedido
CREATE POLICY "anyone_create_order_items" ON public.order_items
  FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

-- ============================================
-- AUTH_USERS - Políticas RLS
-- ============================================
-- Usuários podem ver apenas seus próprios dados
CREATE POLICY "user_read_own" ON public.auth_users
  FOR SELECT
  USING (id = auth.uid());

-- Usuários podem atualizar apenas seus próprios dados
CREATE POLICY "user_update_own" ON public.auth_users
  FOR UPDATE
  USING (id = auth.uid())
  WITH CHECK (id = auth.uid());

-- Admin pode gerenciar usuários de sua loja
CREATE POLICY "admin_manage_users" ON public.auth_users
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.auth_users AS au
      WHERE au.tenant_id = auth_users.tenant_id
        AND au.id = auth.uid()
        AND au.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.auth_users AS au
      WHERE au.tenant_id = auth_users.tenant_id
        AND au.id = auth.uid()
        AND au.role = 'admin'
    )
  );

-- ============================================
-- 5. FUNÇÕES E TRIGGERS
-- ============================================

-- Função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Criar triggers para update automático
CREATE TRIGGER update_tenants_updated_at BEFORE UPDATE ON public.tenants
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON public.categories
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON public.products
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_neighborhoods_updated_at BEFORE UPDATE ON public.neighborhoods
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON public.orders
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_auth_users_updated_at BEFORE UPDATE ON public.auth_users
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================
-- 6. DADOS INICIAIS (OPCIONAL)
-- ============================================

-- Inserir tenant padrão
INSERT INTO public.tenants (name, slug, color, theme)
VALUES ('Loja Padrão', 'default-store', '#FF6B35', 'light')
ON CONFLICT (slug) DO NOTHING;

-- Inserir categorias padrão
INSERT INTO public.categories (tenant_id, name, description, icon, active)
SELECT id, 'Pizzas', 'Deliciosas pizzas frescas', '🍕', true
FROM public.tenants WHERE slug = 'default-store'
ON CONFLICT DO NOTHING;

INSERT INTO public.categories (tenant_id, name, description, icon, active)
SELECT id, 'Bebidas', 'Refrigerantes e sucos', '🥤', true
FROM public.tenants WHERE slug = 'default-store'
ON CONFLICT DO NOTHING;

INSERT INTO public.categories (tenant_id, name, description, icon, active)
SELECT id, 'Sobremesas', 'Deliciosos doces', '🍰', true
FROM public.tenants WHERE slug = 'default-store'
ON CONFLICT DO NOTHING;

-- ============================================
-- FIM DO SETUP
-- ============================================
-- Parabéns! Seu banco de dados está configurado!
-- Próximas ações:
-- 1. Execute este script no SQL Editor do Supabase
-- 2. Configure autenticação no Supabase Auth
-- 3. Atualize as variáveis de ambiente no seu projeto React
-- 4. Teste a conexão com o banco de dados
