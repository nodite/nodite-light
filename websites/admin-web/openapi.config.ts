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
  let API_HOST = 'http://localhost:8080';

  envPath.some((path) => {
    dotenv.config({
      path,
    });

    const VITE_OPENAPI_HOST = process.env.VITE_OPENAPI_HOST;

    if (VITE_OPENAPI_HOST) {
      API_HOST = VITE_OPENAPI_HOST;
    }

    return !!VITE_OPENAPI_HOST;
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
