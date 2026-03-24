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
