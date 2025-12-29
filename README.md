# Enterprise SaaS Boilerplate (Next.js 16 + Supabase)

O **SaaS Boilerplate 2025** é uma fundação de alta performance projetada para escalabilidade, segurança e modularidade. Construído com Next.js 16.1.1, Supabase e Tailwind v4, ele segue rigorosamente os conceitos de **Domain-Driven Design (DDD)** e **Multi-tenancy**.

---

## 🏗 Arquitetura & Padrões

O projeto foge do padrão "MVC" e adota uma estrutura baseada em **Bounded Contexts**. Cada funcionalidade principal reside em `src/modules/`.

### Estrutura de Pastas (DDD)
```
src/modules/
├── [module_name]/
│   ├── domain/           # Entidades, Tipos e Regras de Negócio puras (Zero deps de framework)
│   ├── infrastructure/   # Repositórios (Supabase), Adapters e Integrações
│   ├── application/      # Server Actions, Zod Schemas e Use Cases
│   └── ui/               # Componentes React específicos deste módulo
```
**Regra de Ouro:** A UI nunca deve chamar o banco de dados diretamente. Ela chama `Server Actions` (Application) ou lê dados via `Server Components` que consomem `Infrastructure`.

---

## 🏢 Sistema Multi-tenant (Como Funciona)

Diferente de sistemas simples onde tudo é do "usuário", aqui tudo pertence a uma **Organização**.

### 1. Cookies & Contexto
O sistema utiliza um cookie `current_org_id` para persistir a sessão da organização ativa.
- **Proxy Inteligente (`src/proxy.ts`):** Em cada requisição, ele verifica se o cookie existe.
- **Auto-Seleção:** Se o usuário entra no app sem cookie, o Proxy consulta o banco (via RLS), encontra a primeira org disponível e define o cookie automaticamente.
- **Redirecionamento:** Se o usuário não tem nenhuma org, é forçado para `/onboarding`.

### 2. Row Level Security (RLS)
Os dados são segregados no nível do Banco de Dados.
- **Tabelas:** A maioria das tabelas deve ter uma coluna `org_id`.
- **Políticas:** As policies do Supabase garantem que `auth.uid()` só veja dados se for membro da organização em questão.

---

## 🚀 Como Criar um Novo Módulo

Para adicionar uma feature (ex: "Projetos"), siga este fluxo:

1.  **Domain:** Crie `src/modules/projects/domain/project-types.ts`. Defina a interface `Project`.
2.  **Infrastructure:** Crie `project-repository.ts`.
    *   **Importante:** Todas as queries devem filtrar por `org_id`.
    *   Ex: `.from('projects').select('*').eq('org_id', orgId)`
3.  **Application:** Crie `create-project-action.ts`.
    *   Valide o input com Zod.
    *   Pegue o `org_id` do cookie: `(await cookies()).get('current_org_id')?.value`.
    *   Chame o repositório.
4.  **UI:** Crie a página em `src/app/dashboard/projects/page.tsx` e use os componentes.

---

## 🛠 Setup do Projeto

### 1. Variáveis de Ambiente
Renomeie `.env.example` para `.env.local` e configure:

```env
NEXT_PUBLIC_SUPABASE_URL=seu_url_do_supabase
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sua_anon_key
SUPABASE_SECRET_KEY=sua_service_role_key (Apenas para scripts admin, não usado no client)
```

### 2. Banco de Dados
Execute os scripts SQL (disponíveis na documentação ou migrations) para criar:
- `profiles` (com triggers de auth)
- `organizations` e `memberships`
- Storage bucket `avatars`

### 3. Rodando Localmente

```bash
# Instalar dependências
npm install

# Rodar servidor de desenvolvimento (Turbopack)
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000).

---

## 🎨 Design System (Refine Style)

- **Tailwind 4:** Configuração CSS-first em `src/app/globals.css`.
- **Shadcn UI:** Componentes em `src/components/ui`.
- **Estética:** Focada em B2B (Bordas sutis, sombras `shadow-sm`, fontes Inter/System).

---

*Desenvolvido com ❤️ e IA por Antigravity.*
