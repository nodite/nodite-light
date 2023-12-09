import * as dotenv from 'dotenv';
import * as path from 'path';
import * as process from 'process';
import type { GenerateApiParams } from 'swagger-typescript-api';
import { generateApi } from 'swagger-typescript-api';

const cwd = process.cwd();
const templatesDir = path.resolve(cwd, './templates');

const envPath = ['.env'];

const commonParams: Partial<GenerateApiParams> = {
  modular: true,
  cleanOutput: true,
  httpClientType: 'axios',
  codeGenConstructs: (struct) => {
    return {
      Keyword: {
        ...struct.Keyword,
        Object: 'Record<string, any>',
      },
    };
  },
};

const gen = async () => {
  let API_HOST = '';

  envPath.some((path) => {
    dotenv.config({
      path,
    });

    const VITE_APP_BASE_API = process.env.VITE_APP_BASE_API;

    if (VITE_APP_BASE_API) {
      API_HOST = VITE_APP_BASE_API;
    }

    return !!VITE_APP_BASE_API;
  });

  await generateApi({
    url: `${API_HOST}/api-docs/swagger.json`,
    output: path.resolve(cwd, './src/api/admin'),
    templates: templatesDir,
    ...commonParams,
  });

  process.exit();
};

gen().catch(console.error);
