<script setup lang="ts">
import lodash from 'lodash';
import { toast } from 'vuetify-sonner';

import { IRole } from '@/api/admin/data-contracts';
import DictElement from '@/components/form/DictElement.vue';
import i18n from '@/plugins/i18n';
import { useRoleStore } from '@/stores/modules/roleStore';

const roleStore = useRoleStore();

const emit = defineEmits(['update:dialog', 'update:roleId', 'save']);

const props = defineProps({
  dialog: {
    type: Boolean,
    default: false,
  },
  roleId: {
    type: Number,
    default: 0,
  },
});

const dialog = computed({
  get: () => props.dialog,
  set: (v) => emit('update:dialog', v),
});

const roleId = computed({
  get: () => props.roleId,
  set: (v) => emit('update:roleId', v),
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
const formData = ref({} as IRole);
const formRules = ref({
  roleName: [(v: string) => !!v || i18n.ndt('Role Name is required.')],
  roleKey: [
    (v: string) => !!v || i18n.ndt('Role Key is required.'),
    (v: string) => lodash.snakeCase(v) === v || i18n.ndt('Role Key must be snake_case.'),
    (v: string) => (v && v.length <= 50) || i18n.ndt('Role Key must be less than 50 characters.'),
  ],
});

// Methods.
const methods = {
  // Load form data.
  async loadFormData() {
    formData.value = roleId.value
      ? (await roleStore.query(roleId.value)) || ({} as IRole)
      : ({} as IRole);

    myRefStore.value.title = roleId.value
      ? i18n.ndt('Edit Role - {0}', [formData.value.roleName])
      : i18n.ndt('New Role');
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
    roleId.value = 0;
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
      await (formData.value.roleId > 0
        ? roleStore.edit(formData.value)
        : roleStore.create(formData.value));

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
        {{ $ndt('Create Role') }}
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
              <!-- roleName & orderNum -->
              <v-col>
                <v-text-field
                  density="compact"
                  v-model="formData.roleName"
                  :label="$ndt('Role Name')"
                  :rules="formRules.roleName"
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
              <!-- roleKey -->
              <v-col>
                <v-text-field
                  density="compact"
                  v-model="formData.roleKey"
                  :label="$ndt('Role Key')"
                  :rules="formRules.roleKey"
                  :disabled="!!formData.roleId"
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
                    disabled: formData.roleId === 1,
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
