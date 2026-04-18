# 🚀 GUIA DE CONFIGURAÇÃO DO SUPABASE

## 📋 Pré-requisitos

- ✅ Conta no Supabase (https://supabase.com)
- ✅ Projeto Supabase criado
- ✅ Arquivo `SUPABASE_SETUP.sql` pronto

## 📝 PASSO A PASSO

### 1️⃣ **Acessar o SQL Editor do Supabase**

1. Acesse: https://app.supabase.com
2. Selecione seu projeto
3. Vá para **SQL Editor** (menu esquerdo)
4. Clique em **+ New Query**

### 2️⃣ **Copiar e Executar o SQL**

1. Abra o arquivo `SUPABASE_SETUP.sql`
2. Copie **TODO** o conteúdo
3. Cole no editor SQL do Supabase
4. Clique em **RUN** ou `Ctrl+Enter`

> ⚠️ **IMPORTANTE:** Execute o script por inteiro. Se houver erro, verifique se não há tabelas duplicadas.

### 3️⃣ **Verificar as Tabelas**

1. Vá para **Table Editor** (menu esquerdo)
2. Você deve ver as tabelas:
   - ✅ tenants
   - ✅ categories
   - ✅ products
   - ✅ neighborhoods
   - ✅ orders
   - ✅ order_items
   - ✅ auth_users

### 4️⃣ **Configurar Variáveis de Ambiente**

Crie um arquivo `.env.local` na raiz do projeto:

```bash
VITE_SUPABASE_URL=https://seu-project.supabase.co
VITE_SUPABASE_ANON_KEY=sua-chave-anonima
```

**Como obter as chaves:**
1. No Supabase, vá para **Settings** → **API**
2. Copie:
   - **Project URL** → `VITE_SUPABASE_URL`
   - **anon public key** → `VITE_SUPABASE_ANON_KEY`

### 5️⃣ **Ativar Autenticação**

1. Vá para **Authentication** → **Providers**
2. Ative **Email/Password**:
   - Clique em Email
   - Ative "Enable Email Provider"
   - Clique em "Save"

### 6️⃣ **Criar Primeiro Admin (Opcional)**

No SQL Editor, execute:

```sql
-- Criar tenant para admin
INSERT INTO public.tenants (name, slug, color, theme)
VALUES ('Minha Loja', 'minha-loja', '#FF6B35', 'light');

-- Criar usuário admin
INSERT INTO public.auth_users (tenant_id, email, full_name, role)
SELECT id, 'admin@seusite.com', 'Administrador', 'admin'
FROM public.tenants WHERE slug = 'minha-loja';
```

### 7️⃣ **Testar Conexão**

No seu projeto React, rode:

```bash
npm run dev
```

Tente:
1. Acessar a página da loja
2. Ver produtos/categorias
3. Fazer um pedido

## 🔒 RLS - Entendendo as Políticas

### O que é RLS?

RLS (Row Level Security) controla quem pode ver/editar quais dados.

### Políticas Implementadas:

| Tabela | Política | O que permite |
|--------|----------|---------------|
| **tenants** | public_read | Qualquer um vê lojas |
| **categories** | public_read | Qualquer um vê categorias ativas |
| **products** | public_read | Qualquer um vê produtos ativos |
| **neighborhoods** | public_read | Qualquer um vê bairros ativos |
| **orders** | tenant_read | Apenas admin da loja vê pedidos |
| **orders** | anyone_create | Qualquer um pode criar pedidos |
| **auth_users** | user_read_own | Usuário vê apenas seus dados |

### Roles Suportadas:

```
- admin: Acesso total à loja
- manager: Pode gerenciar produtos/pedidos
- staff: Acesso limitado
- user: Apenas para clientes
```

## 🚨 Troubleshooting

### Erro: "Relation already exists"

**Solução:** Execute o SQL script novamente. O `IF NOT EXISTS` vai pular as tabelas existentes.

### Erro: "Permission denied"

**Solução:** Verifique se RLS está habilitado:
```sql
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
```

### Pedidos não aparecem

**Solução:** Verifique se o usuário tem a policy correta:
```sql
SELECT * FROM pg_policies WHERE tablename = 'orders';
```

### Não consigo editar produtos

**Solução:** Verifique role do usuário:
```sql
SELECT email, role FROM public.auth_users WHERE email = 'seu@email.com';
```

## 📱 Estrutura do Banco de Dados

```
tenants (Lojas)
├── categories (Categorias)
│   └── products (Produtos)
├── neighborhoods (Bairros)
├── orders (Pedidos)
│   └── order_items (Itens do Pedido)
└── auth_users (Usuários)
```

## 🔄 Relacionamentos

- **tenants** → **categories** (1:N)
- **tenants** → **products** (1:N)
- **tenants** → **neighborhoods** (1:N)
- **tenants** → **orders** (1:N)
- **tenants** → **auth_users** (1:N)
- **categories** → **products** (1:N)
- **neighborhoods** → **orders** (1:N)
- **orders** → **order_items** (1:N)
- **products** → **order_items** (1:N)

## ✅ Checklist Final

- [ ] Executou o SQL script
- [ ] Viu as 7 tabelas criadas
- [ ] Configurou variáveis de ambiente
- [ ] Ativou Email/Password Auth
- [ ] Testou conexão com `npm run dev`
- [ ] Consegue ver produtos na tela
- [ ] Consegue fazer um pedido

## 🎉 Próximas Ações

1. **Adicionar Produtos:**
   - Acesse /admin
   - Vá para "Produtos"
   - Clique em "+ Novo Produto"

2. **Configurar Bairros:**
   - Acesse /admin
   - Vá para "Bairros"
   - Clique em "+ Novo Bairro"

3. **Acompanhar Pedidos:**
   - Acesse /admin
   - Vá para "Pedidos"
   - Veja pedidos dos clientes

## 📞 Suporte

Se encontrar problemas:

1. Verifique os logs do Supabase
2. Consulte a documentação: https://supabase.com/docs
3. Verifique as policies: Settings → Policies

## 📚 Recursos Úteis

- [Supabase Docs](https://supabase.com/docs)
- [PostgreSQL Docs](https://www.postgresql.org/docs/)
- [RLS Explained](https://supabase.com/docs/guides/auth/row-level-security)

---

**Parabéns! Seu Supabase está configurado!** 🎊
