const dependencies = {
  save:
    'bcrypt class-transformer class-validator compression cookie-parser cors cross-env dotenv envalid express helmet hpp jest ' +
    'jsonwebtoken morgan swagger-jsdoc@6.0.0 swagger-ui-express ts-jest ts-node typescript winston winston-daily-rotate-file',

  dev:
    '@types/bcrypt @types/compression @types/cookie-parser @types/cors @types/dotenv @types/express @types/helmet @types/hpp @types/jest ' +
    '@types/jsonwebtoken @types/morgan @types/node @types/supertest @types/swagger-jsdoc @types/swagger-ui-express @types/winston ' +
    '@typescript-eslint/eslint-plugin @typescript-eslint/parser eslint eslint-config-prettier eslint-plugin-prettier ' +
    'husky node-gyp nodemon prettier supertest'
};

module.exports = dependencies;
