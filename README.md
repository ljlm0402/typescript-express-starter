<img src='https://github.com/ljlm0402/typescript-express-starter/raw/images/logo.jpg' border='0' alt='logo' />

[Express](https://www.npmjs.com/package/express) with [TypeScript's](https://www.npmjs.com/package/typescript) Starter.

<a href="https://www.npmjs.com/package/typescript-express-starter" target="_blank"><img src="https://img.shields.io/npm/v/typescript-express-starter.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/package/typescript-express-starter" target="_blank"><img src="https://img.shields.io/npm/l/typescript-express-starter.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/package/typescript-express-starter" target="_blank"><img src="https://img.shields.io/npm/dm/typescript-express-starter.svg" alt="NPM Downloads" /></a>

<br />

## 🤔 What is Express ?

Express is a fast, open and concise web framework and is a Node.js based project.

## 😎 Introducing the package.

Express consists of JavaScript, which makes it vulnerable to type definitions. That's why we avoid supersets with starter packages that introduce TypeScript.

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

<img src='https://github.com/ljlm0402/typescript-express-starter/raw/images/example.gif' border='0' alt='example' />

Start your typescript-express-starter app in development mode at `http://localhost:3000/`

```bash
$ cd "project name" && npm run start
```

## 🛎 Available commands for the server.

- Run the Server in production mode : `npm run start`.
- Run the Server in development mode : `npm run dev`.
- Run all unit-tests: `npm run test`.
- Check for linting errors: `npm run lint`.

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
│   │   └── user.dto.ts
│   │
│   ├── /exceptions
│   │   └── HttpException.ts
│   │
│   ├── /interfaces
│   │   ├── auth.interface.ts
│   │   ├── routes.interface.ts
│   │   └── user.interface.ts
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
│   │   └── user.service.ts
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
├── .env
├── .gitignore
├── jest.config.js
├── package-lock.json
├── package.json
├── swagger.yaml
├── tsconfig.json
└── tslint.json
```

## 📗 Swagger UI Docs

Simplify API development for users, teams, and enterprises with the Swagger open source and professional toolset. 

Find out how Swagger can help you design and document your APIs at scale.

Start your typescript-express-starter app in development mode at `http://localhost:3000/swagger`

Modify `swagger.yaml` file to your source code

## 📬 Recommended Commit Message

|  When ?  |  Commit Message  |
|:--------|:-----------|
| Add function | feat: ⚡️ Add function |
| Fix bug | fix: 🐞 Fix bug |
| Refactoring | refactor: 🛠 Refactoring |
| Add package | package: 📦 Add package |
| Fix readme | docs: 📚 Fix readme |
| Improvements style | style: 👁 Improvements style |

## 💳 License

[MIT](LICENSE)

## 🤝 Contributors

* Jeongwon Kim [https://github.com/swtpumpkin](https://github.com/swtpumpkin)

* Lloyd Park [https://github.com/yeondam88](https://github.com/yeondam88)

* BitYoungjae [https://github.com/BitYoungjae](https://github.com/BitYoungjae)

* strama4 [https://github.com/strama4](https://github.com/strama4)

* João Silva [https://github.com/joaopms](https://github.com/joaopms)

* sonbyungjun [https://github.com/sonbyungjun](https://github.com/sonbyungjun)

* Sean Maxwell [https://github.com/seanpmaxwell](https://github.com/seanpmaxwell)

* Paolo Tagliani [https://github.com/pablosproject](https://github.com/pablosproject)
