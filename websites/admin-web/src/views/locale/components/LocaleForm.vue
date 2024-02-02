<script setup lang="ts">
import { IconPicker } from '@nodite-light/vuetify-icon-picker';
import { LanguageSelector } from '@nodite-light/vuetify-language-selector';
import { toast } from 'vuetify-sonner';

import { ILocale } from '@/api/admin/data-contracts';
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
  label: [],
  langcode: [(v: string) => !!v || i18n.ndt('Langcode is required.')],
  momentCode: [],
  icon: [],
  orderNum: [],
  isDefault: [],
  status: [],
});

// Methods.
const methods = {
  // Load form data.
  async loadFormData() {
    if (!localeId.value) return;
    formData.value = localeId.value
      ? (await localeStore.queryLocale(localeId.value)) || ({} as ILocale)
      : ({} as ILocale);
  },
  // Close locale form.
  closeLocaleForm() {
    if (myRefStore.value.isSaving) {
      toast.warning(i18n.ndt("It's saving, please wait a moment."));
      return;
    }
    dialog.value = false;
    localeId.value = 0;
  },
  // Reset errors.
  resetErrors() {
    myRefStore.value.error = false;
    myRefStore.value.errorMessage = '';
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

    methods.closeLocaleForm();

    emit('save');
  },
};

watchEffect(() => {
  methods.loadFormData();
});
</script>

<template>
  <v-dialog
    v-model="dialog"
    @click:outside="methods.closeLocaleForm"
    :persistent="myRefStore.isSaving"
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
                  :rules="formRules.label"
                  validate-on="blur"
                  :error="myRefStore.error"
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
                <LanguageSelector
                  v-model="formData.langcode"
                  density="compact"
                  v-model:error="myRefStore.error"
                  :rules="formRules.langcode"
                  :show-code="true"
                >
                  <template v-slot:prepend-inner>
                    <v-label> {{ $ndt('Langcode') }}: </v-label>
                  </template>
                </LanguageSelector>
              </v-col>
              <v-col>
                <v-text-field
                  density="compact"
                  v-model="formData.momentCode"
                  :rules="formRules.momentCode"
                  validate-on="blur"
                  :error="myRefStore.error"
                  variant="outlined"
                >
                  <template v-slot:prepend-inner>
                    <v-label> {{ $ndt('Moment Code') }}: </v-label>
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
                  :error="myRefStore.error"
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
          :disabled="myRefStore.isSaving"
        >
          {{ $ndt('Cancel') }}
        </v-btn>
        <v-btn @click="methods.save" :loading="myRefStore.isSaving" :disabled="myRefStore.isSaving">
          {{ $ndt('Save') }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
