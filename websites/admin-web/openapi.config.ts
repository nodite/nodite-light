import * as dotenv from 'dotenv';
import * as path from 'path';
import * as process from 'process';
import type { GenerateApiParams } from 'swagger-typescript-api';
import { generateApi } from 'swagger-typescript-api';

const cwd = process.cwd();
const templatesDir = path.resolve(cwd, './templates');

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
  dotenv.config({ path: '.env' });

  for (const [key, value] of Object.entries(process.env)) {
    if (!key.startsWith('VITE_APP_')) continue;

    const [, scope] = /^VITE_APP_([^_]+)_API$/g.exec(key) || [];

    if (!scope) continue;

    console.log(`> Generating API for ${scope}...`);

    await generateApi({
      url: `${value}/api-docs/swagger.json`,
      output: path.resolve(cwd, `./src/api/${scope.toLocaleLowerCase()}`),
      templates: templatesDir,
      ...commonParams,
    });

    console.log(`> API for ${scope} generated.`);
  }

  process.exit();
};

gen().catch(console.error);
