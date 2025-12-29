---
trigger: always_on
---

# ARCHITECTURE.md - Enterprise SaaS Boilerplate (Dec 2025)

## 1. Vision & Core Principles
Este boilerplate é uma fundação de alta performance para sistemas SaaS, projetada para ser modular, escalável e otimizada para desenvolvimento assistido por IA (Gemini 3 Pro). A arquitetura prioriza o desacoplamento total entre a lógica de negócio e as ferramentas de infraestrutura.

### Core Rules:
- **Separation of Concerns:** A lógica de negócio (Domain) nunca deve depender de frameworks ou ferramentas externas.
- **Single Source of Truth:** Validação centralizada via Zod e tipos TypeScript rigorosos em todas as camadas.
- **Security by Design:** Row Level Security (RLS) obrigatório no Supabase e validação de entrada em todas as Server Actions.
- **AI-Friendly:** Manter arquivos pequenos (máximo 200 linhas) e estrutura modular clara para preservar a janela de contexto da IA.

---

## 2. Technical Stack (Stable & Bleeding Edge)

| Layer               | Technology           | Version      | Status          |
| :------------------ | :------------------- | :----------- | :-------------- |
| **Framework** | Next.js (App Router) | **16.1.1** | Stable/Latest   |
| **UI Library** | React                | **19.2.3** | Stable          |
| **Styling** | Tailwind CSS         | **4.0.0** | Stable (CSS-first) |
| **BaaS / Auth** | Supabase             | Latest       | SDK + @supabase/ssr |
| **UI Kit** | Shadcn/ui + Radix UI | Latest (v2)  | Headless Primitives |
| **State Management**| TanStack Query       | ^5.62.0      | Client Sync     |
| **Validation** | Zod                  | ^3.24.1      | Schema Safety   |

---

## 3. Structural Pattern: Modular DDD
O projeto utiliza **Bounded Contexts** para organizar o código. Cada funcionalidade reside em `src/modules/[module_name]`.

### Internal Layering (Strict Order):
1. **Domain (`/domain`):** Entidades, tipos e regras de negócio puras. **Zero dependências externas.**
2. **Infrastructure (`/infrastructure`):** Implementações técnicas, Repositórios Supabase, Clientes de API (Stripe, Resend).
3. **Application (`/application`):** Server Actions, Orquestração de casos de uso e Schemas Zod.
4. **UI (`/ui`):** Componentes React exclusivos deste contexto de negócio.

### Directory Map:
- `src/app/`: Delivery Layer (Rotas, Layouts e Server Components do Next.js).
- `src/components/ui/`: Shared Kernel (Átomos do Shadcn/Radix - Componentes Genéricos).
- `src/lib/`: Singletons e instâncias de frameworks (Supabase client, shared utils).
- `src/modules/`: Onde reside a inteligência do negócio organizada por domínios.

---

## 4. Coding Laws & AI Constraints

### **Data Handling & Flow:**
- **Read:** Preferencialmente via **Server Components** consumindo a camada de `Infrastructure` diretamente.
- **Write:** Exclusivamente via **Server Actions** localizadas na camada de `Application`.
- **Validation:** Todo input deve ser validado via **Zod Schema** antes de qualquer processamento.
- **Async Pattern (Next.js 16):** Uso obrigatório de `await cookies()`, `await params` e `await searchParams`.

### **Error Handling:**
- Utilizar a classe `AppError` em `src/modules/shared/domain/` para retornos padronizados.
- Proibido retornar erros brutos de banco de dados (Postgres/Supabase) para a UI.

### **CLI & Tooling:**
- **Shadcn CLI:** Use exclusivamente `npx shadcn@latest`.
- **Tailwind 4:** Não gerar `tailwind.config.js`. Configuração via diretiva `@theme` no `src/app/globals.css`.

---

## 5. Visual Identity & UI Standards (Airy Minimalist)
Estética focada em clareza, tipografia arejada e espaços negativos. O código deve ser **agnóstico**.

- **Shadows:** Utilizar a variável `--shadow-elevation` (suave e profunda: `0 6px 16px rgba(0,0,0,0.12)`).
- **Borders:** Arredondamento padrão de `0.75rem` (`rounded-xl`).
- **Nomenclatura Agnóstica:** Usar termos como `brand-primary`, `surface-card`, `text-main`. **Proibido referências a marcas externas no código.**
- **Accessibility:** Todo componente interativo complexo deve ser baseado em primitivas do **Radix UI**.

---

## 6. Security Protocol
- **RLS:** Row Level Security ativo e testado em todas as tabelas do Supabase.
- **Middleware:** Proteção de rotas `/dashboard`, `/app` e `/admin` via `src/middleware.ts`.
- **Environment:** Variáveis sensíveis (Service Role) restritas ao ambiente de servidor (`process.env`).

---

## 7. AI Agent Instructions (Antigravity/Gemini Rules)
1. **Context Check:** Antes de gerar código, valide se a camada de `Domain` já possui a regra de negócio necessária.
2. **Modular Integrity:** Nunca coloque lógica de infraestrutura (SDKs) dentro de componentes de UI.
3. **Type Safety:** Proibido o uso de `any`. Utilize inferência de tipos do Zod para garantir integridade ponta a ponta.
4. **Clean Code:** Siga princípios DRY e KISS. Se uma lógica for repetida em 2 módulos, mova para `src/modules/shared`.

## 8. Specific Library Implementation Rules (MUST FOLLOW)

### Zod v4 Compliance:
- Utilize a nova sintaxe de inferência de tipos e as otimizações de performance da v4.
- **Proibido:** Utilizar métodos depreciados da v3.
- Sempre prefira `z.object().passthrough()` ou `z.strict()` dependendo do contexto do domínio.

### Tailwind 4 + PostCSS:
- **ZERO Config JS:** Não crie ou utilize `tailwind.config.js`. 
- **CSS-First:** Toda a configuração de tema deve ser feita via `@theme` no `src/app/globals.css`.
- **Directives:** Use apenas `@import "tailwindcss";`. Não use as diretivas `@tailwind base/components/utilities`.

### Framer Motion v12:
- Utilize a integração nativa com React 19.
- Use o componente `layout` para animações de layout automáticas e prefira a sintaxe de `variants` para manter o código limpo.

### Next.js 16.1.1:
- **Async Runtime:** Headers, Cookies e Params **SÃO ASSÍNCRONOS**. 
- Sempre use `const cookieStore = await cookies()` e `const { id } = await params`.