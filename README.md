# Catálogo Online

Uma plataforma de e-commerce SaaS completa com suporte para múltiplas lojas, gerenciamento de produtos, pedidos e entrega.

## 🚀 Recursos

- ✅ Autenticação de usuários
- ✅ Gerenciamento multi-tenant
- ✅ Catálogo de produtos com categorias
- ✅ Carrinho de compras
- ✅ Gerenciamento de pedidos
- ✅ Áreas de entrega configuráveis
- ✅ Tema claro/escuro
- ✅ Painel administrativo
- ✅ Interface responsiva

## 📋 Pré-requisitos

- Node.js 16+ 
- npm ou yarn
- Conta Supabase

## 🔧 Instalação

1. Clone o repositório:
```bash
git clone <seu-repositorio>
cd catalago-online
```

2. Instale as dependências:
```bash
npm install
```

3. Configure as variáveis de ambiente:
```bash
cp .env.example .env.local
```

4. Edite `.env.local` com suas credenciais do Supabase:
```
VITE_SUPABASE_URL=https://seu-project.supabase.co
VITE_SUPABASE_ANON_KEY=sua-chave-anon
```

5. Inicie o servidor de desenvolvimento:
```bash
npm run dev
```

## 📦 Scripts Disponíveis

- `npm run dev` - Inicia o servidor de desenvolvimento
- `npm run build` - Cria build de produção
- `npm run preview` - Visualiza o build de produção localmente
- `npm run lint` - Executa verificação de linting

## 🗄️ Estrutura do Banco de Dados

### Tabelas Principais

- `users` - Usuários do sistema
- `tenants` - Lojas/organizações
- `products` - Produtos
- `categories` - Categorias de produtos
- `orders` - Pedidos
- `delivery_areas` - Áreas de entrega

## 👤 Credenciais de Teste

- Email: `admin@example.com`
- Senha: `admin123`

## 🛠️ Tecnologias Utilizadas

- **React 18** - UI Framework
- **TypeScript** - Tipagem estática
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **React Router** - Roteamento
- **Supabase** - Backend & Database
- **Context API** - State management

## 📝 Estrutura de Pastas

```
src/
├── components/        # Componentes React
├── contexts/         # Context API
├── lib/              # Utilitários e tipos
├── pages/            # Páginas
├── services/         # Serviços API
└── index.css         # Estilos globais
```

## 🔐 Autenticação

A autenticação é realizada via Supabase Auth. Os usuários podem fazer login com email e senha.

## 📱 Features do Admin

- Gerenciar produtos e categorias
- Visualizar e atualizar status de pedidos
- Configurar áreas de entrega
- Personalizações de loja (cores, temas)

## ⚠️ Avisos Importantes

- Configure as variáveis de ambiente antes de rodar o projeto
- Certifique-se de que as tabelas do Supabase estão criadas corretamente
- Use um token de seção seguro em produção

## 📧 Suporte

Para problemas ou dúvidas, abra uma issue no repositório.

## 📄 Licença

Este projeto está sob a licença MIT.
