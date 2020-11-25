const dependencies = {
  save:
    'bcrypt class-transformer class-validator cookie-parser cors cross-env dotenv envalid express helmet hpp jest ' +
    'jsonwebtoken morgan swagger-jsdoc swagger-ui-express ts-jest ts-node typescript',

  dev:
    '@types/bcrypt @types/cookie-parser @types/cors @types/dotenv @types/express @types/helmet @types/hpp @types/jest ' +
    '@types/jsonwebtoken @types/morgan @types/node @types/supertest @types/swagger-jsdoc @types/swagger-ui-express ' +
    '@typescript-eslint/eslint-plugin @typescript-eslint/parser eslint eslint-config-prettier eslint-plugin-prettier ' +
    'husky node-gyp nodemon prettier supertest'
};

module.exports = dependencies;
