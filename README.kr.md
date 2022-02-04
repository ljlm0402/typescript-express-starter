<h1 align="center">
<br>
  <img src="https://github.com/ljlm0402/typescript-express-starter/raw/images/logo.jpg" alt="프로젝트 로고" />
  <br>
    <br>
  타입스크립트 익스프레스 스타터
  <br>
</h1>

<h4 align="center">🚀 타입스크립트 기반의 익스프레스 보일러 플레이트 스타터 패키지</h4>

<p align="center">
    <a href="http://npm.im/typescript-express-starter" target="_blank">
      <img src="https://img.shields.io/npm/v/typescript-express-starter.svg" alt="npm 버전" />
    </a>
    <a href="http://npm.im/typescript-express-starter" target="_blank">
      <img src="https://img.shields.io/github/v/release/ljlm0402/typescript-express-starter" alt="npm 릴리즈 버전" />
    </a>
    <a href="http://npm.im/typescript-express-starter" target="_blank">
      <img src="https://img.shields.io/npm/l/typescript-express-starter.svg" alt="npm 패키지 라이선스" />
    </a>
    <a href="http://npm.im/typescript-express-starter" target="_blank">
      <img src="https://img.shields.io/npm/dm/typescript-express-starter.svg" alt="npm 다운로드 수" />
    </a>
</p>

<p align="center">
  <a href="https://github.com/ljlm0402/typescript-express-starter/stargazers" target="_blank">
    <img src="https://img.shields.io/github/stars/ljlm0402/typescript-express-starter" alt="github 스타"/>
  </a>
  <a href="https://github.com/ljlm0402/typescript-express-starter/network/members" target="_blank">
    <img src="https://img.shields.io/github/forks/ljlm0402/typescript-express-starter" alt="github 포크" />
  </a>
  <a href="https://github.com/ljlm0402/typescript-express-starter/stargazers" target="_blank">
    <img src="https://img.shields.io/github/contributors/ljlm0402/typescript-express-starter" alt="github 컨트리뷰터" />
  </a>
  <a href="https://github.com/ljlm0402/typescript-express-starter/issues" target="_blank">
    <img src="https://img.shields.io/github/issues/ljlm0402/typescript-express-starter" alt="github 이슈" />
  </a>
</p>

<br />

## 번역본 - 자신이 원하는 언어로 읽으세요

- [🇺🇸 영어](https://github.com/ljlm0402/typescript-express-starter/blob/master/README.md)
- [🇰🇷 한국어](https://github.com/ljlm0402/typescript-express-starter/blob/master/README.kr.md)

> 번역을 도와주실 분은 [이슈](https://github.com/ljlm0402/typescript-express-starter/issues/new?assignees=ljlm0402&labels=%F0%9F%92%B1+Translations&template=translations-language---.md&title=) 남겨주시기 바랍니다. 💜

<br />

## 웹 사이트 - 프로젝트 소개 및 홍보

- [💁🏻‍♂️ Dylan Iqbal :: A TypeScript Express Starter App](https://bit.ly/3rrZFZ9)

> 웹 사이트 및 블로그에 소개를 원하시는 분은 [이슈](https://github.com/ljlm0402/typescript-express-starter/issues/new?assignees=ljlm0402&labels=%F0%9F%91%80+Introducetion&template=introducetion-project---.md&title=) 남겨주시기 바랍니다. 💙

<br />

## 😎 프로젝트를 소개합니다.

Express는 유형 정의에 취약한 JavaScript로 구성 되어있습니다.

이것이 바로 TypeScript를 도입하는 스타터 패키지로 수퍼 세트를 피하는 이유입니다.

패키지는 JavaScript 대신 TypeScript를 사용하도록 구성되어 있습니다.

> 참고 : [express-generator-typescript](https://github.com/seanpmaxwell/express-generator-typescript)

### 🤔 Express는 무엇인가요 ?

Node.js를 위한 빠르고 개방적인 간결한 웹 프레임워크입니다.

## 🚀 시작하기

### npm 전역 설치

```bash
$ npm install -g typescript-express-starter
```

### npx를 통해 프로젝트를 설치

프로젝트 이름을 입력하지 않으면, 기본값으로 _typescript-express-starter_ 폴더로 설치됩니다.

```bash
$ npx typescript-express-starter "project name"
```

### 원하시는 템플릿을 선택

<img src="https://github.com/ljlm0402/typescript-express-starter/raw/images/cli.gif" alt="예시" />

설치가 완료되면 Script 명령어를 통해 프로젝트를 실행합니다.

#### 템플릿 종류

| 이름                | 설명                                                                                                                                                                            |
| :------------------ | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Default             | Express 기본                                                                                                                                                                    |
| Routing Controllers | 데코레이터 사용량이 많은 구조화되고 선언적이며 아름답게 구성된 클래스 기반 컨트롤러 생성                                                                                        |
| Sequelize           | PostgreSQL, MySQL, MariaDB, SQLite, Microsoft SQL Server를 지원하는 Promise 패턴 기반의 Node.js ORM                                                                             |
| Mongoose            | Node.js와 MongoDB를 위한 ODM(Object Data Mapping) 라이브러리                                                                                                                    |
| TypeORM             | 자바스크립트, 타입스크립트과 함께 사용되어 Node.js, React Native, Expo에서 실행될 수 있는 ORM                                                                                   |
| Prisma              | 데이터베이스에 데이터를 프로그래밍 언어의 객체와 매핑하여 기존에 SQL로 작성하던 데이터를 수정, 테이블 구조 변경등의 작업을 객체를 통해 프로그래밍적으로 할 수 있도록 해주는 ORM |
| Knex                | 쿼리 빌더를 위한 라이브러리                                                                                                                                                     |
| GraphQL             | API 용 쿼리 언어이며 기존 데이터로 이러한 쿼리를 수행하기위한 런타임                                                                                                            |
| Typegoose           | 타입스크립트 클래스를 사용하여 몽구스 모델 정의                                                                                                                                 |

## 🛎 Script 명령어

- 프로덕션 모드 실행 : `npm run start` 아니면 `Start typescript-express-starter` VS Code 로
- 개발 모드 실행 : `npm run dev` 아니면 `Dev typescript-express-starter` VS Code 로
- 단위 테스트 : `npm test` 아니면 `Test typescript-express-starter` VS Code 로
- 코드 포맷터 검사 : `npm run lint` 아니면 `Lint typescript-express-starter` VS Code 로
- 코드 포맷터 적용 : `npm run lint:fix` 아니면 `Lint:Fix typescript-express-starter` VS Code 로

## 💎 프로젝트 기능

- Application

  - ![](https://img.shields.io/badge/-TypeScript-007ACC?style=for-the-badge&logo=TypeScript&logoColor=fff)
    ![](https://img.shields.io/badge/-Node.js-339933?style=for-the-badge&logo=Node.js&logoColor=fff)
    ![](https://img.shields.io/badge/-NPM-CB3837?style=for-the-badge&logo=NPM&logoColor=fff)
    ![](https://img.shields.io/badge/-NGINX-269539?style=for-the-badge&logo=NGINX&logoColor=fff)

- DevOps

  - ![](https://img.shields.io/badge/-Docker-2496ED?style=for-the-badge&logo=Docker&logoColor=fff)
    ![](https://img.shields.io/badge/-Nodemon-76D04B?style=for-the-badge&logo=Nodemon&logoColor=fff)
    ![](https://img.shields.io/badge/-PM2-2B037A?style=for-the-badge&logo=PM2&logoColor=fff)
    ![](https://img.shields.io/badge/-ESLint-4B32C3?style=for-the-badge&logo=ESLint&logoColor=fff)
    ![](https://img.shields.io/badge/-Prettier-F7B93E?style=for-the-badge&logo=Prettier&logoColor=000)
    ![](https://img.shields.io/badge/-Jest-C21325?style=for-the-badge&logo=Jest&logoColor=fff)
    ![](https://img.shields.io/badge/-SWC-FFFFFF?style=for-the-badge&logo=swc&logoColor=FBE1A6)

- Utilities

  - ![](https://img.shields.io/badge/-Swagger-85EA2D?style=for-the-badge&logo=Swagger&logoColor=000)

- Database
  - ![](https://img.shields.io/badge/-MySQL-4479A1?style=for-the-badge&logo=MySQL&logoColor=fff)
    ![](https://img.shields.io/badge/-MariaDB-003545?style=for-the-badge&logo=MariaDB&logoColor=fff)
    ![](https://img.shields.io/badge/-PostgreSQL-336791?style=for-the-badge&logo=PostgreSQL&logoColor=fff)
    ![](https://img.shields.io/badge/-MongoDB-47A248?style=for-the-badge&logo=MongoDB&logoColor=fff)

> [Simple Icons](https://simpleicons.org/)

### 🐳 Docker :: 컨테이너 플랫폼

[Docker](https://docs.docker.com/)란, 컨테이너 기반의 오픈소스 가상화 플랫폼이다.

[설치 홈페이지](https://docs.docker.com/get-docker/)에 접속해서 설치를 해줍니다.

- 백그라운드에서 컨테이너를 시작하고 실행 : `docker-compose up -d`
- 컨테이너를 중지하고 컨테이너, 네트워크, 볼륨 및 이미지를 제거 : `docker-compose down`

수정을 원하시면 `docker-compose.yml`과 `Dockerfile`를 수정해주시면 됩니다.

### ♻️ Nginx :: 웹 서버

[Nginx](https://www.nginx.com/) 역방향 프록시,로드 밸런서, 메일 프록시 및 HTTP 캐시로도 사용할 수있는 웹 서버입니다.

프록시는 일반적으로 여러 서버에로드를 분산하거나, 다른 웹 사이트의 콘텐츠를 원활하게 표시하거나, HTTP 이외의 프로토콜을 통해 처리 요청을 애플리케이션 서버에 전달하는 데 사용됩니다.

Nginx 요청을 프록시하면 지정된 프록시 서버로 요청을 보내고 응답을 가져 와서 클라이언트로 다시 보냅니다.

수정을 원하시면 `nginx.conf` 파일을 수정해주시면 됩니다.

### ✨ ESLint, Prettier :: 정적 코드 분석 및 코드 스타일 변환

[ESLint](https://eslint.org/)는 JavaScript 코드에서 발견 된 문제 패턴을 식별하기위한 정적 코드 분석 도구입니다.

[Prettier](https://prettier.io/)는 개발자가 작성한 코드를 정해진 코딩 스타일을 따르도록 변환해주는 도구입니다.

코드를 구문 분석하고 최대 줄 길이를 고려하여 필요한 경우 코드를 래핑하는 자체 규칙으로 다시 인쇄하여 일관된 스타일을 적용합니다.

1. [VSCode](https://code.visualstudio.com/) Extension에서 [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode), [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) 설치합니다.

2. 설치가 완료되면, 단축키 `CMD` + `Shift` + `P` (Mac Os) 또는 `Ctrl` + `Shift` + `P` (Windows) 입력합니다.

3. Format Selection With 선택합니다.

4. Configure Default Formatter... 선택합니다.

5. Prettier - Code formatter 적용합니다.

<img src="https://user-images.githubusercontent.com/42952358/126604937-4ef50b61-b7e4-4635-b3c9-3c94dd6b06fa.png" alt="Formatter 설정" />

> 2019년, TSLint 지원이 종료 되어 ESLint를 적용하였습니다.

### 📗 Swagger :: API 문서화

[Swagger](https://swagger.io/)는 개발자가 REST 웹 서비스를 설계, 빌드, 문서화, 소비하는 일을 도와주는 대형 도구 생태계의 지원을 받는 오픈 소스 소프트웨어 프레임워크이다.

API를 대규모로 설계하고 문서화하는 데 용이하게 사용합니다.

Swagger URL은 `http://localhost:3000/api-docs` 으로 작성했습니다.

수정을 원하시면 `swagger.yaml` 파일을 수정해주시면 됩니다.

### 🌐 REST Client :: HTTP Client 도구

REST 클라이언트를 사용하면 HTTP 요청을 보내고 Visual Studio Code에서 직접 응답을 볼 수 있습니다.

VSCode Extension에서 [REST Client](https://marketplace.visualstudio.com/items?itemName=humao.rest-client) 설치합니다.

수정을 원하시면 src/http 폴더 안에 `*.http` 파일을 수정해주시면 됩니다.

### 🔮 PM2 :: 웹 애플리케이션을 운영 및 프로세스 관리자

[PM2](https://pm2.keymetrics.io/)란, 서버에서 웹 애플리케이션을 운영할 때 보통 데몬으로 서버를 띄워야 하고 Node.js의 경우 서버가 크래시나면 재시작을 하기 위해서 워치독(watchdog) 류의 프로세스 관리자이다.

- 프로덕션 모드 :: `npm run deploy:prod` 또는 `pm2 start ecosystem.config.js --only prod`
- 개발 모드 :: `npm run deploy:dev` 또는 `pm2 start ecosystem.config.js --only dev`

수정을 원하시면 `ecosystem.config.js` 파일을 수정해주시면 됩니다.

### 🏎 SWC :: 강하고 빠른 자바스크립트 / 타입스크립트 컴파일러

[SWC](https://swc.rs/)는 차세대 고속 개발자 도구를 위한 확장 가능한 Rust 기반 플랫폼입니다.

`SWC는 단일 스레드에서 Babel보다 20배, 4개 코어에서 70배 빠릅니다.`

- tsc 빌드 :: `npm run build`
- swc 빌드 :: `npm run build:swc`

수정을 원하시면 `.swcrc` 파일을 수정해주시면 됩니다.

## 🗂 코드 구조 (default)

```bash
│
├── /.vscode
│   ├── launch.json
│   └── settings.json
│
├── /src
│   ├── /configs
│   │   ├── development.json
│   │   ├── production.json
│   │   └── test.json
│   │
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
│   ├── index.ts
│   └── server.ts
│
├── .dockerignore
├── .editorconfig
├── .env
├── .eslintignore
├── .eslintrc
├── .gitignore
├── .huskyrc
├── .lintstagedrc.json
├── .prettierrc
├── .swcrc
├── docker-compose.yml
├── Dockerfile
├── ecosystem.config.js
├── jest.config.js
├── Makefile
├── nginx.conf
├── nodemon.json
├── package-lock.json
├── package.json
├── swagger.yaml
└── tsconfig.json
```

## ⭐️ 주신분들

[![Stargazers repo roster for @ljlm0402/typescript-express-starter](https://reporoster.com/stars/ljlm0402/typescript-express-starter)](https://github.com/ljlm0402/typescript-express-starter/stargazers)

## 🍴 해주신분들

[![Forkers repo roster for @ljlm0402/typescript-express-starter](https://reporoster.com/forks/ljlm0402/typescript-express-starter)](https://github.com/ljlm0402/typescript-express-starter/network/members)

## 🤝 도움을 주신분들

<img src="https://contributors-img.web.app/image?repo=ljlm0402/typescript-express-starter" alt="기여자">

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

- Jon Gallant [https://github.com/jongio](https://github.com/jongio)

- Kuba Rozkwitalski [https://github.com/kubarozkwitalski](https://github.com/kubarozkwitalski)

- Craig Harman [https://github.com/craigharman](https://github.com/craigharman)

- Edward Teixeira Dias Junior [https://github.com/edward-teixeira](https://github.com/edward-teixeira)

- n2ptune [https://github.com/n2ptune](https://github.com/n2ptune)

- michael r [https://github.com/alanmynah](https://github.com/alanmynah)

- Benjamin [https://github.com/benjaminudoh10](https://github.com/benjaminudoh10)

- Amrik Singh [https://github.com/AmrikSD](https://github.com/AmrikSD)

- oricc [https://github.com/oricc](https://github.com/oricc)

- Dustin Newbold [https://github.com/dustinnewbold](https://github.com/dustinnewbold)

- WhatIfWeDigDeeper [https://github.com/WhatIfWeDigDeeper](https://github.com/WhatIfWeDigDeeper)

- David Stewart [https://github.com/davidjmstewart](https://github.com/davidjmstewart)

## 💳 라이센스

[MIT](LICENSE)

## 📬 커밋 메시지 정의

| 언제               | 메시지                |
| :----------------- | :-------------------- |
| 기능 추가          | ✨ 기능 추가          |
| 버그 수정          | 🐞 버그 수정          |
| 코드 개선          | 🛠 코드 개선           |
| 패키지 설치        | 📦 패키지 설치        |
| 문서 수정          | 📚 문서 수정          |
| 버전 업데이트      | 🌼 버전 업데이트      |
| 새로운 템플릿 추가 | 🎉 새로운 템플릿 추가 |

## 📬 이슈를 남겨주세요

추후 추가하고자하는 템플릿, 질문, 기능을 적어 주시면 최선을 다해 답변하고 반영하겠습니다.

저의 오픈소스에 대해 관심을 가져주셔서 감사합니다.

# (๑˃̵ᴗ˂̵)و
