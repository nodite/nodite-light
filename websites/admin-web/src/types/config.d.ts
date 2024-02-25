import { RouteRecordRaw } from 'vue-router';

/**
 * @namespace Common
 */
declare namespace Common {
  type ArrayElem<ArrType> = ArrType extends readonly (infer ElementType)[] ? ElementType : never;
}

/**
 * @namespace ThemeConfig
 */
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

  interface Color {
    colorId: number;
    colorName: string;
    colorValue: string;
  }

  type UpdatePrimaryColor = (color: Color) => void;
}

/**
 * @namespace NavigationConfig
 */
declare namespace NavigationConfig {
  type MenuType = 'overline' | 'directory' | 'menu' | 'action';
  type LayoutType = 'default' | 'auth' | 'landing' | 'ui';

  type Route = RouteRecordRaw & {
    matched?: Omit<Route, 'matched' | 'children'>[];
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
    children?: Route[];
  };

  type Menu = Route;

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

/**
 * @namespace VueTreeView
 */
declare namespace VueTreeView {
  interface TreeNode<T> {
    id: string;
    text: string;
    item: T;
    state: {
      opened?: boolean;
      disabled?: boolean;
      editable?: boolean;
      draggable?: boolean;
      dropable?: boolean;
      checked?: boolean;
      indeterminate?: boolean;
      isLoading?: boolean;
    };
    children: string[];
  }

  interface TreeConfig {
    roots: string[];
    leaves?: string[];
    padding?: number;
    editable?: boolean;
    editing?: string;
    editableClass?: string;
    checkboxes?: boolean;
    checkMode?: checkMode;
    dragAndDrop?: boolean;
    keyboardNavigation?: boolean;
    disabled?: boolean;
    disabledClass?: string;
    openedIcon?: IIcon;
    closedIcon?: IIcon;
    focusClass?: string;
    checkedClass?: string;
    indeterminateClass?: string;
  }
}

/**
 * @namespace Locale
 */
declare namespace Locale {
  interface TOptions {
    context?: string;
    component?: string;
  }
  interface Message {
    [key: string]: string | Message;
  }
}
