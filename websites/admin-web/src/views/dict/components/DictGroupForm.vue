<script setup lang="ts">
import lodash from 'lodash';
import { toast } from 'vuetify-sonner';

import { IDictGroup } from '@/api/admin/data-contracts';
import DictElement from '@/components/form/DictElement.vue';
import TreeSelect from '@/components/form/TreeSelect.vue';
import i18n from '@/plugins/i18n';
import { useDictStore } from '@/stores/modules/dictStore';

const dictStore = useDictStore();

const emit = defineEmits(['update:dialog', 'update:groupId', 'save']);

const props = defineProps({
  groups: {
    type: Array as PropType<IDictGroup[]>,
    default: () => [] as IDictGroup[],
  },
  dialog: {
    type: Boolean,
    default: false,
  },
  groupId: {
    type: String,
    default: '',
  },
  parentId: {
    type: String,
    default: undefined,
  },
});

const dialog = computed({
  get: () => props.dialog,
  set: (v) => emit('update:dialog', v),
});

const groupId = computed({
  get: () => props.groupId,
  set: (v) => emit('update:groupId', v),
});

// Local data.
const myRefStore = ref({
  title: '',
  parentIdDialog: false,
  isFormValid: true,
  isSaving: false,
  error: false,
  errorMessages: '',
});

// Form.
const refForm = ref();
const formData = ref({} as IDictGroup);
const formRules = ref({
  parentId: [
    (v: string) => lodash.isString(v) || (!v && i18n.ndt('Parent Dict Group is required.')),
    (v: string) =>
      !groupId.value || v !== groupId.value || i18n.ndt('Parent Dict Group cannot be itself.'),
  ],
  groupName: [(v: string) => !!v || i18n.ndt('Group Name is required.')],
  groupKey: [
    (v: string) => !!v || i18n.ndt('Group Key is required.'),
    (v: string) => lodash.snakeCase(v) === v || i18n.ndt('Group Key must be snake_case.'),
    (v: string) => (v && v.length <= 50) || i18n.ndt('Group Key must be less than 50 characters.'),
  ],
});

// Methods.
const methods = {
  async loadFormData() {
    formData.value = groupId.value
      ? (await dictStore.queryGroup(groupId.value)) || ({} as IDictGroup)
      : ({} as IDictGroup);

    myRefStore.value.title = groupId.value
      ? i18n.ndt('Edit Dict Group - {0}', [formData.value.groupName])
      : i18n.ndt('New Dict Group');

    formData.value.parentId ||= props.parentId || '';
  },
  // Reset errors.
  resetErrors() {
    myRefStore.value.error = false;
    myRefStore.value.errorMessages = '';
  },
  // Close.
  close() {
    if (myRefStore.value.isSaving) {
      toast.warning(i18n.ndt("It's saving, please wait a moment."));
      return;
    }
    dialog.value = false;
    groupId.value = '';
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
      await (formData.value.groupId
        ? dictStore.editGroup(formData.value)
        : dictStore.createGroup(formData.value));
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
    max-width="500"
  >
    <v-card density="compact" elevation="8" rounded="lg">
      <v-card-title class="pt-4">
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
                  v-model="formData.parentId"
                  v-model:dialog="myRefStore.parentIdDialog"
                  :label="$ndt('Parent Group')"
                  :items="groups"
                  item-title="groupName"
                  item-title-context="dict.group"
                  item-value="groupId"
                  parent-value="parentId"
                  variant="outlined"
                  :rules="formRules.parentId"
                  :error="myRefStore.error"
                  :disabled-items="groupId ? [formData.groupId] : []"
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
              <!-- group name -->
              <v-col>
                <v-text-field
                  density="compact"
                  v-model="formData.groupName"
                  :rules="formRules.groupName"
                  :error="myRefStore.error"
                  :label="$ndt('Group Name')"
                  validate-on="blur"
                  variant="outlined"
                ></v-text-field>
              </v-col>
            </v-row>

            <v-row dense>
              <!-- group key -->
              <v-col>
                <v-text-field
                  density="compact"
                  v-model="formData.groupKey"
                  :rules="formRules.groupKey"
                  :error="myRefStore.error"
                  :label="$ndt('Group Key')"
                  validate-on="blur"
                  variant="outlined"
                  :disabled="!!groupId"
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
