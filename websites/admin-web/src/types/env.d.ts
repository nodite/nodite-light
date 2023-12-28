// import { ImportGlobOptions } from 'vite';

declare interface ImportMeta {
  readonly env: {
    // Environment variables defined in .env
    readonly VITE_APP_TITLE: string;
    readonly VITE_APP_BASE_PATH: string;
    readonly VITE_APP_BASE_API: string;
    readonly VITE_APP_API_KEY: string;
  };
  glob: (glob: string | string[], options?: ImportGlobOptions) => Record<string, any>;
}

declare module '*.vue' {
  import { DefineComponent } from 'vue';
  const component: DefineComponent<object, object, unknown>;
  export default component;
}

declare module 'vue-virtual-scroller';
