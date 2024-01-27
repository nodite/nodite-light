<script setup lang="ts">
import { IconPicker } from '@nodite-light/vuetify-icon-picker';
import { LanguageSelector } from '@nodite-light/vuetify-language-selector';
import lodash from 'lodash';
import { toast } from 'vuetify-sonner';

import { ILocale } from '@/api/admin/data-contracts';
import { $ndt } from '@/plugins/i18n';
import { useLocaleStore } from '@/stores/modules/localeStore';

const localeStore = useLocaleStore();

const emit = defineEmits(['close', 'save']);

const props = defineProps({
  dialog: {
    type: Boolean,
    default: false,
  },
  localeId: {
    type: Number,
    default: 0,
  },
});

// local data.
const defLocalData = {
  dialog: props.dialog,
  iconDialog: false,
  isFormValid: false,
  isSaving: false,
  error: false,
  errorMessage: '',
};

const localData = ref(lodash.cloneDeep(defLocalData));

// form
const refForm = ref();
const formData = ref({} as ILocale);
const formRules = ref({
  label: [],
  langcode: [(v: string) => !!v || $ndt('common.form.required', [$ndt('Langcode')])],
  momentCode: [],
  icon: [],
  orderNum: [],
  isDefault: [],
  status: [],
});

// methods.
const methods = {
  async loadFormData() {
    let locale = undefined;
    if (props.localeId > 0) {
      locale = await localeStore.query(props.localeId);
    }
    formData.value = lodash.isUndefined(locale) ? ({} as ILocale) : locale;
  },
  closeLocaleForm() {
    if (localData.value.isSaving) {
      toast.warning($ndt('common.form.saving'));
      return;
    }
    localData.value = lodash.cloneDeep(defLocalData);
    formData.value = {} as ILocale;
    emit('close');
  },
  resetErrors() {
    localData.value.error = false;
    localData.value.errorMessage = '';
  },
  async save() {
    localData.value.isSaving = true;

    const { valid } = await refForm.value.validate();

    if (!valid || !localData.value.isFormValid) {
      localData.value.isSaving = false;
      return;
    }

    try {
      await (props.localeId > 0
        ? localeStore.edit(formData.value)
        : localeStore.create(formData.value));

      localeStore.$patch({ availableLocales: [] });
    } finally {
      localData.value.isSaving = false;
    }

    toast.success($ndt('Saved successfully.'));

    methods.closeLocaleForm();

    emit('save');
  },
};

watchEffect(() => {
  localData.value.dialog = props.dialog;
  methods.loadFormData();
});
</script>

<template>
  <v-dialog
    v-model="localData.dialog"
    @click:outside="methods.closeLocaleForm"
    :persistent="localData.isSaving"
    max-width="750"
  >
    <template v-slot:activator="{ props }">
      <v-btn v-bind="props" prepend-icon="mdi-creation" variant="tonal" density="comfortable">
        {{ $ndt('Create Locale') }}
      </v-btn>
    </template>

    <v-card density="compact" elevation="8" rounded="lg">
      <v-card-title>
        <v-label>
          {{
            props.localeId > 0 ? $ndt('Edit Locale - {0}', [formData.label]) : $ndt('New Locale')
          }}
        </v-label>
        <v-spacer></v-spacer>
        <v-btn icon @click="methods.closeLocaleForm" density="compact">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>

      <v-card-text>
        <v-form
          ref="refForm"
          v-model="localData.isFormValid"
          :disabled="localData.isSaving"
          lazy-validation
        >
          <v-container class="px-10 pb-0">
            <v-row dense>
              <!-- label & orderNum -->
              <v-col>
                <v-text-field
                  density="compact"
                  v-model="formData.label"
                  :rules="formRules.label"
                  validate-on="blur"
                  :error="localData.error"
                  variant="outlined"
                >
                  <template v-slot:prepend-inner>
                    <v-label>{{ $ndt('Label') }}:</v-label>
                  </template>
                </v-text-field>
              </v-col>
              <v-col cols="4">
                <v-text-field
                  type="number"
                  density="compact"
                  :label="$ndt('Order')"
                  v-model="formData.orderNum"
                  :rules="formRules.orderNum"
                  validate-on="blur"
                  :error="localData.error"
                  variant="outlined"
                ></v-text-field>
              </v-col>
            </v-row>

            <v-row dense>
              <!-- icon -->
              <v-col>
                <IconPicker
                  v-model="formData.icon"
                  v-model:dialog="localData.iconDialog"
                  :label="$ndt('Icon')"
                  v-model:error="localData.error"
                ></IconPicker>
              </v-col>
            </v-row>

            <v-row dense>
              <!-- langcode & momentCode -->
              <v-col>
                <LanguageSelector
                  v-model="formData.langcode"
                  density="compact"
                  v-model:error="localData.error"
                  :rules="formRules.langcode"
                >
                  <template v-slot:prepend-inner>
                    <v-label>{{ $ndt('Langcode') }}:</v-label>
                  </template>
                </LanguageSelector>
              </v-col>
              <v-col>
                <v-text-field
                  density="compact"
                  v-model="formData.momentCode"
                  :rules="formRules.momentCode"
                  validate-on="blur"
                  :error="localData.error"
                  variant="outlined"
                >
                  <template v-slot:prepend-inner>
                    <v-label>{{ $ndt('Moment Code') }}:</v-label>
                  </template>
                </v-text-field>
              </v-col>
            </v-row>

            <v-row dense>
              <!-- status -->
              <v-col>
                <v-radio-group
                  v-model="formData.status"
                  :rules="formRules.status"
                  validate-on="blur"
                  :error="localData.error"
                  inline
                >
                  <template v-slot:prepend>
                    <v-label>{{ $ndt('Status') }}:</v-label>
                  </template>

                  <v-radio :label="$ndt('Enabled')" :value="1"></v-radio>
                  <v-radio :label="$ndt('Disabled')" :value="0"></v-radio>
                </v-radio-group>
              </v-col>
            </v-row>
          </v-container>
        </v-form>
      </v-card-text>

      <v-card-actions>
        <!-- actions -->
        <v-spacer></v-spacer>
        <v-btn
          color="blue darken-1"
          @click="methods.closeLocaleForm"
          :disabled="localData.isSaving"
        >
          {{ $ndt('Cancel') }}
        </v-btn>
        <v-btn @click="methods.save" :loading="localData.isSaving" :disabled="localData.isSaving">
          {{ $ndt('Save') }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
