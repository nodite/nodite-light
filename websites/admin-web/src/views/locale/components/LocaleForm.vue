<script setup lang="ts">
import { IconPicker } from '@nodite-light/vuetify-icon-picker';
import { toast } from 'vuetify-sonner';

import { ILocale } from '@/api/admin/data-contracts';
import DictElement from '@/components/form/DictElement.vue';
import i18n from '@/plugins/i18n';
import { useLocaleStore } from '@/stores/modules/localeStore';

const localeStore = useLocaleStore();

const emit = defineEmits(['update:dialog', 'update:localeId', 'save']);

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

const dialog = computed({
  get: () => props.dialog,
  set: (v) => emit('update:dialog', v),
});

const localeId = computed({
  get: () => props.localeId,
  set: (v) => emit('update:localeId', v),
});

// Local data.
const myRefStore = ref({
  title: '',
  iconDialog: false,
  isFormValid: false,
  isSaving: false,
  error: false,
  errorMessage: '',
});

// From.
const refForm = ref();
const formData = ref({} as ILocale);
const formRules = ref({
  langcode: [(v: string) => !!v || i18n.ndt('Langcode is required.')],
});

// Methods.
const methods = {
  // Load form data.
  async loadFormData() {
    formData.value = localeId.value
      ? (await localeStore.queryLocale(localeId.value)) || ({} as ILocale)
      : ({} as ILocale);

    myRefStore.value.title = localeId.value
      ? i18n.ndt('Edit Locale - {0}', [formData.value.label])
      : i18n.ndt('New Locale');
  },
  // Reset errors.
  resetErrors() {
    myRefStore.value.error = false;
    myRefStore.value.errorMessage = '';
  },
  // Close.
  close() {
    if (myRefStore.value.isSaving) {
      toast.warning(i18n.ndt("It's saving, please wait a moment."));
      return;
    }
    dialog.value = false;
    localeId.value = 0;
  },
  // Save.
  async save() {
    myRefStore.value.isSaving = true;

    const { valid } = await refForm.value.validate();

    if (!valid || !myRefStore.value.isFormValid) {
      myRefStore.value.isSaving = false;
      return;
    }

    try {
      await (props.localeId > 0
        ? localeStore.editLocale(formData.value)
        : localeStore.createLocale(formData.value));

      localeStore.listAvailableLocales(true);

      toast.success(i18n.ndt('Saved successfully.'));
    } finally {
      myRefStore.value.isSaving = false;
    }

    methods.close();

    emit('save');
  },
};

// Lifecycle.
watch(
  () => props.dialog,
  (v) => v && methods.loadFormData(),
);
</script>

<template>
  <v-dialog
    v-model="dialog"
    @click:outside="methods.close"
    :persistent="myRefStore.isSaving"
    max-width="550"
  >
    <template #activator="{ props }">
      <v-btn v-bind="props" prepend-icon="mdi-creation" variant="tonal" density="comfortable">
        {{ $ndt('Create Locale') }}
      </v-btn>
    </template>

    <v-card density="compact" elevation="8" rounded="lg">
      <v-card-title>
        <v-label>{{ myRefStore.title }}</v-label>
        <v-spacer></v-spacer>
        <v-btn icon @click="methods.close" density="compact">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>

      <v-card-text>
        <v-form
          ref="refForm"
          v-model="myRefStore.isFormValid"
          :disabled="myRefStore.isSaving"
          lazy-validation
        >
          <v-container class="px-10 pb-0">
            <v-row dense>
              <!-- label & orderNum -->
              <v-col>
                <v-text-field
                  density="compact"
                  v-model="formData.label"
                  :label="$ndt('Label')"
                  validate-on="blur"
                  :error="myRefStore.error"
                  variant="outlined"
                ></v-text-field>
              </v-col>
              <v-col cols="4">
                <v-text-field
                  type="number"
                  density="compact"
                  :label="$ndt('Order')"
                  v-model="formData.orderNum"
                  validate-on="blur"
                  :error="myRefStore.error"
                  variant="outlined"
                ></v-text-field>
              </v-col>
            </v-row>

            <v-row dense>
              <!-- icon -->
              <v-col>
                <IconPicker
                  v-model="formData.icon"
                  v-model:dialog="myRefStore.iconDialog"
                  :label="$ndt('Icon')"
                  v-model:error="myRefStore.error"
                ></IconPicker>
              </v-col>
            </v-row>

            <v-row dense>
              <!-- langcode & momentCode -->
              <v-col>
                <DictElement
                  component="VAutocomplete"
                  dict-key="langcode"
                  v-model="formData.langcode"
                  :component-props="{
                    density: 'compact',
                    variant: 'outlined',
                    error: myRefStore.error,
                    rules: formRules.langcode,
                  }"
                ></DictElement>
              </v-col>
              <v-col>
                <v-text-field
                  density="compact"
                  :label="$ndt('Moment Code')"
                  v-model="formData.momentCode"
                  validate-on="blur"
                  :error="myRefStore.error"
                  variant="outlined"
                ></v-text-field>
              </v-col>
            </v-row>

            <v-row dense>
              <!-- status -->
              <v-col>
                <DictElement
                  component="VRadioGroup"
                  dict-key="status"
                  v-model="formData.status"
                  :component-props="{
                    validateOn: 'blur',
                    error: myRefStore.error,
                    inline: true,
                    hideDetails: true,
                  }"
                  :show-label="false"
                  :show-prepend-label="true"
                ></DictElement>
              </v-col>
            </v-row>
          </v-container>
        </v-form>
      </v-card-text>

      <v-card-actions>
        <!-- actions -->
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1" @click="methods.close" :disabled="myRefStore.isSaving">
          {{ $ndt('Cancel') }}
        </v-btn>
        <v-btn @click="methods.save" :loading="myRefStore.isSaving" :disabled="myRefStore.isSaving">
          {{ $ndt('Save') }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
