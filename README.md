<img src='https://github.com/ljlm0402/typescript-express-starter/raw/images/logo.jpg' border='0' alt='logo' />

[Express](https://www.npmjs.com/package/express) with [TypeScript's](https://www.npmjs.com/package/typescript) Starter.

<a href="https://www.npmjs.com/package/typescript-express-starter" target="_blank"><img src="https://img.shields.io/npm/v/typescript-express-starter.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/package/typescript-express-starter" target="_blank"><img src="https://img.shields.io/npm/l/typescript-express-starter.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/package/typescript-express-starter" target="_blank"><img src="https://img.shields.io/github/v/release/ljlm0402/typescript-express-starter" alt="Release Version" /></a>
<a href="https://www.npmjs.com/package/typescript-express-starter" target="_blank"><img src="https://img.shields.io/npm/dm/typescript-express-starter.svg" alt="NPM Downloads" /></a>

<br />

## 🤔 What is Express ?

Express is a fast, open and concise web framework and is a Node.js based project.

## 😎 Introducing The Package

Express consists of JavaScript, which makes it vulnerable to type definitions.

That's why we avoid supersets with starter packages that introduce TypeScript.

The package is configured to use TypeScript instead of JavaScript.

NOTE: This project is a variation of [express-generator-typescript](https://github.com/seanpmaxwell/express-generator-typescript) by [seanpmaxwell](https://github.com/seanpmaxwell) 👍

## 🚀 Quick Start

### Install with the npm Global Package

```bash
$ npm install -g typescript-express-starter
```

### Run npx to Install The Package

npx is a tool in the JavaScript package management module, npm.

This is a tool that allows you to run the npm package on a single run without installing the package.

If you do not enter a project name, it defaults to _typescript-express-starter_.

```bash
$ npx typescript-express-starter "project name"
```

Choose the template you want. We will create more templates later.

### Select a Templates

<img src='https://github.com/ljlm0402/typescript-express-starter/raw/images/cli.gif' border='0' alt='cli' />

Start your typescript-express-starter app in development mode at `http://localhost:3000/`

```bash
$ cd "project name" && npm run start
```

## 🛎 Available Commands for the Server

- Run the Server in production mode : `npm run start`.
- Run the Server in development mode : `npm run dev`.
- Run all unit-tests: `npm run test`.
- Check for linting errors: `npm run lint`.
- Fix for linting: `npm run lint:fix`.

## 💎 The Package Features

![](https://img.shields.io/badge/-TypeScript-007ACC?style=for-the-badge&logo=TypeScript&logoColor=fff)
![](https://img.shields.io/badge/-Express-F8F8F5?style=for-the-badge)
![](https://img.shields.io/badge/-Docker-2496ED?style=for-the-badge&logo=Docker&logoColor=fff)
![](https://img.shields.io/badge/-NGINX-269539?style=for-the-badge&logo=NGINX&logoColor=fff)
![](https://img.shields.io/badge/-ESLint-4B32C3?style=for-the-badge&logo=ESLint&logoColor=fff)
![](https://img.shields.io/badge/-Prettier-F7B93E?style=for-the-badge&logo=Prettier&logoColor=000000)
![](https://img.shields.io/badge/-Swagger-85EA2D?style=for-the-badge&logo=Swagger&logoColor=fff)
![](https://img.shields.io/badge/-Jest-C21325?style=for-the-badge&logo=Jest&logoColor=fff)
![](https://img.shields.io/badge/-Nodemon-76D04B?style=for-the-badge&logo=Nodemon&logoColor=fff)
![](https://img.shields.io/badge/-MongoDB-47A248?style=for-the-badge&logo=MongoDB&logoColor=fff)
![](https://img.shields.io/badge/-MySQL-4479A1?style=for-the-badge&logo=MySQL&logoColor=fff)
![](https://img.shields.io/badge/-PostgreSQL-336791?style=for-the-badge&logo=PostgreSQL&logoColor=fff)

### 🐳 Dockerize

[Docker](https://docs.docker.com/) is a platform for developers and sysadmins to build, run, and share applications with containers.

[Docker](https://docs.docker.com/get-docker/) Install.

- starts the containers in the background and leaves them running : `docker-compose up -d`.
- Stops containers and removes containers, networks, volumes, and images : `docker-compose down`.

### ♻️ Reverse Proxy

[NGINX](https://www.nginx.com/) is a web server that can also be used as a reverse proxy, load balancer, mail proxy and HTTP cache.

Proxying is typically used to distribute the load among several servers, seamlessly show content from different websites, or pass requests for processing to application servers over protocols other than HTTP.

When NGINX proxies a request, it sends the request to a specified proxied server, fetches the response, and sends it back to the client.

Modify `nginx.conf` file to your source code

### ✨ Code Formatter

Palantir, the backers behind TSLint announced in 2019 that they would be deprecating TSLint in favor of supporting typescript-eslint in order to benefit the community.

So, migration from TSLint to ESLint.

[ESLint](https://eslint.org/), Find and fix problems in your JavaScript code

[Prettier](https://prettier.io/) is an opinionated code formatter.

It enforces a consistent style by parsing your code and re-printing it with its own rules that take the maximum line length into account, wrapping code when necessary.

1. Install VSCode Extension [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode), [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)

2. `CMD` + `Shift` + `P` (Mac Os) or `Ctrl` + `Shift` + `P` (Windows)

3. Format Selection With

4. Configure Default Formatter...

5. Prettier - Code formatter

<img src='https://github.com/ljlm0402/typescript-express-starter/raw/images/formatter.png' border='0' alt='formatter' />

### 📗 Swagger UI Docs

[Swagger](https://swagger.io/) is Simplify API development for users, teams, and enterprises with the Swagger open source and professional toolset.

Find out how Swagger can help you design and document your APIs at scale.

Start your app in development mode at `http://localhost:3000/api-docs`

Modify `swagger.yaml` file to your source code

### 🌐 REST Client

REST Client allows you to send HTTP request and view the response in Visual Studio Code directly.

VSCode Extension [REST Client](https://marketplace.visualstudio.com/items?itemName=humao.rest-client) Install.

## 🗂 Code Structure (default)

```bash
│
├── /.vscode
│   └── settings.json
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
│   │   ├── logger.ts
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
├── .huskyrc
├── .prettierrc
├── docker-compose.yml
├── Dockerfile
├── Dockerfile.dev
├── jest.config.js
├── Makefile
├── Makefile
├── nginx.conf
├── nodemon.json
├── package-lock.json
├── package.json
├── swagger.yaml
└── tsconfig.json
```

## 📬 Recommended Commit Message

| When             | Commit Message     |
| :--------------- | :----------------- |
| Add Feature      | ✨ Add Feature     |
| Fix Bug          | 🐞 Fix Bug         |
| Refactoring Code | 🛠 Refactoring Code |
| Install Package  | 📦 Install Package |
| Fix Readme       | 📚 Fix Readme      |
| Update Version   | 🌼 Update Version  |
| New Template     | 🎉 New Template    |

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

- Malavan [https://github.com/malavancs](https://github.com/malavancs)

## 📬 Please request an issue

In the future, please write down your desired template, questions, and features to be added, and we will try our best to answer and reflect them.

Thank you very much for your interest in our package.
