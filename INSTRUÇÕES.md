# Instruções Completas - CatalogHub

## 🚀 Início Rápido

### Passo 1: Preparar Supabase
1. Acesse [supabase.com](https://supabase.com) e crie uma conta
2. Crie um novo projeto
3. Aguarde 2-3 minutos até ficar pronto
4. Vá em Settings → API e copie:
   - Project URL
   - anon key (pública)

### Passo 2: Configurar Variáveis
Crie arquivo `.env` na raiz do projeto:
```
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua_chave_aqui
```

### Passo 3: Criar Bucket de Imagens
1. No Supabase, vá para Storage
2. Clique "Create new bucket"
3. Nome: `product-images`
4. **Desmarque** "Private bucket"
5. Clique "Create bucket"
6. Abra o bucket, vá em "Policies"
7. Clique "New Policy" → "Create from template"
8. Selecione "Allow public read access"
9. Clique "Review" → "Save policy"

### Passo 4: Criar Usuário Admin
1. No Supabase, vá para Authentication → Users
2. Clique "Invite"
3. Email: `admin@example.com` (ou escolha outro)
4. Clique "Send invite"
5. Copie o link de confirmação
6. Abra em aba incógnita
7. Defina a senha (ex: `password123`)

### Passo 5: Instalar e Rodar
```bash
npm install
npm run dev
```

Pronto! Acesse `http://localhost:5173`

## 📝 Como Usar

### Área Cliente (Loja)
1. Acesse `http://localhost:5173`
2. Veja os produtos disponíveis
3. Clique "Adicionar" para colocar no carrinho
4. Clique no ícone do carrinho (canto superior direito)
5. Revise os itens e clique "Finalizar Compra"
6. Preencha:
   - Nome completo
   - WhatsApp (com DD: 11999999999)
   - Endereço
7. Clique "Confirmar Pedido"
8. Será aberto WhatsApp automaticamente com o resumo!

### Painel Admin (Gerenciar)
1. Acesse `http://localhost:5173/admin`
2. Faça login com:
   - Email: `admin@example.com`
   - Senha: `password123`
3. Você verá duas abas: **Produtos** e **Pedidos**

#### Gerenciar Produtos
- **Novo Produto:** Clique no botão "Novo Produto"
  - Nome: Ex: "Smartphone XYZ"
  - Descrição: Ex: "Tela AMOLED 6.7 polegadas"
  - Preço: Em reais (ex: 1999.99)
  - Estoque: Quantidade disponível (ex: 10)
  - Imagem: Faça upload de uma foto
  - Clique "Salvar"

- **Editar:** Clique no ícone de edição (lápis)
  - Altere o que precisar
  - Clique "Salvar"

- **Deletar:** Clique no ícone de lixo (🗑️)
  - Confirme quando perguntado

#### Visualizar Pedidos
- Clique na aba "Pedidos"
- Veja todos os pedidos feitos
- Clique em um pedido para expandir e ver:
  - Nome do cliente
  - Telefone para contato (clicável para WhatsApp)
  - Endereço de entrega
  - Produtos e quantidades
  - Opção para alterar status (Pendente → Confirmado → Entregue)

## 🎯 Fluxo Completo de Teste

### Teste 1: Adicionar Produtos
1. Faça login no admin
2. Crie 3 produtos diferentes
3. Use imagens da web (URLs diretas) ou faça upload

### Teste 2: Fazer Compra
1. Saia do admin (botão "Sair" no canto superior)
2. Volte para a loja (`/`)
3. Adicione 2-3 produtos ao carrinho
4. Finalize com seus dados
5. Será redirecionado para WhatsApp

### Teste 3: Verificar Pedido
1. Volte ao admin
2. Vá em "Pedidos"
3. Veja o pedido que foi criado
4. Mude o status para "Confirmado"
5. Clique no telefone para enviar WhatsApp

## 🔧 Estructura do Projeto

```
src/
├── components/          # Componentes React
│   ├── admin/          # Componentes do painel
│   ├── Cart.tsx        # Carrinho de compras
│   ├── Header.tsx      # Cabeçalho da página
│   └── ProductCard.tsx # Card do produto
├── contexts/           # Context API
│   ├── AuthContext.tsx # Autenticação
│   └── CartContext.tsx # Estado do carrinho
├── lib/                # Utilitários
│   ├── supabase.ts     # Cliente Supabase
│   ├── types.ts        # Tipos TypeScript
│   └── utils.ts        # Funções auxiliares
├── pages/              # Páginas principais
│   ├── StorePage.tsx   # Página da loja
│   ├── LoginPage.tsx   # Login admin
│   └── AdminDashboard.tsx # Painel admin
├── services/           # Serviços de API
│   ├── orderService.ts # Operações de pedidos
│   └── productService.ts # Operações de produtos
└── App.tsx             # App principal com rotas
```

## 🛠️ Customizações Comuns

### Alterar Nome da Loja
Abra `src/components/Header.tsx` e procure por "CatalogHub", altere para seu nome.

### Alterar Cores
1. Abra `tailwind.config.js`
2. Customize as cores em `theme.colors`
3. Ou altere as classes tailwind nos componentes

### Adicionar Logo
1. Substitua o ícone `<Store>` em `Header.tsx` por uma imagem
2. Coloque a imagem em `src/assets/`

## ⚠️ Problemas Comuns

### "Conexão recusada"
- Verifica se `.env` tem as credenciais corretas
- Reinicia o servidor (`npm run dev`)

### Imagens não aparecem
- Verifica se o bucket `product-images` existe
- Confirma que está público (não privado)
- Verifica as políticas de acesso

### Não consigo fazer login
- Verifica se criou o usuário no Supabase
- Tenta incógnita/modo privado do navegador
- Limpa cache e cookies

### Estoque não atualiza
- Verifica o console (F12) para erros
- Recarrega a página após a compra

## 📱 Testar em Celular

1. Descubra o IP da sua máquina: `ipconfig getifaddr en0` (Mac) ou `ipconfig` (Windows)
2. Na rede local, acesse: `http://seu-ip:5173`
3. Tudo funcionará normalmente, inclusive WhatsApp

## 🚀 Deploy

Quando quiser colocar em produção:

```bash
npm run build
```

Os arquivos estão em `dist/`. Faça upload em:
- Netlify
- Vercel
- GitHub Pages
- Seu servidor web

## 📞 Suporte

Se algo não funcionar:
1. Verifica a aba "Console" do navegador (F12)
2. Procura erros no terminal
3. Recarrega a página
4. Limpa cache (`Ctrl+Shift+Del`)
5. Lê os arquivos SETUP.md e README.md

## ✨ Recursos Inclusos

✅ Catálogo responsivo
✅ Carrinho de compras
✅ Finalização com WhatsApp
✅ Painel administrativo
✅ Gerenciamento de produtos
✅ Controle automático de estoque
✅ Visualização de pedidos
✅ Upload de imagens
✅ Autenticação
✅ Dark mode ready
✅ Animações suaves
✅ Notificações visuais

## 🎓 Aprendendo

Quer aprender a modificar?
- Comece em `App.tsx` para entender as rotas
- Veja `contexts/CartContext.tsx` para estado global
- Estude `services/` para entender API com Supabase

Divirta-se! 🎉
