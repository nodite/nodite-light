#!/usr/bin/env node

/* eslint-disable @typescript-eslint/no-var-requires, no-console */

import { execSync } from 'child_process';
import { existsSync, writeFileSync } from 'fs';
import { resolve } from 'path';
import { hideBin } from 'yargs/helpers';
import yargs from 'yargs/yargs';

/**
 * Executes command.
 */
const exec = (command: string) => execSync(command, { stdio: 'inherit' });

/**
 * Converts input to JSON string.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const stringify = (data: any) => JSON.stringify(data, null, 2) + '\n';

const PACKAGES = 'packages';

const path = {
  directory: '',
  packages: resolve(__dirname, `../${PACKAGES}`),
  root: resolve(__dirname, '..'),
  template: '',
  templates: resolve(__dirname, '../templates'),
};

let scope = '';
let directory = '';
let packageName = '';
let template = 'typescript-template';

const templateChoices = ['react', 'typescript'] as const;

yargs(hideBin(process.argv))
  .usage('Usage: npm run $0 <name> -- --template=[string]')
  .command('<name>', 'Create package name', (yargs) =>
    yargs.positional('name', {
      describe: 'package name',
      type: 'string',
    }),
  )
  .demandCommand(1)
  .option('template', {
    choices: templateChoices,
    describe: 'Template type',
    type: 'string',
    default: 'typescript',
  })
  .check((argv) => {
    [packageName] = argv._ as string[];
    directory = packageName;

    if (packageName[0] === '@') {
      [scope, directory] = packageName.split('/');
      if (!scope || !/^@[\w-]+$/.test(scope)) {
        throw new Error(`Invalid package scope: ${scope}`);
      }
    }

    if (!directory || !/^[\w-]+$/.test(directory)) {
      throw new Error(`Invalid package name: ${packageName}`);
    }

    if (existsSync(resolve(path.packages, directory))) {
      throw new Error(`Package directory exists: ${directory}`);
    }

    if (argv.template === 'react') {
      template = 'react-template';
    }

    path.directory = resolve(path.packages, directory);
    path.template = resolve(path.templates, template);
    return true;
  })
  .parseSync();

/**
 * Install.
 */
exec('npm install');

/**
 * Copy from template to package.
 */
console.log(`Copying '${path.template}' to '${path.directory}'...`);
exec(`cp -r ${path.template} ${path.directory}`);

/**
 * Update template.
 */
console.log(`Replacing string '${template}' with '${packageName}' in '${path.directory}'...`);
const isMac = process.platform === 'darwin';
exec(
  `LC_CTYPE=C && LANG=C && grep -rl '${template}' '${path.directory}' | xargs sed -i ${
    isMac ? '""' : ''
  } -e 's|${template}|${packageName}|g'`,
);

console.log(`Updating '${packageName}' package.json...`);
const packageJsonPath = resolve(path.directory, 'package.json');
const packageJson = require(packageJsonPath);
delete packageJson.private;
writeFileSync(packageJsonPath, stringify(packageJson));

/**
 * Install, clean, and build.
 */
exec('npm install');
exec(`npx lerna run clean --scope=${packageName}`);
exec(`npx lerna run build --scope=${packageName}`);
