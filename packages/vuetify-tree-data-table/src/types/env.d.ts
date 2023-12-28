declare module '*.vue' {
  import { DefineComponent } from 'vue';
  const component: DefineComponent<object, object, unknown>;
  export default component;
}

declare module 'vuetify/lib/components/VDataTable/composables/items.mjs';
