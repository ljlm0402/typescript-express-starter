module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src'],
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  moduleNameMapper: {
    '@app': '<rootDir>/src/app',
    '@controllers/(.*)': '<rootDir>/src/controllers/$1',
    '@dtos/(.*)': '<rootDir>/src/dtos/$1',
    '@exceptions/(.*)': '<rootDir>/src/exceptions/$1',
    '@interfaces/(.*)': '<rootDir>/src/interfaces/$1',
    '@middlewares/(.*)': '<rootDir>/src/middlewares/$1',
    '@models/(.*)': '<rootDir>/src/models/$1',
    '@routes/(.*)': '<rootDir>/src/routes/$1',
    '@services/(.*)': '<rootDir>/src/services/$1',
    '@utils/(.*)': '<rootDir>/src/utils/$1',
  },
};
