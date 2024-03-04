<script setup lang="ts">
import { toast } from 'vuetify-sonner';

import { IDictGroup, IDictType } from '@/api/admin/data-contracts';
import DictElement from '@/components/form/DictElement.vue';
import TreeSelect from '@/components/form/TreeSelect.vue';
import i18n from '@/plugins/i18n';
import { useDictStore } from '@/stores/modules/dictStore';
import lodash from '@/utils/lodash';

const dictStore = useDictStore();

const emit = defineEmits(['update:dialog', 'update:dictKey', 'save']);

const props = defineProps({
  groups: {
    type: Array as PropType<IDictGroup[]>,
    default: () => [] as IDictGroup[],
  },
  dialog: {
    type: Boolean,
    default: false,
  },
  dictKey: {
    type: String,
    default: '',
  },
  dictGid: {
    type: String,
    default: '',
  },
});

const dialog = computed({
  get: () => props.dialog,
  set: (v) => emit('update:dialog', v),
});

const dictKey = computed({
  get: () => props.dictKey,
  set: (v) => emit('update:dictKey', v),
});

// Local data.
const myRefStore = ref({
  title: '',
  dictGidDialog: false,
  isFormValid: false,
  isSaving: false,
  error: false,
  errorMessage: '',
});

// Form.
const refForm = ref();
const formData = ref({} as IDictType);
const formRules = ref({
  dictName: [(v: string) => !!v || i18n.ndt('Dict Name is required.')],
  dictStyle: [(v: string) => !!v || i18n.ndt('Dict Style is required.')],
  dictKey: [
    (v: string) => !!v || i18n.ndt('Dict Key is required.'),
    (v: string) => lodash.snakeCase(v) === v || i18n.ndt('Dict Key must be snake_case.'),
    (v: string) => (v && v.length <= 50) || i18n.ndt('Dict Key must be less than 50 characters.'),
  ],
});

// Methods.
const methods = {
  // Load form data.
  async loadFormData() {
    formData.value = dictKey.value
      ? (await dictStore.queryType(dictKey.value)) || ({} as IDictType)
      : ({} as IDictType);

    myRefStore.value.title = dictKey.value
      ? i18n.ndt('Edit Dict Type - {0}', [formData.value.dictName])
      : i18n.ndt('New Dict Type');

    formData.value.dictGid ||= props.dictGid;
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
    dictKey.value = '';
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
      await (formData.value.dictKey
        ? dictStore.editType(formData.value)
        : dictStore.createType(formData.value));

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
        {{ $ndt('Create Dict Type') }}
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
              <!-- parent & order -->
              <v-col>
                <TreeSelect
                  v-model="formData.dictGid"
                  v-model:dialog="myRefStore.dictGidDialog"
                  :label="$ndt('Dict Group')"
                  :items="groups"
                  item-title="groupName"
                  item-title-context="dict.group"
                  item-value="groupId"
                  parent-value="parentId"
                  variant="outlined"
                  :error="myRefStore.error"
                  show-root
                  chips
                  clearable
                >
                  <template #chip="{ item }">
                    <v-chip>
                      {{ $ndt(item.raw.groupName, undefined, { context: 'dict.group' }) }}
                    </v-chip>
                  </template>
                </TreeSelect>
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
              <!-- dict style -->
              <v-col>
                <v-select
                  density="compact"
                  :label="$ndt('Dict Style')"
                  v-model="formData.dictStyle"
                  :items="['default']"
                  :rules="formRules.dictStyle"
                  validate-on="blur"
                  :error="myRefStore.error"
                  variant="outlined"
                  chips
                  clearable
                ></v-select>
              </v-col>
            </v-row>

            <v-row dense>
              <!-- dict name -->
              <v-col>
                <v-text-field
                  density="compact"
                  v-model="formData.dictName"
                  :rules="formRules.dictName"
                  :error="myRefStore.error"
                  :label="$ndt('Dict Name')"
                  validate-on="blur"
                  variant="outlined"
                ></v-text-field>
              </v-col>
            </v-row>

            <v-row dense>
              <!-- dict key -->
              <v-col>
                <v-text-field
                  density="compact"
                  v-model="formData.dictKey"
                  :label="$ndt('Dict Key')"
                  :rules="formRules.dictKey"
                  :error="myRefStore.error"
                  validate-on="blur"
                  variant="outlined"
                  :disabled="!!dictKey"
                ></v-text-field>
              </v-col>
            </v-row>

            <v-row dense>
              <!-- dict desc -->
              <v-textarea
                density="compact"
                v-model="formData.dictDesc"
                :label="$ndt('Dict Desc')"
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
