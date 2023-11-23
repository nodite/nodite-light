// eslint-disable-next-line tsdoc/syntax
/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
export default {
  collectCoverage: true,
  collectCoverageFrom: ['src/**/*.{ts,tsx}'],
  coverageThreshold: {
    global: {
      branches: 100,
      functions: 100,
      lines: 100,
      statements: 100,
    },
  },
  preset: 'ts-jest',
  testEnvironment: 'node',
};
