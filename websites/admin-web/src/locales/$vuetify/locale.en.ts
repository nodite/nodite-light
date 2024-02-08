import { localeEn as DeleteConfirmForm } from '@nodite-light/vuetify-delete-confirm-form';
import { localeEn as IconPicker } from '@nodite-light/vuetify-icon-picker';
import { localeEn as LanguageSelector } from '@nodite-light/vuetify-language-selector';
import { en as Vuetify } from 'vuetify/locale';

export default {
  ...Vuetify,
  ...IconPicker,
  ...DeleteConfirmForm,
  ...LanguageSelector,
};
