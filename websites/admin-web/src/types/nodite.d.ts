import i18n from '@/plugins/i18n';

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $ndt: typeof i18n.ndt;
  }
}
