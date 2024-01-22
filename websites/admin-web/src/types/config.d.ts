import { RouteRecord, RouteRecordRaw } from 'vue-router';

declare namespace Common {
  type ArrayElem<ArrType> = ArrType extends readonly (infer ElementType)[] ? ElementType : never;
}

interface Config {
  theme: ThemeConfig.Config;
  locales: unknown;
  currency: CurrencyConfig.Config;
}

declare namespace CurrencyConfig {
  interface Currency {
    label: string;
    decimalDigits: number;
    decimalSeparator: string;
    thousandsSeparator: string;
    currencySymbol: string;
    currencySymbolNumberOfSpaces: number;
    currencySymbolPosition: string;
  }

  interface Config {
    currency: Currency;
    availableCurrencies: Currency[];
  }
}

declare namespace ThemeConfig {
  interface Config {
    //primary color
    primary: string;

    //follow OS theme
    followOs: boolean;

    // global theme for the theme
    globalTheme: string;

    // side menu theme, use global theme or custom
    menuTheme: string;

    // toolbar theme, use global theme or custom
    toolbarTheme: string;

    // show toolbar detached from top
    isToolbarDetached: boolean;

    // wrap pages content with a max-width
    isContentBoxed: boolean;

    // application is right to left
    isRTL: boolean;

    // dark theme colors
    dark: import('vuetify').ThemeDefinition;

    // light theme colors
    light: import('vuetify').ThemeDefinition;
  }
}

declare namespace NavigationConfig {
  type MenuType = 'overline' | 'directory' | 'menu' | 'action';
  type LayoutType = 'default' | 'auth' | 'landing' | 'ui';

  interface Router extends RouteRecordRaw {
    matched?: Omit<Router, 'matched' | 'children'>[];
    meta?: {
      icon?: string;
      iType?: MenuType; // menu type
      disabled?: boolean;
      regex?: RegExp;
      hidden?: boolean;
      layout?: LayoutType; // default: ui
      title?: string;
      inWhiteList?: boolean; // in white list
      [key: string]: string | number | boolean | undefined;
    };
    children?: Router[];
  }

  type Menu = Router;

  interface Config {
    menu: Menu[];
    footer: Footer[];
  }

  interface Footer {
    text?: string;
    key: string;
    href?: string;
    target?: string;
  }
}

declare namespace LocaleConfig {
  interface Locale {
    code: string;
    momentCode: string;
    flag: string;
    name: string;
    label: string;
    messages: Record<string, unknown>;
  }
}
