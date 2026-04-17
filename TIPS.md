# 💡 Dicas e Boas Práticas

## 🎯 Estrutura do Projeto

### Organização de Pastas
```
src/
├── components/          # Componentes React reutilizáveis
│   ├── admin/          # Componentes administrativos
│   ├── Cart.tsx
│   ├── Header.tsx
│   └── ...
├── contexts/           # Context API para state management
│   ├── AuthContext.tsx
│   ├── CartContext.tsx
│   ├── TenantContext.tsx
│   └── ThemeContext.tsx
├── lib/               # Utilitários e configurações
│   ├── supabase.ts    # Cliente Supabase
│   ├── types.ts       # Tipos TypeScript
│   └── utils.ts       # Funções auxiliares
├── pages/             # Páginas da aplicação
│   ├── LoginPage.tsx
│   ├── StorePage.tsx
│   └── AdminDashboard.tsx
├── services/          # Chamadas de API/Banco de Dados
│   ├── productService.ts
│   ├── categoryService.ts
│   ├── orderService.ts
│   └── ...
├── App.tsx           # Componente raiz
├── main.tsx          # Entry point
└── index.css         # Estilos globais
```

## 🚀 Performance

### 1. Code Splitting
- Use `React.lazy()` para componentes pesados
```typescript
const AdminDashboard = React.lazy(() => import('./pages/AdminDashboard'));
```

### 2. Memoização
- Use `React.memo()` para componentes puros
- Use `useMemo()` para cálculos pesados
- Use `useCallback()` para funções de callback

### 3. Image Optimization
- Use URLs comprimidas do Supabase
- Considere usar lazy loading para imagens

## 🔒 Segurança

### 1. Autenticação
- Sempre valide tokens no backend
- Não armazene senhas no localStorage
- Use HTTPS em produção

### 2. Validação
- Valide inputs do cliente e servidor
- Use schemas (ex: Zod, Yup) para validação

### 3. CORS
- Configure CORS corretamente no Supabase
- Use variáveis de ambiente para URLs

## 🎨 Styling

### Tailwind CSS
```typescript
// BOM
<button className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg">
  Clique aqui
</button>

// NÃO faça assim
<button style={{ backgroundColor: '#FF6B35', color: 'white' }}>
  Clique aqui
</button>
```

### Dark Mode
```typescript
// Use classes do Tailwind
<div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
  Conteúdo
</div>
```

## 📝 Padrões de Código

### Components
```typescript
// BOM - Functional component com tipos
interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  return <div>{product.name}</div>;
}

// NÃO faça assim
export default (props) => {
  return <div>{props.product.name}</div>;
};
```

### Error Handling
```typescript
// BOM - Tratamento explícito
try {
  const data = await fetchData();
  setData(data);
} catch (error) {
  const message = error instanceof Error ? error.message : 'Erro desconhecido';
  setError(message);
}

// NÃO faça assim
try {
  const data = await fetchData();
} catch (e) {
  console.log(e); // Não suficiente
}
```

## 🧪 Testando Localmente

### 1. Teste de Login
```bash
# Use as credenciais padrão
Email: admin@example.com
Senha: admin123
```

### 2. Teste de Produtos
1. Vá para `/store`
2. Adicione produtos ao carrinho
3. Veja o carrinho atualizar

### 3. Teste de Admin
1. Faça login como admin
2. Vá para `/admin`
3. Teste CRUD de produtos

## 🐛 Debugging

### Console do Navegador
```javascript
// Inspecionar contexto
window.__REACT_DEVTOOLS_GLOBAL_HOOK__
```

### React DevTools
- Instale a extensão React DevTools
- Use Profiler para encontrar gargalos

### Supabase Logs
- Vá em Logs → Realtime
- Veja todas as queries executadas

## 📱 Responsividade

### Breakpoints Tailwind
```
sm: 640px
md: 768px
lg: 1024px
xl: 1280px
2xl: 1536px
```

### Exemplo
```typescript
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {/* 1 coluna em mobile, 2 em tablet, 3 em desktop */}
</div>
```

## 🔄 Atualizando Dependências

```bash
# Ver versões desatualizadas
npm outdated

# Atualizar uma dependência
npm update package-name

# Atualizar tudo (cuidado!)
npm update
```

## 🚢 Deploy

### Para Vercel
1. Conecte seu GitHub
2. Selecione o repositório
3. Defina variáveis de ambiente
4. Deploy automático

### Para GitHub Pages
```bash
npm run build
# Envie a pasta 'dist' para GitHub Pages
```

## 📚 Recursos Úteis

- [React Docs](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Supabase Docs](https://supabase.com/docs)
- [Vite Guide](https://vitejs.dev/guide)

## 🎓 Próximos Passos

1. **Integração de Pagamento**
   - Stripe
   - PayPal
   - MercadoPago

2. **Notificações**
   - Email com Nodemailer
   - SMS com Twilio
   - Push notifications

3. **Analytics**
   - Google Analytics
   - Mixpanel
   - Sentry para erros

4. **SEO**
   - Meta tags dinâmicas
   - Sitemap
   - Open Graph

5. **Performance**
   - Caching estratégico
   - CDN para imagens
   - Service Workers

## ✅ Checklist de Lançamento

- [ ] Todas as páginas testadas
- [ ] Responsividade verificada
- [ ] Variáveis de ambiente configuradas
- [ ] SSL/HTTPS habilitado
- [ ] Logs configurados
- [ ] Backup do banco de dados
- [ ] Documentação atualizada
- [ ] Performance otimizada
- [ ] Segurança validada
- [ ] Termos de Serviço definidos

---

**Boa sorte com seu projeto! 🚀**
