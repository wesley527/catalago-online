# 🏗️ Arquitetura do Projeto

## 🔄 Fluxo de Dados

```
┌─────────────────────────────────────────────────────────────┐
│                         User Browser                         │
└────────────┬────────────────────────────────────────────┬───┘
             │                                            │
             ▼                                            ▼
    ┌──────────────────┐                    ┌──────────────────┐
    │   React App      │                    │   Local Storage  │
    │   (Componentes)  │                    │   (Cache)        │
    └────────┬─────────┘                    └──────────────────┘
             │
             ▼
    ┌──────────────────────────────────────┐
    │      Context API (State)             │
    │  ├─ AuthContext                      │
    │  ├─ CartContext                      │
    │  ├─ TenantContext                    │
    │  └─ ThemeContext                     │
    └────────┬─────────────────────────────┘
             │
             ▼
    ┌──────────────────────────────────────┐
    │      Services Layer                  │
    │  ├─ productService.ts                │
    │  ├─ categoryService.ts               │
    │  ├─ orderService.ts                  │
    │  ├─ deliveryAreaService.ts           │
    │  └─ tenantService.ts                 │
    └────────┬─────────────────────────────┘
             │
             ▼
    ┌──────────────────────────────────────┐
    │   Supabase Client (@supabase/js)     │
    └────────┬─────────────────────────────┘
             │
             ▼
    ┌──────────────────────────────────────┐
    │    Supabase Backend (PostgreSQL)     │
    │  ├─ Auth (Usuarios)                  │
    │  ├─ Database (Tables)                │
    │  ├─ Real-time (WebSockets)           │
    │  └─ Storage (Arquivos)               │
    └──────────────────────────────────────┘
```

## 🧩 Arquitetura de Componentes

```
App
├── Header
│   ├── Navigation
│   ├── Theme Toggle
│   └── Logout Button
├── Router
│   ├── /login
│   │   └── LoginPage
│   ├── /store
│   │   └── StorePage
│   │       ├── CategoryFilter
│   │       ├── ProductGrid
│   │       │   └── ProductCard (x)
│   │       └── Cart
│   │           ├── CartItem (x)
│   │           └── CheckoutModal
│   └── /admin
│       └── AdminDashboard
│           ├── ProductManagement
│           │   ├── ProductForm
│           │   └── ProductList
│           ├── CategoryManagement
│           ├── OrderManagement
│           ├── DeliveryAreaManagement
│           └── TenantSettings
└── Providers
    ├── ThemeProvider
    ├── AuthProvider
    ├── TenantProvider
    └── CartProvider
```

## 🔐 Fluxo de Autenticação

```
┌──────────────┐
│  Login Page  │
└──────┬───────┘
       │
       ▼
┌──────────────────┐
│ Email + Password │
└──────┬───────────┘
       │
       ▼
┌────────────────────────────┐
│ supabaseAuth.signIn()      │
└──────┬─────────────────────┘
       │
       ▼
┌────────────────────────────┐
│ Supabase Auth Service      │
└──────┬─────────────────────┘
       │
       ▼
┌─────────────────────┐
│ Token + User Data   │
└──────┬──────────────┘
       │
       ▼
┌────────────────────────────┐
│ Store in AuthContext       │
└──────┬─────────────────────┘
       │
       ▼
┌────────────────────────────┐
│ Redirect to /store         │
└────────────────────────────┘
```

## 🛒 Fluxo do Carrinho

```
Product Page
     │
     ▼
[Adicionar ao Carrinho]
     │
     ▼
useCart() → addItem()
     │
     ▼
CartContext.items (atualiza)
     │
     ▼
Re-render componentes subscritos
     │
     ▼
Cart Component exibe itens
     │
     ▼
[Finalizar Compra]
     │
     ▼
CheckoutModal abre
     │
     ▼
Preencher dados
     │
     ▼
createOrder() (API)
     │
     ▼
clearCart()
     │
     ▼
Sucesso!
```

## 📊 Tipos de Dados

```typescript
User {
  id: UUID
  email: string
  role: 'admin' | 'user'
  tenant_id?: UUID
}

Product {
  id: UUID
  tenant_id: UUID
  category_id?: UUID
  name: string
  description?: string
  price: decimal
  image_url?: string
  stock: integer
  active: boolean
  created_at: timestamp
  updated_at: timestamp
}

Order {
  id: UUID
  tenant_id: UUID
  customer_name: string
  customer_email: string
  customer_phone: string
  address: string
  items: OrderItem[]
  total: decimal
  status: 'pending' | 'confirmed' | 'preparing' | 'delivered' | 'cancelled'
  payment_method: 'cash' | 'card' | 'pix'
  created_at: timestamp
  updated_at: timestamp
}

CartItem {
  product_id: string
  name: string
  price: number
  quantity: number
  image_url?: string
}
```

## 🌐 Rotas da Aplicação

```
/                    → Redireciona para /store
/login              → Página de login
/store              → Loja (produtos, categorias, carrinho)
/admin              → Dashboard administrativo
  ├─ /admin/products → Gerenciar produtos
  ├─ /admin/categories → Gerenciar categorias
  ├─ /admin/orders    → Gerenciar pedidos
  ├─ /admin/delivery  → Gerenciar áreas de entrega
  └─ /admin/settings  → Configurações da loja
```

## 📦 Estrutura de Pasta Detalhada

```
catalago-online/
├── src/
│   ├── components/
│   │   ├── admin/
│   │   │   ├── CategoryManagement.tsx
│   │   │   ├── DeliveryAreaManagement.tsx
│   │   │   ├── OrderManagement.tsx
│   │   │   ├── ProductForm.tsx
│   │   │   ├── ProductManagement.tsx
│   │   │   └── TenantSettings.tsx
│   │   ├── Cart.tsx
│   │   ├── CheckoutModal.tsx
│   │   ├── Header.tsx
│   │   ├── PrivateRoute.tsx
│   │   ├── ProductCard.tsx
│   │   └── Toast.tsx
│   ├── contexts/
│   │   ├── AuthContext.tsx
│   │   ├── CartContext.tsx
│   │   ├── TenantContext.tsx
│   │   ├── ThemeContext.tsx
│   │   └── index.ts
│   ├── lib/
│   │   ├── seedData.ts
│   │   ├── supabase.ts
│   │   ├── supabaseAuth.ts
│   │   ├── types.ts
│   │   └── utils.ts
│   ├── pages/
│   │   ├── AdminDashboard.tsx
│   │   ├── LoginPage.tsx
│   │   └── StorePage.tsx
│   ├── services/
│   │   ├── categoryService.ts
│   │   ├── deliveryAreaService.ts
│   │   ├── orderService.ts
│   │   ├── productService.ts
│   │   └── tenantService.ts
│   ├── App.tsx
│   ├── index.css
│   ├── main.tsx
│   └── vite-env.d.ts
├── .env.example
├── .gitignore
├── EXAMPLES.md
├── FIXES.md
├── README.md
├── SETUP.md
├── TIPS.md
├── package.json
├── postcss.config.js
├── tailwind.config.js
├── tsconfig.json
├── tsconfig.node.json
└── vite.config.ts
```

## 🔌 Integrações Externas

```
┌──────────────────────────────────────────┐
│         Aplicação React                  │
├──────────────────────────────────────────┤
│           Supabase                       │
├──────────────────────────────────────────┤
│  ├─ PostgreSQL (Database)                │
│  ├─ Auth (Autenticação)                  │
│  ├─ Realtime (WebSockets)                │
│  └─ Storage (Arquivos)                   │
└──────────────────────────────────────────┘
```

## 🎯 Dependências Principais

- **React 18** - UI Framework
- **React Router 6** - Roteamento
- **TypeScript** - Type Safety
- **Tailwind CSS** - Styling
- **Vite** - Build Tool
- **Supabase JS** - Backend

## 🚀 Ciclo de Deploy

```
Local Development
        ↓
    npm run dev
        ↓
    Testes Manuais
        ↓
    npm run build
        ↓
    Verificar dist/
        ↓
    Git Commit
        ↓
    Push para repositório
        ↓
    CI/CD Pipeline (Vercel/GitHub Actions)
        ↓
    Deploy em Produção
        ↓
    Verificar em production
```

---

**Diagrama atualizado em:** 2024
**Versão:** 1.0.0
