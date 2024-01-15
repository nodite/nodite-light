import messages from '@/locales';
import { LocaleConfig } from '@/types/config';

let locale = 'en';

try {
  const { 0: browserLang } = navigator.language.split('-');
  if (browserLang == 'zh') locale = 'zhHans';
  if (Object.keys(messages).includes(browserLang)) locale = browserLang;
} catch (e) {
  console.error(e);
}

export default {
  // current locale
  locale,

  // when translation is not available fallback to that locale
  fallbackLocale: 'en',

  // availabled locales for user selection
  availableLocales: [
    {
      code: 'en',
      momentCode: 'en',
      flag: 'us',
      name: 'united-states',
      label: 'English',
      messages: messages.en,
    },
    {
      code: 'zhHans',
      momentCode: 'zh-cn',
      flag: 'cn',
      name: 'china',
      label: '中文',
      messages: messages.zhHans,
    },
    // {
    //   code: 'ja',
    //   momentCode: 'ja',
    //   flag: 'jp',
    //   name: 'japan',
    //   label: '日本語',
    //   messages: messages.ja,
    // },
  ] as LocaleConfig.Locale[],

  messages: messages,
};
