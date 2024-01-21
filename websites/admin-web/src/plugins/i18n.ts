import { createI18n } from 'vue-i18n';

import locales from '@/configs/locales';

const messages = locales.messages;

const i18n = createI18n({
  legacy: false,
  locale: locales.locale, // 设置默认语言
  fallbackLocale: locales.fallbackLocale, // 设置回退语言
  messages: messages,
});

export const $ndt = (text?: string, args: any[] = []): string => {
  if (!text) return '';

  if (!text.startsWith('$') && !i18n.global.te(text)) {
    // TODO: create locale item.
  }

  return i18n.global.t(text, args);
};

export default i18n;
