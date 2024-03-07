import lodash from 'lodash';
import parentModule from 'parent-module';
import template from 'string-template';
import { createI18n } from 'vue-i18n';

import { ISourceCreate } from '@/api/admin/data-contracts';
import messages from '@/locales';
import { useLocaleStore } from '@/stores/modules/localeStore';
import { Locale as LocaleConfig } from '@/types/config';
import localeUtil from '@/utils/locale';

const i18n = createI18n({
  legacy: false,
  locale: localeUtil.getCurrLang(), // 设置当前语言
  fallbackLocale: localeUtil.getDefLang(), // 设置默认语言
  messages: messages,
});

const ndt = (text?: string, args: any[] = [], options?: LocaleConfig.TOptions): string => {
  if (!text) return '';

  // direct return if text is key.
  if (text.startsWith('$')) return i18n.global.t(text, args);

  const key = localeUtil.toKey(text, options?.context);

  // key exists.
  if (i18n.global.te(key)) return i18n.global.t(key, args);

  // create source if not created.
  const localeStore = useLocaleStore();
  if (!lodash.has(localeStore.createdSources, key)) {
    localeStore.createSource({
      source: text,
      context: options?.context || '',
      locations: localeUtil.generateLocations(parentModule(), options),
    } as ISourceCreate);
  }

  console.warn(
    `[i18n] not found: ${text}, ${options?.context || '(empty)'}, ${localeUtil.getCurrLang()}`,
  );

  return template(text, args);
};

lodash.set(i18n, 'ndt', ndt);

export default i18n as typeof i18n & { ndt: typeof ndt };
