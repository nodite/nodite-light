declare interface ImportMeta {
  readonly env: {
    // Environment variables defined in .env
    readonly VITE_API_BASE_URL: string;
  };
}

declare module '*.vue' {
  import { DefineComponent } from 'vue';
  const component: DefineComponent<object, object, unknown>;
  export default component;
}
