import jestRootConfig from '../../jest.root';

export default {
  ...jestRootConfig,
  setupFilesAfterEnv: ['<rootDir>/../../test/setupTests.ts'],
  testEnvironment: 'jsdom',
};
