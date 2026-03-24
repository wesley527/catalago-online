# CatalogHub - Sistema de Catálogo Online com Controle de Estoque

Um sistema completo de e-commerce com catálogo de produtos, carrinho de compras, gerenciamento de estoque e integração com WhatsApp.

## Funcionalidades

### Área do Cliente
- ✅ Catálogo de produtos responsivo com cards modernos
- ✅ Carrinho de compras funcional com sidebar
- ✅ Visualização de quantidade em estoque
- ✅ Finalização de pedido com validação
- ✅ Integração automática com WhatsApp (wa.me)
- ✅ Notificações visuais de ações

### Painel Administrativo
- ✅ Autenticação segura
- ✅ Adicionar, editar e deletar produtos
- ✅ Upload de imagens para produtos
- ✅ Controle automático de estoque
- ✅ Visualização de todos os pedidos realizados
- ✅ Alteração de status de pedidos
- ✅ Links diretos para contato com clientes via WhatsApp

## Tecnologias Utilizadas

- **Frontend:** React 18 + TypeScript
- **Styling:** Tailwind CSS
- **Routing:** React Router v6
- **Banco de Dados:** Supabase (PostgreSQL)
- **Autenticação:** Supabase Auth
- **Storage:** Supabase Storage (para imagens)
- **Icons:** Lucide React
- **Build Tool:** Vite

## Instalação e Configuração

### 1. Clonar o Projeto
```bash
git clone <seu-repositorio>
cd project
```

### 2. Instalar Dependências
```bash
npm install
```

### 3. Variáveis de Ambiente
Crie um arquivo `.env` na raiz do projeto com suas credenciais Supabase:

```env
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua-chave-anonima
```

### 4. Executar o Projeto
```bash
npm run dev
```

A aplicação estará disponível em `http://localhost:5173`

## Estrutura do Projeto

```
src/
├── components/
│   ├── admin/
│   │   ├── ProductManagement.tsx
│   │   ├── ProductForm.tsx
│   │   └── OrderManagement.tsx
│   ├── Cart.tsx
│   ├── CheckoutModal.tsx
│   ├── Header.tsx
│   ├── PrivateRoute.tsx
│   ├── ProductCard.tsx
│   └── Toast.tsx
├── contexts/
│   ├── AuthContext.tsx
│   └── CartContext.tsx
├── lib/
│   ├── supabase.ts
│   ├── types.ts
│   └── utils.ts
├── pages/
│   ├── AdminDashboard.tsx
│   ├── LoginPage.tsx
│   └── StorePage.tsx
├── services/
│   ├── orderService.ts
│   └── productService.ts
└── App.tsx
```

## Fluxo de Funcionamento

### Compra pelo Cliente
1. Cliente visualiza catálogo na página inicial
2. Adiciona produtos ao carrinho
3. Abre o carrinho e ajusta quantidades
4. Clica em "Finalizar Compra"
5. Preenche formulário com nome, WhatsApp e endereço
6. Confirma pedido
7. É redirecionado automaticamente para WhatsApp com resumo da compra

### Gerenciamento pelo Admin
1. Admin acessa `/admin` para fazer login
2. Utiliza email e senha
3. No dashboard pode:
   - **Produtos:** Adicionar, editar, deletar e visualizar estoque
   - **Pedidos:** Visualizar todos os pedidos com detalhes do cliente e produtos
   - **Status:** Atualizar status de pedidos (Pendente → Confirmado → Entregue)

## Banco de Dados

### Tabelas

#### `products`
- `id` (UUID, PK)
- `name` (TEXT)
- `description` (TEXT)
- `price` (NUMERIC)
- `stock_quantity` (INTEGER)
- `image_url` (TEXT)
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

#### `orders`
- `id` (UUID, PK)
- `customer_name` (TEXT)
- `customer_phone` (TEXT)
- `customer_address` (TEXT)
- `total_amount` (NUMERIC)
- `status` (TEXT) - pending, confirmed, delivered
- `created_at` (TIMESTAMP)

#### `order_items`
- `id` (UUID, PK)
- `order_id` (UUID, FK)
- `product_id` (UUID, FK)
- `quantity` (INTEGER)
- `unit_price` (NUMERIC)
- `created_at` (TIMESTAMP)

## Credenciais de Teste

Para acessar o painel administrativo, use:

```
Email: admin@example.com
Senha: password123
```

> ⚠️ **Importante:** Altere estas credenciais em produção!

## Como Criar uma Conta de Admin

Para criar uma nova conta de administrador:

1. Acesse o Supabase Dashboard
2. Vá para `Authentication > Users`
3. Clique em "Add user"
4. Insira email e senha
5. A nova conta estará pronta para fazer login

## Customizações Futuras

- [ ] Adicionar categorias de produtos
- [ ] Implementar sistema de busca e filtros
- [ ] Cupons de desconto
- [ ] Carrinho abandonado
- [ ] Sistema de avaliações
- [ ] Email de confirmação de pedido
- [ ] Relatórios de vendas
- [ ] Dashboard com gráficos
- [ ] Múltiplos idiomas

## Segurança

- ✅ Autenticação via Supabase Auth
- ✅ Row Level Security (RLS) habilitado em todas as tabelas
- ✅ Validação de formulários no frontend
- ✅ Proteção de rotas privadas
- ✅ Upload seguro de imagens

## Build para Produção

```bash
npm run build
```

Os arquivos gerados estarão em `dist/`

## Troubleshooting

### Imagens não carregam
Certifique-se que o bucket `product-images` existe no Supabase Storage e possui acesso público.

### Autenticação não funciona
Verifique se as variáveis de ambiente estão corretas e a sessão Supabase está ativa.

### Estoque não atualiza
Verifique se o RLS das tabelas está configurado corretamente.

## Suporte

Para dúvidas ou problemas, consulte a documentação:
- [Supabase Docs](https://supabase.com/docs)
- [React Docs](https://react.dev)
- [React Router Docs](https://reactrouter.com)

## Licença

Este projeto é de código aberto e está disponível sob a licença MIT.
