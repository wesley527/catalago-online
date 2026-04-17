# 📚 Índice de Documentação

Bem-vindo à documentação completa do **Catálogo Online**! Abaixo você encontrará todos os guias, tutoriais e referências para trabalhar com este projeto.

## 🚀 Começar Rápido

| Documento | Descrição |
|-----------|-----------|
| [README.md](README.md) | Visão geral do projeto e recursos principais |
| [SETUP.md](SETUP.md) | Guia passo a passo para configurar o projeto |
| [FIXES.md](FIXES.md) | Checklist de todas as correções realizadas |

## 📖 Guias Detalhados

| Documento | Descrição |
|-----------|-----------|
| [ARCHITECTURE.md](ARCHITECTURE.md) | Diagramas e fluxos da arquitetura |
| [EXAMPLES.md](EXAMPLES.md) | Exemplos práticos de uso dos contextos |
| [TIPS.md](TIPS.md) | Dicas e boas práticas de desenvolvimento |

## 🗂️ Estrutura do Projeto

### Contextos (State Management)

```
src/contexts/
├── AuthContext.tsx          - Gerenciar autenticação de usuários
├── CartContext.tsx          - Gerenciar carrinho de compras
├── TenantContext.tsx        - Gerenciar lojas/organizações
├── ThemeContext.tsx         - Gerenciar tema claro/escuro
└── index.ts                 - Índice de hooks
```

**Como usar:**
```typescript
const { user, login, logout } = useAuth();
const { items, addItem, total } = useCart();
const { tenant, setTenant } = useTenant();
const { theme, toggleTheme } = useTheme();
```

### Componentes

```
src/components/
├── Header.tsx               - Cabeçalho com navegação
├── PrivateRoute.tsx         - Proteção de rotas
├── ProductCard.tsx          - Card individual de produto
├── Cart.tsx                 - Resumo do carrinho
├── CheckoutModal.tsx        - Modal de finalização
├── Toast.tsx                - Notificações
└── admin/                   - Componentes administrativos
```

### Páginas

```
src/pages/
├── LoginPage.tsx            - /login - Autenticação
├── StorePage.tsx            - /store - Catálogo e carrinho
└── AdminDashboard.tsx       - /admin - Painel administrativo
```

### Serviços

```
src/services/
├── productService.ts        - CRUD de produtos
├── categoryService.ts       - CRUD de categorias
├── orderService.ts          - CRUD de pedidos
├── deliveryAreaService.ts   - CRUD de áreas de entrega
└── tenantService.ts         - CRUD de lojas
```

### Biblioteca

```
src/lib/
├── supabase.ts             - Cliente Supabase
├── supabaseAuth.ts         - Funções de autenticação
├── types.ts                - Tipos TypeScript
├── utils.ts                - Funções utilitárias
└── seedData.ts             - Dados de teste
```

## 🔐 Autenticação

**Credenciais de Teste:**
- Email: `admin@example.com`
- Senha: `admin123`

**Fluxo:**
1. Usuário acessa `/login`
2. Insere email e senha
3. `AuthContext.login()` chama `supabaseAuth.signInWithEmail()`
4. Token é armazenado no `localStorage`
5. Usuário é redirecionado para `/store`

## 🛒 Carrinho de Compras

**Fluxo:**
1. Usuário clica "Adicionar ao Carrinho" em um produto
2. `ProductCard` chama `useCart().addItem()`
3. Item é adicionado ao state do `CartContext`
4. Componente `Cart` exibe o resumo
5. Usuário clica "Finalizar Compra"
6. `CheckoutModal` abre para preenchimento de dados
7. Pedido é criado via `orderService.createOrder()`

## 👨‍💼 Painel Administrativo

**Abas Disponíveis:**

| Aba | Funcionalidade |
|-----|----------------|
| Produtos | Adicionar, editar, deletar produtos |
| Categorias | Gerenciar categorias de produtos |
| Pedidos | Ver e atualizar status de pedidos |
| Áreas de Entrega | Configurar zonas e taxas de entrega |
| Configurações | Personalizar cores e tema da loja |

**Acesso:**
- Faça login como `admin@example.com`
- Clique no botão "Admin" no header
- Acesse `/admin`

## 🎨 Temas

**Tema Claro (Padrão)**
- Fundo branco
- Texto escuro
- Cores vibrantes

**Tema Escuro**
- Fundo cinza escuro (#111827)
- Texto claro
- Acessibilidade melhorada

**Como Mudar:**
```typescript
const { toggleTheme, setTheme } = useTheme();

// Toggle entre temas
toggleTheme();

// Definir tema específico
setTheme('dark');
setTheme('light');
```

## 📱 Responsividade

O projeto é **100% responsivo** usando Tailwind CSS:

- **Mobile:** < 640px
- **Tablet:** 640px - 1024px
- **Desktop:** > 1024px

## 🔧 Configuração de Ambiente

**Arquivo `.env.local`:**
```
VITE_SUPABASE_URL=sua-url-aqui
VITE_SUPABASE_ANON_KEY=sua-chave-aqui
```

**Obter credenciais:**
1. Vá em [supabase.com](https://supabase.com)
2. Crie um projeto
3. Vá em Settings → API
4. Copie URL e Anon Key

## 🚀 Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev              # Inicia servidor de dev (localhost:5173)

# Build
npm run build            # Cria versão de produção

# Visualização
npm run preview          # Visualiza build de produção localmente

# Linting
npm run lint             # Verifica código com ESLint
```

## 📊 Banco de Dados

**Tabelas:**
- `users` - Usuários do sistema
- `tenants` - Lojas/organizações
- `products` - Produtos
- `categories` - Categorias
- `orders` - Pedidos
- `delivery_areas` - Áreas de entrega

**Ver dados:**
1. Acesse [supabase.com](https://supabase.com)
2. Vá em Table Editor
3. Selecione a tabela desejada

## 🐛 Troubleshooting

### "Module not found" error
```
Solução: npm install
```

### "Supabase credentials not found"
```
Solução: Crie .env.local com VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY
```

### Login não funciona
```
Solução: Verifique se o usuário foi criado em Supabase → Authentication → Users
```

### Carrinho vazio após reload
```
Causa: Dados do carrinho estão apenas em memória
Solução: Implemente persistência com localStorage (veja TIPS.md)
```

## 📚 Recursos Externos

- [React Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Vite Guide](https://vitejs.dev/guide/)
- [React Router](https://reactrouter.com/docs)

## 🤝 Contribuindo

1. Clone o repositório
2. Crie uma branch para sua feature (`git checkout -b feature/MinhaFeature`)
3. Commit suas mudanças (`git commit -m 'Adiciona MinhaFeature'`)
4. Push para a branch (`git push origin feature/MinhaFeature`)
5. Abra um Pull Request

## 📧 Suporte

Para dúvidas ou problemas:
1. Verifique os guias acima
2. Veja exemplos em [EXAMPLES.md](EXAMPLES.md)
3. Leia dicas em [TIPS.md](TIPS.md)
4. Abra uma issue no repositório

## 📝 Mudanças Recentes

### Versão 1.0.0 (Inicial)
- ✅ Corrigido erro de export no LoginPage
- ✅ Implementado todos os componentes
- ✅ Configurado Context API
- ✅ Integração com Supabase
- ✅ Painel administrativo completo
- ✅ Documentação completa

## 📄 Licença

Este projeto está sob a licença MIT.

---

**Última atualização:** Janeiro 2024  
**Versão:** 1.0.0  
**Status:** ✅ Funcionando 100%

**Próxima Leitura Recomendada:** [SETUP.md](SETUP.md) → [EXAMPLES.md](EXAMPLES.md) → [ARCHITECTURE.md](ARCHITECTURE.md)
