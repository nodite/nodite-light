import lodash from 'lodash';

const locales = import.meta.glob('@/locales/**/locale.*.ts', {
  import: 'default',
  eager: true,
});

const messages = {} as Record<string, unknown>;

lodash.forIn(locales, async (value, key) => {
  const matchedKey = key.match(/locales\/(.*)\/locale\.(.*)\.ts/);
  if (!matchedKey) return;
  const msgKey = `${matchedKey[2]}.${matchedKey[1].replaceAll('/', '.')}`;
  lodash.set(messages, msgKey, value);
});

export default messages;
