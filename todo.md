# EP Soluções ERP - TODO

## Funcionalidades Principais

### Dashboard e Navegação
- [ ] Layout responsivo (Desktop/Android) com sidebar
- [ ] Menu de navegação com itens: Dashboard, Clientes, Ordens de Serviço, Equipamentos, Busca, Configurações
- [ ] Autenticação e logout
- [ ] Indicador de status offline

### Ordens de Serviço (OS)
- [ ] Listar ordens com abas: Fila Ativa, Aguardando, Aprovadas, Todas
- [ ] Criar nova ordem de serviço
- [ ] Editar ordem de serviço
- [ ] Visualizar detalhes da ordem
- [ ] Transição de status sem duplicidade
- [ ] Histórico de alterações com operador e data/hora
- [ ] Cálculo de prioridades (score 1-6)
- [ ] Ordenação por prioridade em Fila Ativa
- [ ] Destaques visuais (vermelho) para vencimentos

### Clientes
- [x] Listar clientes
- [x] Criar cliente
- [x] Editar cliente (estrutura pronta)
- [ ] Visualizar detalhes do cliente
- [ ] Busca case-insensitive

### Equipamentos
- [x] Listar equipamentos
- [x] Criar equipamento
- [x] Editar equipamento (estrutura pronta)
- [ ] Visualizar detalhes do equipamento

### Funcionalidades Avançadas
- [ ] Geração de PDF com logo EPSOLUÇÕES
- [ ] Integração WhatsApp para notificações
- [ ] Link de rastreamento único para cliente
- [ ] Reorganização de colunas (Cliente/OS, Modelo/Série, Status, etc.)
- [ ] Busca global com normalização

### Segurança e Performance
- [ ] Usar protectedProcedure para mudanças de status
- [ ] Desabilitar botão durante mutação
- [ ] Memoização de mapas de clientes/equipamentos
- [ ] Logging de mudanças de status
- [ ] Índices no banco de dados

### Testes
- [ ] Testes unitários com Vitest
- [ ] Testes de fluxo de status
- [ ] Testes de prioridades
- [ ] Testes de PDF/WhatsApp
- [ ] Testes de integração

### Sincronismo GitHub
- [ ] Configurar sincronismo automático com repositório (EM PROGRESSO)
- [ ] Commits após cada feature importante
- [ ] Documentação atualizada no GitHub

### Publicação Web
- [ ] Deploy na Web para testes
- [ ] Testar em Desktop
- [ ] Testar em Android
- [ ] Validar responsividade

---

## Bugs Encontrados
(Nenhum até o momento)

---

## Notas
- Projeto baseado em layout de referência: https://github.com/maickelmanson/epsolucoes-erp/blob/main/webdev-preview-1772676598.png
- Repositório original: https://github.com/maickelmanson/ERP-EPSOLU-ES
- Créditos disponíveis: 300
- Stack: React 19 + Tailwind 4 + Express 4 + tRPC 11 + MySQL
