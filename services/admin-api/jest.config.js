// TODO: use babel to run it with ES6
import dotenv from 'dotenv';
import { pathsToModuleNameMapper } from 'ts-jest';

import { compilerOptions } from './tsconfig.json';

dotenv.config({ path: '.env.local' });

export const moduleNameMapper = pathsToModuleNameMapper(compilerOptions.paths, {
  prefix: '<rootDir>/src',
});
export const testEnvironment = 'node';
export const transform = {
  '^.+\\.tsx?$': 'ts-jest',
};
export const testRegex = '(/__tests__/.*|(\\.|/)(test|spec))\\.(jsx?|tsx?)$';
export const testPathIgnorePatterns = [
  '/lib/',
  '/node_modules/',
  '/img/',
  '/dist/',
];
export const moduleFileExtensions = ['ts', 'tsx', 'js', 'jsx', 'json', 'node'];
export const modulePaths = ['src'];
export const moduleDirectories = ['node_modules'];
export const setupFiles = ['dotenv/config'];
