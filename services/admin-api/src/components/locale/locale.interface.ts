import { ILocale } from '@/components/locale/locale.model';
import { ILocaleLocation } from '@/components/locale/locale_location.model';
import { ILocaleSource } from '@/components/locale/locale_source.model';

export type IAvailableLocale = Pick<
  ILocale,
  'langcode' | 'momentCode' | 'icon' | 'label' | 'isDefault'
>;

export type ILocaleCreate = Omit<ILocale, 'localeId'>;

export type ILocaleUpdate = Omit<ILocale, 'localeId'>;

export interface IAvailableMessage {
  [key: string]: string | IAvailableMessage;
}

export type ILocationCreate = Omit<ILocaleLocation, 'lcId' | 'srcId'>;

export type ISourceCreate = Omit<ILocaleSource, 'srcId'> & {
  locations: ILocationCreate[];
};
