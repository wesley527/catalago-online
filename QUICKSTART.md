# QuickStart - CatalogHub em 5 Minutos

## ⚡ Início Rápido

### Passo 1: Clonar/Baixar o Projeto
```bash
cd seu-projeto
npm install
```

### Passo 2: Criar .env
```bash
# Crie arquivo .env na raiz com:
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua_chave_aqui
```

### Passo 3: Rodar
```bash
npm run dev
```

Acesse: http://localhost:5173

---

## 🔑 Credenciais Padrão

```
Email: admin@example.com
Senha: password123
```

Login em: http://localhost:5173/admin

---

## 📖 Documentação Completa

| Arquivo | Conteúdo |
|---------|----------|
| **README.md** | Visão geral do projeto |
| **SETUP.md** | Passo-a-passo de setup |
| **SUPABASE_SETUP.md** | Configurar Supabase |
| **INSTRUÇÕES.md** | Como usar a aplicação |
| **PROJETO_COMPLETO.md** | Documentação técnica |

---

## 🎯 Primeiro Acesso

### 1. Acesse a Loja
http://localhost:5173

Você verá:
- Header com logo
- Grid de produtos
- Ícone de carrinho

### 2. Faça Login no Admin
http://localhost:5173/admin

Use as credenciais acima.

### 3. Adicione um Produto
1. Vá em "Produtos"
2. Clique "Novo Produto"
3. Preencha os dados
4. Clique "Salvar"

### 4. Faça uma Compra
1. Volte para a loja (`/`)
2. Clique "Adicionar" em um produto
3. Abra o carrinho
4. Clique "Finalizar Compra"
5. Preencha formulário
6. Clique "Confirmar"

---

## 🔧 Arquivos Principais

```
src/
├── App.tsx              ← Rotas da aplicação
├── pages/
│   ├── StorePage.tsx    ← Página loja
│   ├── LoginPage.tsx    ← Login admin
│   └── AdminDashboard.tsx ← Painel admin
├── components/
│   ├── Header.tsx       ← Cabeçalho
│   ├── Cart.tsx         ← Carrinho
│   ├── ProductCard.tsx  ← Card produto
│   └── admin/           ← Componentes admin
├── contexts/
│   ├── CartContext.tsx  ← Estado carrinho
│   └── AuthContext.tsx  ← Estado auth
└── services/
    ├── productService.ts ← API produtos
    └── orderService.ts   ← API pedidos
```

---

## 🚀 Comandos Úteis

```bash
# Desenvolvimento
npm run dev

# Build produção
npm run build

# Preview build
npm run preview

# Verificar tipos
npm run typecheck

# Lint
npm run lint
```

---

## 📱 URLs Importantes

| URL | Descrição |
|-----|-----------|
| `http://localhost:5173/` | Loja (cliente) |
| `http://localhost:5173/admin` | Login admin |
| `http://localhost:5173/admin/dashboard` | Painel admin |

---

## ⚠️ Problemas Comuns

### "Não consigo fazer login"
- Verifica `.env` com credenciais corretas
- Usa aba incógnita
- Limpa cookies

### "Erro ao adicionar produto"
- Verifica se storage bucket `product-images` existe
- Confirma que está público

### "Imagens não carregam"
- Verifica URL do bucket no Supabase
- Confirma políticas de acesso público

---

## 📚 Recursos

- [Supabase Docs](https://supabase.com/docs)
- [React Docs](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com)

---

## 🎉 Pronto!

Você tem um sistema de e-commerce funcionando!

### Próximo Passo
Leia `INSTRUÇÕES.md` para aprender a usar tudo.

---

**Desenvolvido com React, TypeScript e Supabase** ❤️
