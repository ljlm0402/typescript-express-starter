<img alt='logo' src='https://github.com/ljlm0402/typescript-express-starter/raw/master/typescript-express-starter.jpg' border='0'>

[Express](https://www.npmjs.com/package/express) with [TypeScript's](https://www.npmjs.com/package/typescript) application generator.

<a href="https://www.npmjs.com/package/typescript-express-starter" target="_blank"><img src="https://img.shields.io/npm/v/typescript-express-starter.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/package/typescript-express-starter" target="_blank"><img src="https://img.shields.io/npm/l/typescript-express-starter.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/package/typescript-express-starter" target="_blank"><img src="https://img.shields.io/npm/dm/typescript-express-starter.svg" alt="NPM Downloads" /></a>

<br />

## 🧐 What is it?

Creates a new typescript express application.
application is configured to use TypeScript instead of plain JavaScript. 

## 🤔 Why typescript-express-starter?

Node Js is great for the rapid development of web-projects, but is often neglected because of the lack of
type safety. TypeScript solves this issue and (along with its linter file) can even make your code
more robust than some other static languages like Java.

## ⚙️ Installation

```sh
$ npm install -g typescript-express-starter
```

## 🚀 Quick Start

The quickest way to get started is use npx and pass in the name of the project you want to create.
If you don't specify a project name, the default _typescript-express-starter_ will be used instead.

Create the app:

```bash
$ npx typescript-express-starter "project name"
```

Start your typescript-express-starter app in development mode at `http://localhost:3000/`

```bash
$ cd "project name" && npm run start
```

## 🎠 Available commands for the server.

- Run the Server in production mode : `npm run start`.
- Run the Server in development mode : `npm run dev`.
- Run all unit-tests: `npm run test`.
- Check for linting errors: `npm run lint`.

## ⛑ Code Structure

```bash
│
├── /src
│   ├── /controllers
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
│   │   ├── routes.interface.ts
│   │   └── user.interface.ts
│   │
│   ├── /middlewares
│   │   ├── error.middleware.ts
│   │   └── validation.middleware.ts
│   │
│   ├── /models
│   │   └── users.model.ts
│   │
│   ├── /routes
│   │   ├── index.route.ts
│   │   └── users.route.ts
│   │
│   ├── /services
│   │   └── user.service.ts
│   │
│   ├── /tests
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
├── .gitignore
├── jest.config.js
├── package-lock.json
├── package.json
├── tsconfig.json
└── tslint.json
```

## License

[MIT](LICENSE)

## Contributors

* Jeongwon Kim [https://github.com/swtpumpkin](https://github.com/swtpumpkin)
