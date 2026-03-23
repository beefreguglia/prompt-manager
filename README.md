# 🧠 Prompt Manager

> Um gerenciador de prompts, construído para aprender e treinar arquiteturas de software no ecossistema React/Next.

![Interface do Prompt Manager](./public/screenshot.png)

## 📖 Sobre o Projeto

O **Prompt Manager** nasceu para gerenciar prompts de IA no dia a dia. Este projeto foi desenvolvido para aplicar e validar conceitos de engenharia de software, fugindo do acoplamento padrão encontrado em muitas aplicações web.

### 🎯 Objetivos

- **Clean Architecture & DDD:** Separação entre regras de negócio (Core/Domain), casos de uso e detalhes de implementação (Framework/UI).
- **Princípios SOLID:** Garantindo um código extensível, testável e de fácil manutenção.
- **Testes Automatizados:** Cobertura envolvendo testes unitários, de integração e ponta a ponta (E2E).
- **CI/CD:** Pipelines automatizados garantindo a qualidade a cada novo commit.

## 🛠 Tecnologias Utilizadas

**Frontend:**

- [Next.js 16 (App Router)](https://nextjs.org/) - Framework React
- [TypeScript](https://www.typescriptlang.org/) - Tipagem estática
- [Tailwind CSS 4](https://tailwindcss.com/) & Shadcn-ui - Estilização e componentes acessíveis
- [Framer Motion](https://www.framer.com/motion/) - Animações fluidas
- [React Hook Form](https://react-hook-form.com/) & [Zod](https://zod.dev/) - Gerenciamento e validação de formulários
- Nuqs - Gerenciamento de estado na URL

**Backend & Banco de Dados:**

- [Prisma ORM](https://www.prisma.io/) - Mapeamento objeto-relacional
- [PostgreSQL](https://www.postgresql.org/) - Banco de dados relacional

**Qualidade de Código & Tooling:**

- [Biome](https://biomejs.dev/) - Linter e Formatter super-rápido
- [Lefthook](https://github.com/evilmartians/lefthook) - Gerenciador de Git Hooks
- [Faker.js](https://fakerjs.dev/) - Geração de dados (mock/seed)

### 3. Arquitetura e Estrutura do Projeto

Para garantir manutenibilidade e escalabilidade, o projeto foge do acoplamento tradicional do Next.js e adota conceitos de **Clean Architecture** e **DDD (Domain-Driven Design)**. A lógica de negócios é totalmente isolada do framework de UI e do banco de dados.

A estrutura de diretórios foi pensada da seguinte forma:

```text
├── e2e/                    # Testes de End to End (Playwright)
├── prisma/                 # Schema do banco de dados e migrations
├── public/                 # Arquivos estáticos
├── src/
│   ├── app/                # Next.js App Router (Rotas, Layouts e Server Actions)
│   ├── components/         # Componentes reutilizáveis de UI
│   ├── core/               # Coração da aplicação: Casos de Uso e Entidades (Agnóstico a framework)
│   ├── infra/repository/   # Implementações técnicas e persistência (Adapters do Prisma)
│   ├── lib/                # Configurações gerais e utilitários (ex: Prisma Client)
│   └── styles/             # Estilos globais (Tailwind CSS)
└── tests/                  # Testes Unitários e de Integração (Jest)
```

## 🚀 Como Executar o Projeto

### Pré-requisitos

- [Node.js](https://nodejs.org/) (v20 ou superior)
- [PostgreSQL](https://www.postgresql.org/) (docker-compose.yml presente no projeto)

### Passo a Passo

1. **Clone o repositório:**

```bash
    git clone https://github.com/beefreguglia/prompt-manager.git
    cd prompt-manager
```

2. **Instale as dependências:**

```bash
    pnpm install
```

3. **Configure as variáveis de ambiente:**
   Crie um arquivo .env na raiz do projeto baseado no arquivo de exemplo (se houver) ou adicione a sua connection string do banco:

```Fragmento do código
    DATABASE_URL="postgresql://user:password@localhost:5432/prompt_manager?schema=public"
```

4. **Prepare o Banco de Dados (Prisma):**
   Gere o client do Prisma, rode as migrações e popule o banco com dados com o seed:

```Bash
    pnpm run db:generate
    pnpm run db:migrate
    pnpm run db:seed
```

4. **Inicie o servidor de desenvolvimento:**

```Bash
    pnpm run db:generate
    pnpm run db:migrate
    pnpm run db:seed
```
