<script setup lang="ts">
import { ref } from 'vue';
import { computed, defineEmits, defineProps, PropType, watchEffect } from 'vue';
import { useI18n } from 'vue-i18n';

const { t: $t } = useI18n();

const emit = defineEmits(['update:modelValue', 'update:error']);

const props = defineProps({
  modelValue: {
    type: String,
    default: '',
  },
  label: {
    type: String,
    default: '',
  },
  variant: {
    type: String as PropType<
      | 'outlined'
      | 'filled'
      | 'plain'
      | 'underlined'
      | 'solo'
      | 'solo-inverted'
      | 'solo-filled'
      | undefined
    >,
    default: 'outlined',
  },
  density: {
    type: String as PropType<null | 'default' | 'comfortable' | 'compact'>,
    default: 'default',
  },
  rules: {
    type: Array as PropType<((v: any) => boolean | string)[]>,
    default: () => [],
  },
  error: {
    type: Boolean,
    default: false,
  },
});

const modelValue = computed({
  get() {
    return props.modelValue;
  },
  set(value) {
    emit('update:modelValue', value);
  },
});

const error = computed({
  get() {
    return props.error;
  },
  set(value) {
    emit('update:error', value);
  },
});

const localData = ref({
  supportedLanguages: [] as { title: string; value: string }[],
});

watchEffect(() => {
  // @see https://vuetifyjs.com/en/features/internationalization/#supported-languages
  localData.value.supportedLanguages = [
    { title: $t('$vuetify.language.af'), value: 'af' },
    { title: $t('$vuetify.language.ar'), value: 'ar' },
    { title: $t('$vuetify.language.az'), value: 'az' },
    { title: $t('$vuetify.language.bg'), value: 'bg' },
    { title: $t('$vuetify.language.ca'), value: 'ca' },
    { title: $t('$vuetify.language.ckb'), value: 'ckb' },
    { title: $t('$vuetify.language.cs'), value: 'cs' },
    { title: $t('$vuetify.language.da'), value: 'da' },
    { title: $t('$vuetify.language.de'), value: 'de' },
    { title: $t('$vuetify.language.el'), value: 'el' },
    { title: $t('$vuetify.language.en'), value: 'en' },
    { title: $t('$vuetify.language.es'), value: 'es' },
    { title: $t('$vuetify.language.et'), value: 'et' },
    { title: $t('$vuetify.language.fa'), value: 'fa' },
    { title: $t('$vuetify.language.fi'), value: 'fi' },
    { title: $t('$vuetify.language.fr'), value: 'fr' },
    { title: $t('$vuetify.language.he'), value: 'he' },
    { title: $t('$vuetify.language.hr'), value: 'hr' },
    { title: $t('$vuetify.language.hu'), value: 'hu' },
    { title: $t('$vuetify.language.id'), value: 'id' },
    { title: $t('$vuetify.language.it'), value: 'it' },
    { title: $t('$vuetify.language.ja'), value: 'ja' },
    { title: $t('$vuetify.language.km'), value: 'km' },
    { title: $t('$vuetify.language.ko'), value: 'ko' },
    { title: $t('$vuetify.language.lt'), value: 'lt' },
    { title: $t('$vuetify.language.lv'), value: 'lv' },
    { title: $t('$vuetify.language.nl'), value: 'nl' },
    { title: $t('$vuetify.language.no'), value: 'no' },
    { title: $t('$vuetify.language.pl'), value: 'pl' },
    { title: $t('$vuetify.language.pt'), value: 'pt' },
    { title: $t('$vuetify.language.ro'), value: 'ro' },
    { title: $t('$vuetify.language.ru'), value: 'ru' },
    { title: $t('$vuetify.language.sk'), value: 'sk' },
    { title: $t('$vuetify.language.sl'), value: 'sl' },
    { title: $t('$vuetify.language.srCyrl'), value: 'srCyrl' },
    { title: $t('$vuetify.language.srLatn'), value: 'srLatn' },
    { title: $t('$vuetify.language.sv'), value: 'sv' },
    { title: $t('$vuetify.language.th'), value: 'th' },
    { title: $t('$vuetify.language.tr'), value: 'tr' },
    { title: $t('$vuetify.language.uk'), value: 'uk' },
    { title: $t('$vuetify.language.vi'), value: 'vi' },
    { title: $t('$vuetify.language.zhHans'), value: 'zhHans' },
    { title: $t('$vuetify.language.zhHant'), value: 'zhHant' },
  ];
});
</script>

<template>
  <v-autocomplete
    v-model="modelValue"
    :label="props.label"
    :items="localData.supportedLanguages"
    :density="props.density"
    :variant="props.variant"
    :rules="props.rules"
    :error="error"
    chips
  >
    <template v-for="(_, name) in $slots" v-slot:[name]="data">
      <!-- slots -->
      <slot :name="name" v-bind="data"></slot>
    </template>
  </v-autocomplete>
</template>
