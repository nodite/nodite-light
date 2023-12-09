declare interface ImportMeta {
  readonly env: {
    // Environment variables defined in .env
    readonly VITE_APP_TITLE: string;
    readonly VITE_APP_BASE_API: string;
  };
}

declare module '*.vue' {
  import { DefineComponent } from 'vue';
  const component: DefineComponent<object, object, unknown>;
  export default component;
}
