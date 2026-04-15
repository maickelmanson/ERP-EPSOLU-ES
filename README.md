# EPSOLUÇÕES ERP - Sistema de Gestão de Ordens de Serviço

Sistema ERP online e offline para assistência técnica e locação de impressoras, desenvolvido com React 19, Tailwind CSS 4, Express 4 e tRPC 11.

## 🚀 Características

- **Dashboard Responsivo**: Interface moderna para Desktop e Android
- **Gestão de Ordens de Serviço**: Criar, editar e acompanhar ordens com histórico de alterações
- **Gestão de Clientes**: Cadastro de clientes PF e PJ
- **Gestão de Equipamentos**: Registro de equipamentos com dados técnicos
- **Autenticação OAuth**: Integração com Manus OAuth
- **Banco de Dados**: MySQL com Drizzle ORM
- **tRPC**: Type-safe API procedures
- **Testes**: Vitest com cobertura de funcionalidades principais

## 📋 Estrutura do Projeto

```
client/                 # Frontend React
  src/
    pages/             # Páginas da aplicação
    components/        # Componentes reutilizáveis
    lib/               # Utilitários (tRPC client)
    contexts/          # Contextos React
    hooks/             # Custom hooks

server/                # Backend Express
  routers.ts           # Procedures tRPC
  db.ts                # Query helpers
  _core/               # Framework (OAuth, context, etc)

drizzle/               # Schema e migrações
  schema.ts            # Definição de tabelas
  migrations/          # Arquivos SQL

shared/                # Código compartilhado
```

## 🛠️ Desenvolvimento

### Instalação

```bash
pnpm install
```

### Iniciar servidor de desenvolvimento

```bash
pnpm dev
```

O servidor estará disponível em `http://localhost:3000`

### Executar testes

```bash
pnpm test
```

### Build para produção

```bash
pnpm build
pnpm start
```

## 📊 Banco de Dados

### Tabelas

- **users**: Usuários do sistema
- **clients**: Clientes (PF/PJ)
- **equipment**: Equipamentos
- **serviceOrders**: Ordens de serviço
- **statusHistory**: Histórico de mudanças de status
- **deletionLogs**: Log de exclusões
- **settings**: Configurações do sistema

### Migrações

As migrações são gerenciadas com Drizzle Kit:

```bash
pnpm drizzle-kit generate
```

## 🔄 Sincronismo com GitHub

Para sincronizar o código com o repositório GitHub:

```bash
./sync-github.sh "Mensagem do commit"
```

Ou manualmente:

```bash
git add -A
git commit -m "Sua mensagem"
git push github main
```

**Repositório GitHub**: https://github.com/maickelmanson/ERP-EPSOLU-ES

## 🔐 Autenticação

O sistema usa Manus OAuth para autenticação. As credenciais são gerenciadas automaticamente:

- `VITE_APP_ID`: ID da aplicação
- `OAUTH_SERVER_URL`: URL do servidor OAuth
- `JWT_SECRET`: Secret para cookies de sessão

## 📱 Responsividade

O sistema é totalmente responsivo e funciona em:

- ✅ Desktop (1920x1080+)
- ✅ Tablet (768x1024)
- ✅ Mobile/Android (360x640+)

## 🧪 Testes

Testes unitários com Vitest:

```bash
pnpm test
```

Testes incluem:

- ✅ Procedures tRPC (Service Orders, Clients, Equipment)
- ✅ Dashboard stats
- ✅ Autenticação (logout)
- ✅ Filtros de status

## 🚀 Deploy

O sistema está pronto para deploy na plataforma Manus com suporte a:

- Banco de dados MySQL
- Autenticação OAuth
- Variáveis de ambiente seguras
- Domínio customizado

## 📝 TODO

Veja [todo.md](./todo.md) para a lista completa de funcionalidades planejadas e em progresso.

## 👤 Autor

Desenvolvido por **EPSOLUÇÕES EM IMPRESSORAS**

## 📄 Licença

MIT

---

**Última atualização**: 2026-04-15
**Versão**: 1.0.0
