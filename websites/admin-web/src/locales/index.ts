import lodash from 'lodash';
import { DefaultLocaleMessageSchema } from 'vue-i18n';
import * as vuetifyLocale from 'vuetify/locale';

const locales = import.meta.glob('@/locales/**/locale.*.ts', {
  import: 'default',
  eager: true,
});

const messages = {} as {
  [key: string]: DefaultLocaleMessageSchema;
};

// customized locale.
lodash.forIn(locales, async (value, key) => {
  const matchedKey = key.match(/locales\/(.*)\/locale\.(.*)\.ts/);
  if (!matchedKey) return;
  const msgKey = `${matchedKey[2]}.${matchedKey[1].replaceAll('/', '.')}`;
  lodash.set(messages, msgKey, value);
});

// vuetify locale.
lodash.forIn(messages, (value, langcode) => {
  lodash.set(
    value,
    '$vuetify',
    lodash.merge(lodash.get(value, '$vuetify', {}), lodash.get(vuetifyLocale, langcode, {})),
  );
});

export default messages;
