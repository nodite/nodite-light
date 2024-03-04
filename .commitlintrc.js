const { readdirSync } = require('fs');

module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'body-max-line-length': [1, 'always', 100],
    'scope-enum': [
      2,
      'always',
      [
        'bump',
        'all',
        'deps',
        'deps-dev',
        'github',
        'packages',
        'release',
        'root',
        'scripts',
        'templates',
        ...readdirSync('./packages'),
        ...readdirSync('./services'),
        ...readdirSync('./websites'),
      ],
    ],
    'scope-empty': [1, 'never'],
  },
};
