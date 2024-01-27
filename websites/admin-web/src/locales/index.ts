import 'moment/dist/locale/zh-cn';
import 'moment/dist/locale/ja';

import lodash from 'lodash';
import { DefaultLocaleMessageSchema } from 'vue-i18n';
import * as vuetifyLocale from 'vuetify/locale';

import $vuetify from '@/locales/$vuetify';

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

export default {
  zhHans: {
    $vuetify: $vuetify.zhHans,
  },
  en: {
    $vuetify: $vuetify.en,
  },
  ja: {
    $vuetify: $vuetify.ja,
  },
};
