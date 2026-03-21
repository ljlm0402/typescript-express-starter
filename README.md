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

**TypeScript Express Starter** is an interactive CLI tool that generates production-ready TypeScript Express projects with your preferred stack configuration.

Instead of starting from scratch, this CLI provides a comprehensive project generator with multiple database integrations, development tools, and deployment configurations. Choose from 10+ templates and customize your development workflow in minutes.

- **Interactive Setup**: Choose database, ORM, linter, testing framework, and more
- **Production Ready**: Docker, PM2, NGINX configurations included
- **Developer Experience**: Hot reload, testing, linting, and formatting pre-configured
- **Multiple Stacks**: Support for 10+ database/ORM combinations

## 💎 CLI Features

- 🎯 **Interactive Setup** — Smart CLI with guided project configuration

- 🚀 **Quick or Custom Mode** — Start fast with presets or choose tools category by category

- 🗄️ **Multiple Database Options** — Prisma, Sequelize, TypeORM, Mongoose, Knex, and more

- 🛠️ **Development Tools** — Choose from ESLint, Biome, Jest, Vitest, Docker, PM2

- 📱 **Template Selection** — 10+ pre-configured project templates

- ⚡ **Auto Configuration** — Dependencies, scripts, and configs automatically setup

- 🔧 **Smart Dependencies** — Tool compatibility and requirement resolution

- 📦 **Package Manager Agnostic** — Works with npm, pnpm, or yarn

- 🚀 **Zero Config Start** — Generated projects work immediately

- 🎨 **Customizable** — Add your own templates and development tools

## ⚡️ Quick Start

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
│
◇  Enter your project name:
│  your-project-name
│
◇  Choose quick profile:
│  ○ Minimal (Template only (no additional devtools))
│  ● Recommended (Balanced default toolchain)
│  ○ Full (One tool from each category)
│
◇  Preset ────────────────────────────────────────────────────────────╮
│                                                                     │
│  Quick profile selected: recommended (biome, tsup, vitest, docker)  │
│                                                                     │
├─────────────────────────────────────────────────────────────────────╯
│
◇  Configuration summary ────────────────────────╮
│                                                │
│  Setup mode     : quick                        │
│  Package manager: pnpm                         │
│  Template       : Express TypeScript           │
│  Project name   : your-project-name            │
│  Devtools       : Biome, tsup, Vitest, Docker  │
│                                                │
├────────────────────────────────────────────────╯
│
◆  Proceed with project generation?
│  ● Yes / ○ No
│
✔ 📦 Base dependencies installed!
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

## 📂 Generated Project Structure

When you create a new project, the CLI generates this structure:

```bash
your-project/
├── src/
│   ├── config/           # Configuration files, environment settings
│   ├── controllers/      # Request handling & response logic
│   ├── dtos/             # Data Transfer Objects for request/response
│   ├── entities/         # Database entities (if using ORM)
│   ├── exceptions/       # Custom exception classes
│   ├── interfaces/       # TypeScript interfaces and type definitions
│   ├── middlewares/      # Middlewares (logging, auth, error handling)
│   ├── repositories/     # Database access logic
│   ├── routes/           # API route definitions
│   ├── services/         # Business logic
│   ├── utils/            # Utility/helper functions
│   ├── app.ts            # Express app initialization
│   └── server.ts         # Server entry point
├── .env                   # Environment variables file
├── .env.development.local # Development environment variables
├── .env.production.local  # Production environment variables
├── .env.test.local        # Test environment variables
├── nodemon.json           # Nodemon configuration
├── package.json           # Project dependencies and scripts
└── tsconfig.json          # TypeScript configuration
```

## 🛠 Development Tools Available

Choose from these categories during project setup:

| Category      | Available Tools             | Description                                     |
| ------------- | --------------------------- | ----------------------------------------------- |
| **Linter**    | `biome`, `eslint`, `oxlint` | Code formatting & linting (Biome is all-in-one) |
| **Bundler**   | `swc`, `tsup`               | Fast TypeScript compilation and bundling        |
| **Testing**   | `jest`, `vitest`            | Unit & integration testing frameworks           |
| **Container** | `docker`                    | Docker & docker-compose configuration           |

### To be added later (currently in progress):

| Category      | Available Tools | Description                          |
| ------------- | --------------- | ------------------------------------ |
| **Process**   | `pm2`           | Production process management        |
| **CI/CD**     | `github`        | GitHub Actions workflows             |
| **Git Hooks** | `husky`         | Pre-commit hooks for quality control |
| **API Docs**  | `swagger`       | OpenAPI/Swagger documentation        |

**Smart Selection**: The CLI automatically resolves tool dependencies and compatibility.

## 🧩 Available Templates

Current template status with comprehensive compatibility tested:

### ✅ **Production Ready & Fully Tested**

| Template             | Description                                         | Status    | Compatibility |
| -------------------- | --------------------------------------------------- | --------- | ------------- |
| `default`            | Express + TypeScript starter                        | ✅ Active | 🎯 Baseline   |
| `drizzle-postgresql` | Drizzle ORM + PostgreSQL (Type-safe, Zero overhead) | ✅ Active | 🌟 100% (8/8) |

### 🔧 **Enhanced Development Tools Support**

**drizzle-postgresql** template is fully compatible with:

#### Linters

- ✅ **Biome** - Modern unified tool (linter + formatter)
- ✅ **ESLint + Prettier** - Traditional reliable combination
- ✅ **Oxlint** - Rust-based high-performance linter (18ms!)

#### Compilers

- ✅ **tsup** - esbuild-based bundler (193ms build!)
- ✅ **SWC** - Rust-based native performance compiler

#### Test Runners

- ✅ **Jest** - Mature test framework with full E2E support
- ✅ **Vitest** - Modern Vite-based test runner

> 🎯 **All 8 combinations tested and verified** - Choose your preferred development experience!

### 🚧 **Coming Soon**

#### **ORM/Database Integration**

| Template        | Description                                         | Priority   |
| --------------- | --------------------------------------------------- | ---------- |
| `prisma`        | Type-safe database client with auto-generated types | 🔥 Next    |
| `mongoose`      | Elegant MongoDB ODM for Node.js                     | 🔥 Next    |
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
| **Time**           | 🔴 Hours of configuration       | ✅ 2-3 minutes interactive setup      |
| **Configuration**  | 🔴 Manual dependency management | ✅ Auto-resolved, compatible versions |
| **Best Practices** | 🔴 Research required            | ✅ Pre-configured industry standards  |
| **Consistency**    | 🔴 Varies by developer          | ✅ Standardized project structure     |
| **Updates**        | 🔴 Manual maintenance           | ✅ CLI updates bring new features     |

### vs. Other Generators

| Feature              | TypeScript Express Starter | Other Generators |
| -------------------- | -------------------------- | ---------------- |
| **Database Choice**  | ✅ 10+ options planned     | Limited options  |
| **Tool Selection**   | ✅ Mix & match dev tools   | Fixed stack      |
| **TypeScript First** | ✅ Built for TypeScript    | Often JS-first   |
| **Production Ready** | ✅ Docker, PM2 included    | Basic setup      |

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
