<img src='https://github.com/ljlm0402/typescript-express-starter/raw/images/logo.jpg' border='0' alt='logo' />

[Express](https://www.npmjs.com/package/express) with [TypeScript's](https://www.npmjs.com/package/typescript) Starter.

<a href="https://www.npmjs.com/package/typescript-express-starter" target="_blank"><img src="https://img.shields.io/npm/v/typescript-express-starter.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/package/typescript-express-starter" target="_blank"><img src="https://img.shields.io/npm/l/typescript-express-starter.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/package/typescript-express-starter" target="_blank"><img src="https://img.shields.io/github/v/release/ljlm0402/typescript-express-starter" alt="Release Version" /></a>
<a href="https://www.npmjs.com/package/typescript-express-starter" target="_blank"><img src="https://img.shields.io/npm/dm/typescript-express-starter.svg" alt="NPM Downloads" /></a>

<br />

## 🤔 What is Express ?

Express is a fast, open and concise web framework and is a Node.js based project.

## 😎 Introducing the package.

Express consists of JavaScript, which makes it vulnerable to type definitions.

That's why we avoid supersets with starter packages that introduce TypeScript.

The package is configured to use TypeScript instead of JavaScript.

NOTE: This project is a variation of [express-generator-typescript](https://github.com/seanpmaxwell/express-generator-typescript) by [seanpmaxwell](https://github.com/seanpmaxwell) 👍

## 🚀 Quick Start

### Install with the npm global package

```sh
$ npm install -g typescript-express-starter
```

### Run npx to install the package

npx is a tool in the JavaScript package management module, npm.

This is a tool that allows you to run the npm package on a single run without installing the package.

If you do not enter a project name, it defaults to _typescript-express-starter_.

```bash
$ npx typescript-express-starter "project name"
```

Choose the template you want. We will create more templates later.

### Select a templates

<img src='https://github.com/ljlm0402/typescript-express-starter/raw/images/cli.gif' border='0' alt='cli' />

Start your typescript-express-starter app in development mode at `http://localhost:3000/`

```bash
$ cd "project name" && npm run start
```

## 🛎 Available commands for the server.

- Run the Server in production mode : `npm run start`.
- Run the Server in development mode : `npm run dev`.
- Run all unit-tests: `npm run test`.
- Check for linting errors: `npm run lint`.
- Fix for linting: `npm run lint:fix`.

## 🗂 Code Structure (default)

```bash
│
├── /src
│   ├── /controllers
│   │   ├── auth.controller.ts
│   │   ├── index.controller.ts
│   │   └── users.controller.ts
│   │
│   ├── /dtos
│   │   └── users.dto.ts
│   │
│   ├── /exceptions
│   │   └── HttpException.ts
│   │
│   ├── /http
│   │   ├── auth.http
│   │   └── users.http
│   │
│   ├── /interfaces
│   │   ├── auth.interface.ts
│   │   ├── routes.interface.ts
│   │   └── users.interface.ts
│   │
│   ├── /middlewares
│   │   ├── auth.middleware.ts
│   │   ├── error.middleware.ts
│   │   └── validation.middleware.ts
│   │
│   ├── /models
│   │   └── users.model.ts
│   │
│   ├── /routes
│   │   ├── auth.route.ts
│   │   ├── index.route.ts
│   │   └── users.route.ts
│   │
│   ├── /services
│   │   ├── auth.service.ts
│   │   └── users.service.ts
│   │
│   ├── /tests
│   │   ├── auth.test.ts
│   │   ├── index.test.ts
│   │   └── users.test.ts
│   │
│   ├── /utils
│   │   ├── util.ts
│   │   └── vaildateEnv.ts
│   │
│   ├── app.ts
│   └── server.ts
│
├── .dockerignore
├── .editorconfig
├── .env
├── .eslintignore
├── .eslintrc
├── .gitignore
├── .prettierrc
├── docker-compose.yml
├── Dockerfile
├── Dockerfile.dev
├── jest.config.js
├── Makefile
├── nginx.conf
├── package-lock.json
├── package.json
├── swagger.yaml
└── tsconfig.json
```

## 🐳 Dockerize

[Docker](https://docs.docker.com/) is a platform for developers and sysadmins to build, run, and share applications with containers.

[Docker](https://docs.docker.com/get-docker/) Install.

- starts the containers in the background and leaves them running : `docker-compose up -d`.
- Stops containers and removes containers, networks, volumes, and images : `docker-compose down`.

## 🪄 Code Formatter

Palantir, the backers behind TSLint announced in 2019 that they would be deprecating TSLint in favor of supporting typescript-eslint in order to benefit the community.

So, migration from TSLint to ESLint.

[ESLint](https://eslint.org/), Find and fix problems in your JavaScript code

[Prettier](https://prettier.io/) is an opinionated code formatter.

It enforces a consistent style by parsing your code and re-printing it with its own rules that take the maximum line length into account, wrapping code when necessary.

VSCode Extension [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode), [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)

## 📗 Swagger UI Docs

Simplify API development for users, teams, and enterprises with the Swagger open source and professional toolset.

Find out how Swagger can help you design and document your APIs at scale.

Start your typescript-express-starter app in development mode at `http://localhost:3000/swagger`

Modify `swagger.yaml` file to your source code

## 🌐 REST Client

REST Client allows you to send HTTP request and view the response in Visual Studio Code directly.

VSCode Extension [REST Client](https://marketplace.visualstudio.com/items?itemName=humao.rest-client) Install.

## 📬 Recommended Commit Message

| When             | Commit Message     |
| :--------------- | :----------------- |
| Add Feature      | ⚡️ Add Feature    |
| Fix Bug          | 🐞 Fix Bug         |
| Refactoring Code | 🛠 Refactoring Code |
| Install Package  | 📦 Install Package |
| Fix Readme       | 📚 Fix Readme      |
| Update Version   | 🌼 Update Version  |
| New Releases     | 🎉 New Releases    |

## 💳 License

[MIT](LICENSE)

## 🤝 Contributors

<img src="https://contributors-img.web.app/image?repo=ljlm0402/typescript-express-starter" alt="Contributors">

- Jeongwon Kim [https://github.com/swtpumpkin](https://github.com/swtpumpkin)

- João Silva [https://github.com/joaopms](https://github.com/joaopms)

- BitYoungjae [https://github.com/BitYoungjae](https://github.com/BitYoungjae)

- Paolo Tagliani [https://github.com/pablosproject](https://github.com/pablosproject)

- Lloyd Park [https://github.com/yeondam88](https://github.com/yeondam88)

- strama4 [https://github.com/strama4](https://github.com/strama4)

- sonbyungjun [https://github.com/sonbyungjun](https://github.com/sonbyungjun)

- Sean Maxwell [https://github.com/seanpmaxwell](https://github.com/seanpmaxwell)

- Ed Guy [https://github.com/edguy3](https://github.com/edguy3)

## 📬 Please request an issue

In the future, please write down your desired template, questions, and features to be added, and we will try our best to answer and reflect them.

Thank you very much for your interest in our package.
