import messages from '@/locales';

const supported = Object.keys(messages);

let locale = 'en';

try {
  const { 0: browserLang } = navigator.language.split('-');
  if (browserLang == 'zh') locale = 'zhHans';
  if (supported.includes(browserLang)) locale = browserLang;
} catch (e) {
  console.log(e);
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
      flag: 'us',
      name: 'united-states',
      label: 'English',
      messages: messages.en,
    },
    {
      code: 'zhHans',
      flag: 'cn',
      name: 'china',
      label: '中文',
      messages: messages.zhHans,
    },
    // {
    //   code: 'ja',
    //   flag: 'jp',
    //   name: 'japan',
    //   label: '日本語',
    //   messages: messages.ja,
    // },
  ],

  messages: messages,
};
