import md5 from 'md5';

import { ILocationCreate } from '@/api/admin/data-contracts';
import messages from '@/locales';
import { Locale as LocaleConfig } from '@/types/config';
import lodash from '@/utils/lodash';
import url from '@/utils/url';

const PREFIX = 'ndt';

/**
 * Get current langcode.
 * @returns
 */
function getCurrLang(): string {
  let langcode = document.querySelector('html')?.getAttribute('lang');

  if (langcode) return langcode;

  try {
    const { 0: navLangcode } = navigator.language.split('-');
    if (Object.keys(messages).includes(navLangcode)) langcode = navLangcode;
    if (navLangcode == 'zh') langcode = 'zhHans';
  } catch (e) {
    /* empty */
  }

  return langcode || 'en';
}

/**
 * Get default langcode.
 * @returns
 */
function getDefLang(): string {
  return document.querySelector('html')?.getAttribute('def-lang') || getCurrLang() || 'en';
}

// export.
export default {
  PREFIX,

  getCurrLang: getCurrLang,

  getDefLang: getDefLang,

  /**
   * Generate locale key.
   * @param source
   * @param context
   * @returns
   */
  toKey: (source: string, context?: string, prefix: string = PREFIX): string => {
    return (prefix ? prefix + '.' : '') + md5(context ? `${context}.${source}` : source);
  },

  /**
   * Generate locale location.
   * @param path
   */
  generateLocations: (modulePath?: string, options?: LocaleConfig.TOptions): ILocationCreate[] => {
    const locations = [] as ILocationCreate[];

    if (url.isHttp(modulePath || '')) {
      locations.push({
        type: 'module_path',
        name: url.toPath(modulePath || ''),
      } as ILocationCreate);
    }

    if (options?.component) {
      locations.push({ type: 'component', name: options.component } as ILocationCreate);
    }

    if (lodash.isEmpty(locations)) {
      locations.push({ type: 'unknown', name: modulePath } as ILocationCreate);
    }

    return locations;
  },
};
