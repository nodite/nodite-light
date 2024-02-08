import { localeZhHans as DeleteConfirmForm } from '@nodite-light/vuetify-delete-confirm-form';
import { localeZhHans as IconPicker } from '@nodite-light/vuetify-icon-picker';
import { localeZhHans as LanguageSelector } from '@nodite-light/vuetify-language-selector';
import { zhHans as Vuetify } from 'vuetify/locale';

export default {
  ...Vuetify,

  ...IconPicker,
  ...DeleteConfirmForm,
  ...LanguageSelector,
};
