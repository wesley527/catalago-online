# Guia de Setup - CatalogHub

## 1. Pré-requisitos
- Node.js 16+ instalado
- Uma conta Supabase gratuita (supabase.com)
- npm ou yarn

## 2. Criando um Projeto Supabase

### 2.1 Criar Projeto
1. Acesse [supabase.com](https://supabase.com)
2. Faça login ou crie uma conta
3. Clique em "New Project"
4. Preencha os dados:
   - Nome: "CatalogHub" (ou seu nome)
   - Región: Selecione mais próxima
   - Senha: Guarde em segurança
5. Aguarde a criação (2-3 minutos)

### 2.2 Obter Credenciais
1. No dashboard, acesse "Settings > API"
2. Copie:
   - **Project URL** → VITE_SUPABASE_URL
   - **anon key** → VITE_SUPABASE_ANON_KEY
3. Crie arquivo `.env` na raiz do projeto:

```env
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua-chave-anonima
```

## 3. Configurar Storage para Imagens

### 3.1 Criar Bucket
1. No Supabase Dashboard, vá para "Storage"
2. Clique em "Create new bucket"
3. Nome: `product-images`
4. Desmarque "Private bucket" para tornar público
5. Clique em "Create bucket"

### 3.2 Configurar Políticas
1. Clique no bucket `product-images`
2. Acesse a aba "Policies"
3. Clique em "New Policy > Create a policy from template"
4. Selecione "Allow public read access" e clique "Review"
5. Clique "Save policy"

## 4. Criar Conta de Admin

### 4.1 Usando Supabase Dashboard
1. Vá para "Authentication > Users"
2. Clique em "Invite"
3. Insira um email (ex: admin@example.com)
4. Clique em "Send invite"
5. Copie o link da confirmação e abra em uma aba incógnita
6. Defina a senha (ex: password123)

### 4.2 Primeiro Login
1. Acesse `http://localhost:5173/admin`
2. Use email e senha criados
3. Será redirecionado para o dashboard

## 5. Instalar Dependências e Rodar

```bash
# Instalar dependências
npm install

# Iniciar servidor de desenvolvimento
npm run dev
```

A aplicação estará em `http://localhost:5173`

## 6. Adicionar Primeiros Produtos

1. Acesse `http://localhost:5173` (catálogo)
2. Clique no ícone de carrinho no header → "Painel do Administrador"
   ou acesse direto `http://localhost:5173/admin`
3. Faça login
4. Na aba "Produtos", clique em "Novo Produto"
5. Preencha:
   - Nome
   - Descrição
   - Preço (em R$)
   - Quantidade em estoque
   - Upload de imagem (recomendado 400x300px)
6. Clique em "Salvar"

## 7. Testar Compra

1. Volte para a página inicial (`/`)
2. Adicione produtos ao carrinho
3. Clique no carrinho
4. Clique em "Finalizar Compra"
5. Preencha:
   - Nome
   - WhatsApp (com DD + número)
   - Endereço
6. Clique em "Confirmar Pedido"
7. Será redirecionado para WhatsApp automaticamente

## 8. Visualizar Pedidos

1. No painel admin, acesse a aba "Pedidos"
2. Todos os pedidos aparecerão listados
3. Clique para expandir e ver:
   - Informações do cliente
   - Produtos comprados
   - Opções de mudar status
4. Clique no telefone para enviar WhatsApp ao cliente

## Troubleshooting

### Erro: "Supabase credentials not configured"
- Verifique se `.env` está na raiz do projeto
- Confirme que as variáveis têm o prefixo `VITE_`
- Reinicie o servidor de desenvolvimento

### Imagens não aparecem no upload
- Verifique se o bucket `product-images` foi criado
- Confirme que está configurado como público
- Verifique as políticas de acesso

### Login não funciona
- Certifique-se que criou um usuário via Supabase Dashboard
- Verifique se a senha está correta
- Tente incógnita/modo privado do navegador

### Estoque não atualiza após compra
- Verifique o console do navegador (F12) para erros
- Confirme que as políticas RLS estão configuradas
- Recarregue a página do painel

## Variáveis de Ambiente

```env
# URL do seu projeto Supabase (sem trailing slash)
VITE_SUPABASE_URL=https://seu-projeto.supabase.co

# Chave pública (anon key) - segura para frontend
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## Estrutura Criada

```
Banco de Dados:
├── products (Catálogo de produtos)
├── orders (Pedidos realizados)
└── order_items (Itens de cada pedido)

Storage:
└── product-images (Imagens dos produtos)

Auth:
└── Users (Administradores)
```

## Próximos Passos

1. **Testar tudo** - Crie alguns produtos e faça compras de teste
2. **Personalizar** - Altere cores, nomes, fontes no código
3. **Deploy** - Prepare para colocar em produção
4. **Expansão** - Adicione novas funcionalidades conforme necessário

## Recursos Úteis

- [Documentação Supabase](https://supabase.com/docs)
- [React Docs](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [Lucide Icons](https://lucide.dev)

## Suporte Rápido

Problema? Verifique:
1. Console do navegador (F12 > Console)
2. Logs do servidor no terminal
3. Status das tabelas no Supabase Dashboard
4. Configuração das credenciais no `.env`

# Guia de Configuração do Supabase

## 📦 Criando as Tabelas no Supabase

Siga estes passos para criar as tabelas necessárias:

### 1. Acesse o Supabase Dashboard

1. Vá para [supabase.com](https://supabase.com)
2. Faça login ou crie uma conta
3. Crie um novo projeto

### 2. Execute as Queries SQL

Vá em **SQL Editor** e execute os seguintes comandos:

```sql
-- Criar tabela de tenants (lojas)
CREATE TABLE tenants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  logo_url TEXT,
  color TEXT DEFAULT '#FF6B35',
  theme TEXT DEFAULT 'light',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Criar tabela de categorias
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Criar tabela de produtos
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  category_id UUID REFERENCES categories(id),
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  image_url TEXT,
  stock INTEGER DEFAULT 0,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Criar tabela de áreas de entrega
CREATE TABLE delivery_areas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  zip_codes TEXT[] NOT NULL,
  delivery_fee DECIMAL(10, 2) NOT NULL,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Criar tabela de pedidos
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  address TEXT NOT NULL,
  delivery_area_id UUID REFERENCES delivery_areas(id),
  items JSONB NOT NULL,
  total DECIMAL(10, 2) NOT NULL,
  status TEXT DEFAULT 'pending',
  payment_method TEXT DEFAULT 'cash',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Criar índices para melhor performance
CREATE INDEX idx_products_tenant_id ON products(tenant_id);
CREATE INDEX idx_products_category_id ON products(category_id);
CREATE INDEX idx_categories_tenant_id ON categories(tenant_id);
CREATE INDEX idx_delivery_areas_tenant_id ON delivery_areas(tenant_id);
CREATE INDEX idx_orders_tenant_id ON orders(tenant_id);
CREATE INDEX idx_orders_status ON orders(status);
```

### 3. Configurar Autenticação

1. Vá em **Authentication** > **Providers**
2. Habilite **Email**
3. Configure as opções de recuperação de senha se necessário

### 4. Obter Credenciais

1. Vá em **Settings** > **API**
2. Copie:
   - `Project URL` → `VITE_SUPABASE_URL`
   - `anon public` → `VITE_SUPABASE_ANON_KEY`

3. Cole no arquivo `.env.local`

### 5. Inserir Dados de Teste

```sql
-- Inserir tenant de teste
INSERT INTO tenants (name, slug, color, theme)
VALUES ('Loja de Teste', 'loja-teste', '#FF6B35', 'light');

-- Obter ID do tenant (copie o ID gerado)
SELECT id FROM tenants WHERE slug = 'loja-teste';

-- Inserir categorias (substitua TENANT_ID pelo ID obtido acima)
INSERT INTO categories (tenant_id, name, description, active)
VALUES 
  ('TENANT_ID', 'Eletrônicos', 'Produtos eletrônicos', true),
  ('TENANT_ID', 'Roupas', 'Vestuário em geral', true),
  ('TENANT_ID', 'Livros', 'Livros e publicações', true);

-- Inserir produtos
INSERT INTO products (tenant_id, category_id, name, description, price, stock, active)
VALUES 
  ('TENANT_ID', (SELECT id FROM categories WHERE name = 'Eletrônicos' LIMIT 1), 'Smartphone', 'Smartphone moderno', 999.99, 50, true),
  ('TENANT_ID', (SELECT id FROM categories WHERE name = 'Roupas' LIMIT 1), 'Camiseta', 'Camiseta 100% algodão', 49.99, 100, true),
  ('TENANT_ID', (SELECT id FROM categories WHERE name = 'Livros' LIMIT 1), 'JavaScript Moderno', 'Aprenda JavaScript', 89.90, 30, true);

-- Inserir áreas de entrega
INSERT INTO delivery_areas (tenant_id, name, zip_codes, delivery_fee, active)
VALUES 
  ('TENANT_ID', 'Zona Centro', ARRAY['01000-000', '02000-000', '03000-000'], 10.00, true),
  ('TENANT_ID', 'Zona Norte', ARRAY['04000-000', '05000-000'], 15.00, true),
  ('TENANT_ID', 'Zona Sul', ARRAY['06000-000', '07000-000'], 15.00, true);
```

### 6. Criar Usuário de Teste

1. Vá em **Authentication** > **Users**
2. Clique em **Create new user**
3. Email: `admin@example.com`
4. Senha: `admin123`
5. Confirme o email se necessário

## ✅ Pronto!

Agora você pode:
1. Rodar `npm install`
2. Rodar `npm run dev`
3. Acessar `http://localhost:5173`
4. Fazer login com `admin@example.com` / `admin123`

## 🐛 Troubleshooting

**Erro: "Supabase credentials not found"**
- Verifique se `.env.local` existe
- Confirme que as variáveis estão corretas

**Erro: "Relation does not exist"**
- Execute novamente os comandos SQL das tabelas
- Verifique se não há erros nas queries

**Erro de autenticação**
- Verifique se o usuário foi criado corretamente
- Limpe cache do navegador e tente novamente

## 📚 Recursos Úteis

- [Documentação Supabase](https://supabase.com/docs)
- [Documentação React](https://react.dev)
- [Documentação TypeScript](https://www.typescriptlang.org/docs)
