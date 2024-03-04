<script setup lang="ts">
import { toast } from 'vuetify-sonner';

import { IDictItem, IDictType } from '@/api/admin/data-contracts';
import DictElement from '@/components/form/DictElement.vue';
import i18n from '@/plugins/i18n';
import { useDictStore } from '@/stores/modules/dictStore';
import lodash from '@/utils/lodash';

const dictStore = useDictStore();

const emit = defineEmits(['update:dialog', 'update:itemId', 'save']);

const props = defineProps({
  dialog: {
    type: Boolean,
    default: false,
  },
  itemId: {
    type: Number,
    default: 0,
  },
  dictType: {
    type: Object as PropType<IDictType>,
    default: () => ({}) as IDictType,
  },
});

const dialog = computed({
  get: () => props.dialog,
  set: (v) => emit('update:dialog', v),
});

const itemId = computed({
  get: () => props.itemId,
  set: (v) => emit('update:itemId', v),
});

// Local data.
const myRefStore = ref({
  title: '',
  isFormValid: false,
  isSaving: false,
  error: false,
  errorMessage: '',
});

// Form.
const refForm = ref();
const formData = ref({} as IDictItem);
const formRules = ref({
  dictKey: [(v: string) => !!v || i18n.ndt('Dict Key is required.')],
  itemKey: [
    (v: string) => !!v || i18n.ndt('Item Key is required.', undefined, { context: 'dict.item' }),
    (v: string) =>
      v.length <= 50 ||
      i18n.ndt('Item Key must be less than 50 characters.', undefined, { context: 'dict.item' }),
    (v: string) =>
      lodash.snakeCase(v) === v ||
      i18n.ndt('Item Key must be snake_case.', undefined, { context: 'dict.item' }),
  ],
});

// Methods.
const methods = {
  // Load from data.
  async loadFormData() {
    formData.value = itemId.value
      ? (await dictStore.queryItem(itemId.value)) || ({} as IDictItem)
      : ({ dictKey: props.dictType.dictKey } as IDictItem);

    myRefStore.value.title = itemId.value
      ? i18n.ndt('Edit Dict Item - {0}', [formData.value.itemKey])
      : i18n.ndt('New Dict Item');

    formData.value.dictKey ||= props.dictType.dictKey;
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
    itemId.value = 0;
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
      await (formData.value.itemId
        ? dictStore.editItem(formData.value)
        : dictStore.createItem(formData.value));

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
        {{ $ndt('Create Dict Item') }}
      </v-btn>
    </template>

    <v-card density="compact" elevation="8" rounded="lg">
      <v-card-title>
        <v-label>{{ myRefStore.title }}</v-label>
        <v-spacer></v-spacer>
        <v-btn icon @click="methods.close" density="compact" variant="text">
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
              <!-- dict key -->
              <v-col>
                <v-select
                  density="compact"
                  :label="$ndt('Dict Key')"
                  v-model="formData.dictKey"
                  :items="[
                    {
                      value: props.dictType.dictKey,
                      title: $ndt(props.dictType.dictName, undefined, { context: 'dict.type' }),
                    },
                  ]"
                  :rules="formRules.dictKey"
                  validate-on="blur"
                  :error="myRefStore.error"
                  variant="outlined"
                  chips
                  readonly
                ></v-select>
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
              <!-- item key -->
              <v-col>
                <v-text-field
                  density="compact"
                  v-model="formData.itemKey"
                  :rules="formRules.itemKey"
                  :error="myRefStore.error"
                  :label="$ndt('Item Key', undefined, { context: 'dict.item' })"
                  validate-on="blur"
                  variant="outlined"
                ></v-text-field>
              </v-col>
            </v-row>

            <v-row dense>
              <!-- item value -->
              <v-col>
                <v-text-field
                  density="compact"
                  v-model="formData.itemValue"
                  :error="myRefStore.error"
                  :label="$ndt('Item Value', undefined, { context: 'dict.item' })"
                  validate-on="blur"
                  variant="outlined"
                ></v-text-field>
              </v-col>
            </v-row>

            <v-row dense>
              <!-- dict desc -->
              <v-textarea
                density="compact"
                v-model="formData.itemDesc"
                :label="$ndt('Item Desc', undefined, { context: 'dict.item' })"
                :error="myRefStore.error"
                validate-on="blur"
                variant="outlined"
              ></v-textarea>
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
