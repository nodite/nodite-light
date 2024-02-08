import 'moment/dist/locale/zh-cn';
import 'moment/dist/locale/ja';

import vuetifyEN from '@/locales/$vuetify/locale.en';
import vuetifyJa from '@/locales/$vuetify/locale.ja';
import vuetifyZhHans from '@/locales/$vuetify/locale.zhHans';
import { Locale as LocaleConfig } from '@/types/config';

export default {
  en: {
    $vuetify: vuetifyEN,
  },
  zhHans: {
    $vuetify: vuetifyZhHans,
  },
  ja: {
    $vuetify: vuetifyJa,
  },
} as { [langcode: string]: LocaleConfig.Message };
