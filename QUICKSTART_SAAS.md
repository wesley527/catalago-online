# Início Rápido - SaaS Multi-Tenant

## Em 5 Minutos

### 1. Configurar Supabase

As migrations já foram aplicadas automaticamente. Verifique:

```
supabase/migrations/
├── 04_create_tenants_table.sql ✅
├── 05_create_categories_table.sql ✅
├── 06_create_subscriptions_table.sql ✅
├── 07_create_tenant_settings_table.sql ✅
└── 08_alter_existing_tables_add_tenant_id.sql ✅
```

### 2. Criar Primeiro Tenant (Via SQL)

No Supabase SQL Editor:

```sql
-- Criar tenant
INSERT INTO tenants (name, slug, plan)
VALUES ('Minha Loja', 'minhaloja', 'free')
RETURNING id;

-- Copie o ID retornado e use abaixo
-- Criar settings padrão
INSERT INTO tenant_settings (tenant_id)
VALUES ('cole-o-id-aqui');

-- Criar usuário admin e vincular ao tenant
-- No Supabase Dashboard:
-- 1. Authentication → Users → Create user
-- 2. Email: admin@minhaloja.com
-- 3. Password: sua-senha
-- 4. Edite o user → Raw User Meta Data → Adicione:
{
  "tenant_id": "cole-o-id-aqui"
}
```

### 3. Testar

```bash
npm run dev
```

**Loja**: http://localhost:5173
**Admin**: http://localhost:5173/admin (login com credenciais criadas)

---

## Usar o Sistema

### Como Cliente (Loja)

1. Acesse a loja
2. Veja produtos filtrados por tenant
3. Use os botões de categoria para filtrar
4. Adicione ao carrinho
5. Finalize compra com WhatsApp

### Como Admin

1. Faça login em `/admin`
2. **Produtos** - Adicione/edite produtos e vincule a categorias
3. **Categorias** - Crie categorias para organizar
4. **Pedidos** - Visualize e gerencie pedidos
5. **Configurações** - Customize cores, logo e banner

---

## Criar Mais Tenants

### Via Código (Recomendado)

```typescript
import { tenantService } from './services/tenantService';

const tenant = await tenantService.createTenant(
  'Loja ABC',
  'abc',
  'basic'
);

console.log(tenant.id); // Use este ID
```

### Via Signup (Automático)

```typescript
// No AuthContext já está implementado
const { signup } = useAuth();

await signup(
  'admin@lojaabc.com',
  'senha123',
  'Loja ABC',
  'abc'
);
// ✅ Cria tenant + usuário + settings automaticamente
```

---

## Testar Multi-Tenancy

### Teste 1: Isolamento de Dados

```sql
-- Criar 2 tenants
INSERT INTO tenants (name, slug, plan) VALUES
  ('Loja A', 'loja-a', 'free'),
  ('Loja B', 'loja-b', 'free');

-- Criar produtos em cada um
INSERT INTO products (name, price, stock_quantity, tenant_id)
VALUES ('Produto A', 100, 10, 'id-loja-a');

INSERT INTO products (name, price, stock_quantity, tenant_id)
VALUES ('Produto B', 200, 20, 'id-loja-b');

-- Criar 2 usuários, cada um vinculado a um tenant diferente
-- Fazer login com cada um
-- ✅ Cada um só verá seus próprios produtos
```

### Teste 2: Customização

1. Faça login como admin
2. Vá em "Configurações"
3. Mude as cores
4. Faça upload de logo
5. Volte para a loja
6. ✅ Veja o tema aplicado

### Teste 3: Categorias

1. Admin → "Categorias"
2. Crie: "Eletrônicos", "Roupas", "Alimentos"
3. Admin → "Produtos" → Edite produtos
4. Vincule cada produto a uma categoria
5. Volte para loja
6. ✅ Use os filtros de categoria

---

## Subdomínios (Produção)

### Setup DNS

```
Tipo: A
Host: *
Valor: seu-servidor-ip
TTL: 3600
```

### Testar Localmente

Edite `/etc/hosts` (Mac/Linux) ou `C:\Windows\System32\drivers\etc\hosts` (Windows):

```
127.0.0.1  loja-a.localhost
127.0.0.1  loja-b.localhost
```

Acesse: `http://loja-a.localhost:5173`

---

## Limites de Planos

Implementado em `tenantService.checkPlanLimits()`:

```typescript
const { canAddProducts, productLimit, currentProducts } =
  await tenantService.checkPlanLimits(tenantId);

if (!canAddProducts) {
  alert(`Limite atingido! (${currentProducts}/${productLimit})`);
}
```

Limites atuais:
- **free**: 10 produtos
- **basic**: 50 produtos
- **premium**: ilimitado

---

## Checklist Pós-Setup

- [ ] Criar tenant(s)
- [ ] Criar usuário(s) admin
- [ ] Vincular `tenant_id` ao user metadata
- [ ] Testar login
- [ ] Adicionar categorias
- [ ] Adicionar produtos
- [ ] Testar compra
- [ ] Customizar cores/logo
- [ ] Testar isolamento (2+ tenants)

---

## Comandos Úteis

```bash
# Desenvolvimento
npm run dev

# Build
npm run build

# Type check
npm run typecheck
```

---

## Troubleshooting Rápido

| Problema | Solução |
|----------|---------|
| Tenant não encontrado | Verifique se slug existe na tabela `tenants` |
| Produtos vazios | Confirme que produtos têm `tenant_id` correto |
| Erro ao criar | Verifique se `tenant_id` está no user metadata |
| Cores não mudam | Limpe cache do navegador |
| RLS blocking | Confirme policies no Supabase Dashboard |

---

## Próximos Passos

1. ✅ **Deploy**: Netlify, Vercel, etc
2. 📧 **Email**: Notificações de pedidos
3. 💳 **Pagamentos**: Stripe para planos
4. 📊 **Analytics**: Dashboard de métricas
5. 👥 **Múltiplos Admins**: Sistema de permissões

---

**Sistema pronto para começar a escalar!** 🚀
