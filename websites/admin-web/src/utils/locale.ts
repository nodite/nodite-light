import md5 from 'md5';

import { ILocationCreate } from '@/api/admin/data-contracts';
import messages from '@/locales';
import { Locale as LocaleConfig } from '@/types/config';
import lodash from '@/utils/lodash';
import url from '@/utils/url';

let BROWSER_LOCALE = 'en';

try {
  const { 0: browserLang } = navigator.language.split('-');
  if (browserLang == 'zh') BROWSER_LOCALE = 'zhHans';
  if (Object.keys(messages).includes(browserLang)) BROWSER_LOCALE = browserLang;
} catch (e) {
  console.error(e);
}

const PREFIX = 'ndt';

export default {
  PREFIX,

  // default locale
  BROWSER_LOCALE,

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
