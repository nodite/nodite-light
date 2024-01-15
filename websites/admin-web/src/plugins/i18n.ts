import { createI18n } from 'vue-i18n';

import locales from '@/configs/locales';

const messages = locales.messages;

const i18n = createI18n({
  legacy: false,
  locale: locales.locale, // 设置默认语言
  fallbackLocale: locales.fallbackLocale, // 设置回退语言
  messages: messages,
});

export const $tnd = (iKey?: string, fbName?: string): string =>
  iKey && i18n.global.te(iKey) ? i18n.global.t(iKey) : fbName || iKey || '';

export default i18n;
