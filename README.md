<img alt='overnightjs' src='https://github.com/ljlm0402/typescript-express-starter/raw/master/typescript-express-starter.jng' border='0'>

[Express](https://www.npmjs.com/package/express) with [TypeScript's](https://www.npmjs.com/package/typescript) application generator.

<a href="https://www.npmjs.com/package/typescript-express-starter" target="_blank"><img src="https://img.shields.io/npm/v/typescript-express-starter.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/package/typescript-express-starter" target="_blank"><img src="https://img.shields.io/npm/l/typescript-express-starter.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/package/typescript-express-starter" target="_blank"><img src="https://img.shields.io/npm/dm/typescript-express-starter.svg" alt="NPM Downloads" /></a>


## What is it?

Creates a new express application similar to the _express-generator_ module. Except this new
application is configured to use TypeScript instead of plain JavaScript. 



## Why typescript-express-starter?

NodeJS is great for the rapid development of web-projects, but is often neglected because of the lack of
type safety. TypeScript solves this issue and (along with its linter file) can even make your code
more robust than some other static languages like Java.

There are some other tools out there to generate express apps with TypeScript such as 
_express-generator-ts_, but these either haven't been updated in a while or install a lot of junk 
in your project (such as an ORM). 

Due to the heavy use of single-page-applications, no view-engine is configured by default. Express is 
only setup with the minimal settings for calling APIs and serving an index.html file. All the tools you 
need to run for development (while restarting on changes), building, testing, and running for production 
are packaged with this library. 

In addition, relative paths are also setup, so you don't have to go through the trouble of installing
and configuring _tsconfig-paths_ and _module-alias_. Just make sure to update `paths` in _tsconfig.json_
and `_moduleAliases` in _package.json_ if you want to add/edit the relative paths.

## Installation

```sh
$ npm install -g typescript-express-starter
```


## Quick Start

The quickest way to get started is use npx and pass in the name of the project you want to create.
If you don't specify a project name, the default _express-gen-ts_ will be used instead.

Create the app:

```bash
$ npx typescript-express-starter "project name"
```

Start your typescript-express-starter app in development mode at `http://localhost:3000/`:

```bash
$ cd "project name" && npm run start
```


## Available commands for the server.

- Run the server in development mode: `npm run start:dev`.
- Run all unit-tests: `npm test`.
- Run a single unit-test: `npm test -- --testFile="name of test file" (i.e. --testFile=Users)`.
- Check for linting errors: `npm run lint`.
- Build the project for production: `npm run build`.
- Run the production build: `npm start`.
- Run production build with a different env file `npm start -- --env="name of env file" (default is production)`.



## License

[MIT](LICENSE)
