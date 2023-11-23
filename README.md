# Lerna Template

[![build](https://github.com/remarkablemark/lerna-template/actions/workflows/build.yml/badge.svg)](https://github.com/remarkablemark/lerna-template/actions/workflows/build.yml)
[![codecov](https://codecov.io/gh/remarkablemark/lerna-template/branch/master/graph/badge.svg?token=1SYU67HOUQ)](https://codecov.io/gh/remarkablemark/lerna-template)
[![Netlify Status](https://api.netlify.com/api/v1/badges/46dc4645-697d-455e-8156-9817213bb13a/deploy-status)](https://app.netlify.com/sites/lerna-template/deploys)

[Lerna](https://github.com/lerna/lerna) template.

## Prerequisites

- [Node.js](https://nodejs.org/)
- [npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)

## Install

Clone the repository:

```sh
git clone https://github.com/remarkablemark/lerna-template.git
cd lerna-template
```

Install the dependencies:

```sh
npm install
```

## Available Scripts

In the root directory, you can run:

### `npm run build`

Builds all packages:

```sh
npm run build
```

Builds a single package:

```sh
npm run build -- --scope=<package-name>
```

For example:

```sh
npm run build -- --scope=example-a
```

### `npm run clean`

Deletes build artifacts for all packages:

```sh
npm run clean
```

Cleans a single package:

```sh
npm run clean -- --scope=<package-name>
```

For example:

```sh
npm run clean -- --scope=example-a
```

### `npm run create-package`

Creates a package:

```sh
npm run create-package
```

Creates a package using the CLI:

```sh
npm run create-package <package-name> -- --template=<template>
```

Creates package `foo` using the TypeScript template (default):

```sh
npm run create-package foo -- --template=typescript
```

Creates package `bar` using the React template:

```sh
npm run create-package bar -- --template=react
```

### `npm run lint`

Lints all packages:

```sh
npm run lint
```

Lints a single package:

```sh
npm run lint -- --scope=<package-name>
```

For example:

```sh
npm run lint -- --scope=example-a
```

### `npm run lint:fix`

Fixes lint errors for all packages:

```sh
npm run lint:fix
```

Fixes lint errors for a single package:

```sh
npm run lint:fix -- --scope=<package-name>
```

For example:

```sh
npm run lint:fix -- --scope=example-a
```

### `npm run storybook`

Runs Storybook server:

```sh
npm run storybook
```

### `npm test`

Runs tests for all packages:

```sh
npm test
```

Runs tests for a single package:

```sh
npm test -- --scope=<package-name>
```

For example:

```sh
npm run test -- --scope=example-a
```

## Release

Release is automated with [Lerna](https://lerna.js.org/).

If npm publish failed:

1. Delete the Git tags on remote
2. Rerun the [publish](https://github.com/remarkablemark/lerna-template/actions/workflows/publish.yml) workflow

Because Lerna commits and pushes the release to the remote repository, branch protection rules have been disabled.

To prevent race conditions with Lerna release, don't merge PRs until after the publish workflow is done.

### Canary

To release a canary version for testing, run the [publish](https://github.com/remarkablemark/lerna-template/actions/workflows/publish.yml) workflow with a branch other than `master`.

### Dry Run

To see the to-be-updated versions, run the [publish](https://github.com/remarkablemark/lerna-template/actions/workflows/publish.yml) workflow and enable **Dry run**.

## License

[MIT](LICENSE)
