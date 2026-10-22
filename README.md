<h1 align="center">
<br>
  <img src="https://github.com/ljlm0402/typescript-express-starter/raw/images/newLogo.png" alt="Project Logo" />
  <br>
    <br>
  TypeScript Express Starter
  <br>
</h1>

<h4 align="center">🚀 Express RESTful API Boilerplate Using TypeScript</h4>

<p align ="center">
  <a href="https://nodei.co/npm/typescript-express-starter" target="_blank">
    <img src="https://nodei.co/npm/typescript-express-starter.png" alt="npm Info" />
  </a>
</p>

<p align="center">
    <a href="http://npm.im/typescript-express-starter" target="_blank">
      <img src="https://img.shields.io/npm/v/typescript-express-starter.svg" alt="npm Version" />
    </a>
    <a href="http://npm.im/typescript-express-starter" target="_blank">
      <img src="https://img.shields.io/github/v/release/ljlm0402/typescript-express-starter" alt="npm Release Version" />
    </a>
    <a href="http://npm.im/typescript-express-starter" target="_blank">
      <img src="https://img.shields.io/npm/dm/typescript-express-starter.svg" alt="npm Downloads" />
    </a>
    <a href="http://npm.im/typescript-express-starter" target="_blank">
      <img src="https://img.shields.io/npm/l/typescript-express-starter.svg" alt="npm Package License" />
    </a>
</p>

<p align="center">
  <a href="https://github.com/ljlm0402/typescript-express-starter/stargazers" target="_blank">
    <img src="https://img.shields.io/github/stars/ljlm0402/typescript-express-starter" alt="github Stars" />
  </a>
  <a href="https://github.com/ljlm0402/typescript-express-starter/network/members" target="_blank">
    <img src="https://img.shields.io/github/forks/ljlm0402/typescript-express-starter" alt="github Forks" />
  </a>
  <a href="https://github.com/ljlm0402/typescript-express-starter/stargazers" target="_blank">
    <img src="https://img.shields.io/github/contributors/ljlm0402/typescript-express-starter" alt="github Contributors" />
  </a>
  <a href="https://github.com/ljlm0402/typescript-express-starter/issues" target="_blank">
    <img src="https://img.shields.io/github/issues/ljlm0402/typescript-express-starter" alt="github Issues" />
  </a>
</p>

<br />

- [🇰🇷 Korean](https://github.com/ljlm0402/typescript-express-starter/blob/master/README.kr.md)
- [🇺🇸 English](https://github.com/ljlm0402/typescript-express-starter/blob/master/README.md)

<br />

---

## 📝 Introduction

**TypeScript Express Starter** is an interactive CLI tool that generates TypeScript Express projects with your preferred stack configuration.

Start with a basic Express template, Drizzle + PostgreSQL, or decorator-based request validation with express-cargo. Select development tools to generate the dependencies, scripts, and configuration files for your workflow.

- **Interactive Setup**: Choose database, ORM, linter, testing framework, and more
- **Docker Support**: Development and production Dockerfiles when Docker is selected
- **Developer Experience**: Hot reload plus configuration for your selected testing and linting tools
- **Template Choices**: Basic Express, Drizzle + PostgreSQL, and express-cargo

## 💎 CLI Features

- 🎯 **Interactive Setup** — Smart CLI with guided project configuration

- 🚀 **Quick or Custom Mode** — Start fast with presets or choose tools category by category

- 🗄️ **PostgreSQL Integration** — Drizzle ORM template with database scripts

- 🛠️ **Development Tools** — Choose from ESLint, Biome, Oxlint, SWC, tsup, Jest, Vitest, Docker

- 📱 **Template Selection** — Three active templates with authentication and user management examples

- ⚡ **Auto Configuration** — Dependencies, scripts, and configs automatically setup

- 🔧 **Dependency Setup** — Collect selected tool dependencies and install them in one step

- 📦 **Package Manager Agnostic** — Works with npm, pnpm, or yarn

- 🚀 **Environment Setup** — Generate `.env` from `.env.example` with random authentication secrets

- 🎨 **Customizable** — Add your own templates and development tools

## ⚡️ Quick Start

**Requirements:** Node.js **22.12.0 or later** and npm **9.11.0 or later**. Install pnpm or Yarn separately if you select it in the CLI. Docker with Compose is required to use the Docker configuration.

You can also run the CLI without a global installation:

```bash
npx typescript-express-starter
```

```bash
# Install globally
npm install -g typescript-express-starter

# Run the interactive CLI
typescript-express-starter

┌  📘 TypeScript Express Starter
│
◇  Choose setup mode:
│  ● 🚀 Quick start (recommended preset) (Automatically selects a sensible toolset)
│  ○ 🛠 Custom (step-by-step) (Pick tools category by category)
│
◇  Which package manager do you want to use?
│  ● npm
│  ○ pnpm
│  ○ yarn
│
◇  Choose a template:
│  ● Express TypeScript (Basic Express + TypeScript starter · beginner · stable)
│  ○ Drizzle PostgreSQL (Modern SQL toolkit with type safety + full devtools · intermediate · stable)
│  ○ Express + express-cargo (Declarative validation & binding with decorators · intermediate · stable)
│
◇  Enter your project name:
│  your-project-name
│
◇  Choose quick profile:
│  ○ Minimal (Template only (no additional devtools))
│  ● Recommended (Balanced default toolchain)
│  ○ Full (One tool from each category)
│
◇  Preset ───────────────────────────────────────────────────────────────╮
│                                                                        │
│  Quick profile selected: recommended (eslint, tsup, vitest, docker)    │
│                                                                        │
├────────────────────────────────────────────────────────────────────────╯
│
◇  Configuration summary ────────────────────────────────────────────────╮
│                                                                        │
│  Setup mode     : quick                                                │
│  Package manager: npm                                                  │
│  Template       : Express TypeScript                                   │
│  Project name   : your-project-name                                    │
│  Devtools       : ESLint + Prettier, tsup, Vitest, Docker              │
│                                                                        │
├────────────────────────────────────────────────────────────────────────╯
│
◆  Proceed with project generation?
│  ● Yes / ○ No
│
✔ Dependencies installed!
│
└ 🎉 Project setup complete!

# Navigate to your project
cd your-project-name

# Start development server
npm run dev
```

**Generated Project Features:**

- 🌐 Express server: `http://localhost:3000/`
- 🔄 Hot reload with nodemon

### Environment and startup

The CLI creates `.env` from `.env.example` and generates random values for `SECRET_KEY` and `JWT_SECRET` when those keys are present. Existing `.env` files are preserved. Secrets must be at least 32 characters and must not contain known placeholder values. Review the generated settings before deployment.

For Drizzle, configure `DATABASE_URL`, prepare PostgreSQL, and run `npm run db:migrate` before using the API. The `default` and `express-cargo` templates do not require a database. Use `pnpm dev` or `yarn dev` if you selected that package manager.

Authentication and user routes are mounted under `/api/v1/auth` and `/api/v1/users`; the root URL is not a landing page.

## 📂 Generated Project Structure

When you create a new project, the CLI generates this structure:

```bash
your-project/
├── src/
│   ├── config/           # Configuration files, environment settings
│   ├── controllers/      # Request handling & response logic
│   ├── dtos/             # Data Transfer Objects for request/response
│   ├── entities/         # Domain entities
│   ├── exceptions/       # Custom exception classes
│   ├── interfaces/       # TypeScript interfaces and type definitions
│   ├── middlewares/      # Middlewares (logging, auth, error handling)
│   ├── repositories/     # Data access (in-memory or database)
│   ├── routes/           # API route definitions
│   ├── services/         # Business logic
│   ├── utils/            # Utility/helper functions
│   ├── app.ts            # Express app initialization
│   └── server.ts         # Server entry point
├── .env                  # Generated local environment settings
├── .env.example          # Environment variable reference
├── .gitignore            # Excludes secrets and generated files
├── .project-meta.json    # Selected template, tools, and package manager
├── nodemon.json           # Nodemon configuration
├── package.json           # Project dependencies and scripts
└── tsconfig.json          # TypeScript configuration
```

Compiler, test, and Docker files are added according to the selected tools. Environment-specific `.env.{NODE_ENV}.local` files are optional and are not generated. CLI updates apply to newly generated projects; existing projects are maintained separately.

## 🛠 Development Tools Available

Choose from these categories during project setup:

| Category      | Available Tools             | Description                                     |
| ------------- | --------------------------- | ----------------------------------------------- |
| **Linter**    | `biome`, `eslint`, `oxlint` | Code formatting & linting (Biome is all-in-one) |
| **Bundler**   | `swc`, `tsup`               | Fast TypeScript compilation and bundling        |
| **Testing**   | `jest`, `vitest`            | Unit & integration testing frameworks           |
| **Container** | `docker`                    | Dockerfiles & Docker Compose configuration           |

### To be added later (currently in progress):

| Category      | Available Tools | Description                          |
| ------------- | --------------- | ------------------------------------ |
| **Process**   | `pm2`           | Production process management        |
| **CI/CD**     | `github`        | GitHub Actions workflows             |
| **Git Hooks** | `husky`         | Pre-commit hooks for quality control |
| **API Docs**  | `swagger`       | OpenAPI/Swagger documentation        |

**Smart Selection**: Recommended profiles use template-specific tool choices. The CLI copies the matching compiler and test configuration and reports missing required assets.

## 🧩 Available Templates

The following templates are available in the CLI and included in the npm package:

### ✅ **Active Templates**

| Template | Description | Storage |
| --- | --- | --- |
| `default` | Express + TypeScript with Zod request validation | In-memory |
| `drizzle-postgresql` | Drizzle ORM with PostgreSQL | PostgreSQL |
| `express-cargo` | Decorator-based DTO validation and request binding | In-memory |

The in-memory templates reset user data when the process restarts. See the [express-cargo guide](templates/express-cargo/README.md) for DTO and binding examples.

### 🔧 **Enhanced Development Tools Support**

The active templates provide configuration for the following tools:

#### Linters

- ✅ **Biome** - Modern unified tool (linter + formatter)
- ✅ **ESLint + Prettier** - Traditional reliable combination
- ✅ **Oxlint** - Rust-based high-performance linter

#### Compilers

- ✅ **tsup** - esbuild-based bundler
- ✅ **SWC** - Rust-based native performance compiler

#### Test Runners

- ✅ **Jest** - Mature test framework with full E2E support
- ✅ **Vitest** - Modern Vite-based test runner

> 🎯 Generation tests cover 36 combinations across the active templates, linters, compilers, test runners, and Docker. Runtime compatibility checks are available separately with `npm run test:matrix`.

### 🚧 **Coming Soon**

The entries below are not selectable in the CLI. Prisma and Mongoose implementations exist in the repository but are excluded from the npm package while verification is pending.

#### **ORM/Database Integration**

| Template        | Description                                         | Priority   |
| --------------- | --------------------------------------------------- | ---------- |
| `prisma-postgresql`        | Type-safe database client with auto-generated types | 🔥 Next    |
| `mongoose-mongodb`      | Elegant MongoDB ODM for Node.js                     | 🔥 Next    |
| `typeorm`       | Decorator-based Active Record ORM                   | 🚧 Planned |
| `sequelize`     | Mature Promise-based SQL ORM                        | 🚧 Planned |
| `mikro-orm`     | Data Mapper ORM pattern for TypeScript              | 🚧 Planned |
| `typegoose`     | TypeScript-friendly Mongoose alternative            | 🚧 Planned |
| `node-postgres` | High-performance PostgreSQL native driver           | 🚧 Planned |
| `knex`          | Flexible SQL query builder & migrations             | 🚧 Planned |

#### **Architecture/Controller Style**

| Template  | Description                           | Priority     |
| --------- | ------------------------------------- | ------------ |
| `graphql` | GraphQL API schema with Apollo Server | 🚧 Knowledge |

## 🤔 Why Use This CLI?

### vs. Manual Setup

| Aspect             | Manual Setup                    | TypeScript Express Starter CLI        |
| ------------------ | ------------------------------- | ------------------------------------- |
| **Time**           | 🔴 Hours of configuration       | ✅ Guided interactive setup      |
| **Configuration**  | 🔴 Manual dependency management | ✅ Auto-resolved, compatible versions |
| **Best Practices** | 🔴 Research required            | ✅ Pre-configured industry standards  |
| **Consistency**    | 🔴 Varies by developer          | ✅ Standardized project structure     |
| **Updates**        | 🔴 Manual maintenance           | ✅ Updated templates for new projects     |

### vs. Other Generators

| Feature              | TypeScript Express Starter | Other Generators |
| -------------------- | -------------------------- | ---------------- |
| **Database Choice**  | ✅ PostgreSQL; more integrations planned     | Limited options  |
| **Tool Selection**   | ✅ Mix & match dev tools   | Fixed stack      |
| **TypeScript First** | ✅ Built for TypeScript    | Often JS-first   |
| **Production Ready** | ✅ Optional Docker configuration    | Basic setup      |

## ⭐️ Stargazers

[![Stargazers repo roster for @ljlm0402/typescript-express-starter](https://reporoster.com/stars/ljlm0402/typescript-express-starter)](https://github.com/ljlm0402/typescript-express-starter/stargazers)

## 🍴 Forkers

[![Forkers repo roster for @ljlm0402/typescript-express-starter](https://reporoster.com/forks/ljlm0402/typescript-express-starter)](https://github.com/ljlm0402/typescript-express-starter/network/members)

## 🤝 Contributors

[![Contributors repo roster for @ljlm0402/typescript-express-starter](https://contributors-img.web.app/image?repo=ljlm0402/typescript-express-starter)](https://github.com/ljlm0402/typescript-express-starter/graphs/contributors)

## 💳 License

[MIT](LICENSE)

---

<p align="center">
  Made with ❤️ by <a href="https://github.com/ljlm0402">AGUMON</a> 🦖
</p>
