import { ILocale } from '@/components/locale/locale.model';

export type IAvailableLocale = Pick<
  ILocale,
  'langcode' | 'momentCode' | 'icon' | 'label' | 'isDefault'
>;

export type ILocaleCreate = Omit<ILocale, 'localeId'>;

export type ILocaleUpdate = Omit<ILocale, 'localeId'>;
