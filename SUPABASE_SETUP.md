# Setup Supabase - CatalogHub

Guia passo-a-passo para configurar o Supabase para o CatalogHub.

## 1. Criar Projeto Supabase

### 1.1 Acesse Supabase
- Vá para [https://supabase.com](https://supabase.com)
- Clique em "Sign In" (ou crie uma conta)
- Clique em "New Project"

### 1.2 Preencha os Dados
- **Project name**: CatalogHub (ou seu nome)
- **Database password**: Defina uma senha forte (ex: P@ssw0rd123!)
- **Region**: Escolha a mais próxima de você
- Clique em "Create new project"

### 1.3 Aguarde a Inicialização
Isso leva cerca de 2-3 minutos. Você verá uma barra de progresso.

## 2. Obter Credenciais da API

### 2.1 Acesse as Configurações
1. No dashboard, clique em **Settings** (ícone de engrenagem)
2. Vá para **API** no menu da esquerda
3. Você verá as credenciais:
   - **Project URL** - Copie
   - **anon key** - Copie (a chave pública)

### 2.2 Criar Arquivo .env
Na raiz do seu projeto, crie um arquivo `.env`:

```env
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

Substitua pelos valores copiados acima.

## 3. Verificar Tabelas do Banco de Dados

### 3.1 Acessar SQL Editor
1. No Supabase, vá para **SQL Editor** (ícone SQL)
2. Você deve ver três tabelas criadas automaticamente:
   - `products`
   - `orders`
   - `order_items`

Se não estiverem lá, consulte a seção de troubleshooting.

### 3.2 Verificar Políticas RLS
1. Vá para **Authentication** → **Policies**
2. Você deve ver políticas para cada tabela
3. Confirme que estão habilitadas (verde)

## 4. Configurar Storage para Imagens

### 4.1 Criar Bucket
1. No Supabase, vá para **Storage** (ícone pasta)
2. Clique em **Create a new bucket**
3. **Bucket name**: `product-images`
4. **Uncheck** "Private bucket" (deixe público)
5. Clique em **Create bucket**

### 4.2 Configurar Políticas de Acesso
1. Clique no bucket `product-images`
2. Vá para a aba **Policies**
3. Clique em **New Policy**
4. Selecione **Get started quickly** → **Create a policy from a template**
5. Escolha **Allow public read access**
6. Clique em **Review**
7. Clique em **Save policy**

Pronto! Agora qualquer pessoa pode visualizar as imagens, mas apenas a aplicação pode fazer upload.

## 5. Criar Usuário Admin

### 5.1 Ir para Authentication
1. No Supabase, vá para **Authentication** (ícone chave)
2. Clique em **Users**
3. Clique no botão **Invite**

### 5.2 Criar Novo Usuário
1. **Email**: Digite um email (ex: `admin@example.com`)
2. **Password**: deixe em branco (o Supabase enviará link)
3. Clique em **Send invitation**

### 5.3 Confirmar Email
1. Você verá um modal com um link de confirmação
2. Copie o link
3. Abra em uma **nova aba incógnita** (importante!)
4. Você será levado para definir a senha
5. Crie uma senha forte (ex: `SecurePass123!`)
6. Clique em **Update password**

Parabéns! Seu usuário admin foi criado!

## 6. Verificar RLS (Row Level Security)

O RLS garante que os dados estejam seguros. Verificar se está ativado:

### 6.1 Verificar Tabelas
1. Vá para **Database** → **Tables**
2. Clique em cada tabela:
   - `products`
   - `orders`
   - `order_items`
3. Vá para a aba **RLS** (Row Level Security)
4. Confirme que está **ON** (verde)

Se não estiver, a tabela é pública! Isso não é seguro.

## 7. Testar Conexão

### 7.1 Instalar e Rodar
```bash
npm install
npm run dev
```

### 7.2 Acessar a Aplicação
1. Abra [http://localhost:5173](http://localhost:5173)
2. Você deve ver a página da loja

### 7.3 Fazer Login no Admin
1. Clique no ícone do carrinho e depois em "Painel de Admin" (ou vá direto em `/admin`)
2. Email: `admin@example.com`
3. Senha: a que você criou
4. Você deve ver o dashboard

## 8. Troubleshooting

### Erro: "Supabase credentials not configured"
**Solução:**
- Verifique o arquivo `.env` na **raiz do projeto**
- As credenciais devem ter o prefixo `VITE_`
- Reinicie o servidor (`npm run dev`)
- Limpe o cache do navegador

### Erro: "Storage bucket not found"
**Solução:**
- Vá para **Storage** no Supabase
- Crie o bucket `product-images` (se não existir)
- Certifique-se que é **público** (não private)
- Clique no bucket e vá em **Policies**
- Adicione política "Allow public read access"

### Login não funciona
**Solução:**
1. Verifique se o usuário existe em **Authentication > Users**
2. Tente em **modo incógnita** do navegador
3. Limpe cookies e cache (Ctrl+Shift+Del)
4. Verifique o console do navegador (F12 > Console)

### Tabelas não existem
**Solução:**
1. Vá para **SQL Editor**
2. Copie o SQL das migrações do arquivo de setup
3. Execute cada migration no SQL Editor
4. Verifique se aparecem em **Database > Tables**

### Imagens não aparecem
**Solução:**
1. Vá para **Storage > product-images**
2. Vá para **Policies**
3. Adicione "Allow public read access" se não existir
4. Confirme que a imagem foi uploaded corretamente

## 9. Variáveis de Ambiente (Segurança)

### ⚠️ Importante
- Nunca compartilhe sua **chave secreta** (service_role_key)
- A **anon key** é pública, está tudo bem compartilhar
- Nunca faça commit do `.env` no Git
- Use `.gitignore` para ignorar o arquivo

### .gitignore
```
.env
.env.local
.env.*.local
dist/
node_modules/
```

## 10. Próximos Passos

1. **Adicionar produtos** - Faça login no admin e crie alguns
2. **Testar compra** - Adicione produtos ao carrinho e finalize
3. **Verificar pedidos** - Veja os pedidos na aba "Pedidos"
4. **Customizar** - Altere cores, nomes, etc.

## Documentação Útil

- [Supabase Docs](https://supabase.com/docs)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
- [Storage](https://supabase.com/docs/guides/storage)
- [Authentication](https://supabase.com/docs/guides/auth)

## Suporte Rápido

Problema? Verifique:
1. Console do navegador (F12 > Console tab)
2. SQL Editor para ver dados das tabelas
3. Authentication > Users para confirmar usuário
4. Storage para confirmar bucket e políticas
5. Arquivo `.env` para credenciais

Tudo ok? Você está pronto para começar! 🚀
