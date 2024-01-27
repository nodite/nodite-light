import messages from '@/locales';

let DEFAULT_LOCALE = 'en';

try {
  const { 0: browserLang } = navigator.language.split('-');
  if (browserLang == 'zh') DEFAULT_LOCALE = 'zhHans';
  if (Object.keys(messages).includes(browserLang)) DEFAULT_LOCALE = browserLang;
} catch (e) {
  console.error(e);
}

export default {
  // default locale
  DEFAULT_LOCALE,

  messages: messages,
};
