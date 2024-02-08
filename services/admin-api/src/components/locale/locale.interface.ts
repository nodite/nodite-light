import { ILocale } from '@/components/locale/locale.model';
import { ILocaleLocation } from '@/components/locale/locale_location.model';
import { ILocaleMessage } from '@/components/locale/locale_message.model';
import { ILocaleSource } from '@/components/locale/locale_source.model';

export type IAvailableLocale = Pick<
  ILocale,
  'langcode' | 'momentCode' | 'icon' | 'label' | 'isDefault'
>;

export type ILocaleCreate = Omit<ILocale, 'localeId'>;

export type ILocaleUpdate = Omit<ILocale, 'localeId'>;

export interface IAvailableMessage {
  langcode: ILocaleMessage['langcode'];
  message: ILocaleMessage['message'];
  source: ILocaleSource['source'];
  context: ILocaleSource['context'];
}

export type ILocationCreate = Omit<ILocaleLocation, 'lcId' | 'srcId'>;

export type ISourceCreate = Omit<ILocaleSource, 'srcId'> & {
  locations: ILocationCreate[];
};

export type ISourceWithMessages = ILocaleSource & {
  messages: ILocaleMessage[];
};

export type IMessageUpsert = ILocaleMessage;
