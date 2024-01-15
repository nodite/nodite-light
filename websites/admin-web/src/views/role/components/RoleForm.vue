<!--
* Component: RoleForm.vue
* Project: @nodite-light/admin-web
* Created Date: Th Jan 2024
* Author: Oscaner Miao
-----
* Last Modified: Thu Jan 04 2024
* Modified By: Oscaner Miao
-----
* Copyright (c) 2024 @nodite
-->

<script setup lang="ts">
import lodash from 'lodash';
import { toast } from 'vuetify-sonner';

import { IRole } from '@/api/admin/data-contracts';
import i18n from '@/plugins/i18n';
import { useRoleStore } from '@/stores/modules/roleStore';

const roleStore = useRoleStore();

const emit = defineEmits(['close', 'save']);

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

// local data.
const defLocalData = {
  dialog: props.dialog,
  isFormValid: false,
  isSaving: false,
  error: false,
  errorMessage: '',
};

const localData = ref(lodash.cloneDeep(defLocalData));

// form
const refForm = ref();
const formData = ref({} as IRole);
const formRules = ref({
  roleName: [
    (v: string) =>
      !!v || i18n.global.t('common.form.required', [i18n.global.t('views.role.form.roleName')]),
  ],
  roleKey: [
    (v: string) =>
      !!v || i18n.global.t('common.form.required', [i18n.global.t('views.role.form.roleKey')]),
    (v: string) =>
      (v && v.length <= 50) ||
      i18n.global.t('common.form.max', [i18n.global.t('views.role.form.roleKey'), 50]),
  ],
  orderNum: [],
  iKey: [],
  status: [],
});

// methods.
const methods = {
  async loadFormData() {
    let role = undefined;
    if (props.roleId > 0) {
      role = await roleStore.query(props.roleId);
    }
    formData.value = lodash.isUndefined(role) ? ({} as IRole) : role;
  },
  closeRoleForm() {
    if (localData.value.isSaving) {
      toast.warning(i18n.global.t('common.form.saving'));
      return;
    }
    localData.value = lodash.cloneDeep(defLocalData);
    formData.value = {} as IRole;
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
      await (formData.value.roleId > 0
        ? roleStore.edit(formData.value)
        : roleStore.create(formData.value));
    } finally {
      localData.value.isSaving = false;
    }

    toast.success(i18n.global.t('common.form.success'));

    methods.closeRoleForm();
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
    @click:outside="methods.closeRoleForm"
    :persistent="localData.isSaving"
    max-width="750"
  >
    <template v-slot:activator="{ props }">
      <v-btn v-bind="props" prepend-icon="mdi-creation" variant="tonal" density="comfortable">
        {{ $t('common.form.create', [$t('views.role.title')]) }}
      </v-btn>
    </template>

    <v-card density="compact" elevation="8" rounded="lg">
      <v-card-title>
        <v-label>
          {{
            props.roleId > 0
              ? $t('common.form.editHeader', [$t('views.role.title'), formData.roleName])
              : $t('common.form.newHeader', [$t('views.role.title')])
          }}
        </v-label>
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
              <!-- roleName -->
              <v-col>
                <v-text-field
                  density="compact"
                  v-model="formData.roleName"
                  :rules="formRules.roleName"
                  validate-on="blur"
                  :error="localData.error"
                  variant="outlined"
                >
                  <template v-slot:prepend-inner>
                    <v-label>{{ $t('views.role.form.roleName') }}:</v-label>
                  </template>
                </v-text-field>
              </v-col>
            </v-row>

            <v-row dense>
              <!-- roleKey -->
              <v-col>
                <v-text-field
                  density="compact"
                  v-model="formData.roleKey"
                  :rules="formRules.roleKey"
                  :disabled="!!formData.roleId"
                  validate-on="blur"
                  :error="localData.error"
                  variant="outlined"
                >
                  <template v-slot:prepend-inner>
                    <v-label>{{ $t('views.role.form.roleKey') }}:</v-label>
                  </template>
                </v-text-field>
              </v-col>
            </v-row>

            <v-row dense>
              <!-- iKey & orderNum -->
              <v-col>
                <v-text-field
                  density="compact"
                  v-model="formData.iKey"
                  variant="outlined"
                  :hint="$t('views.role.form.iKeyHint')"
                  :rules="formRules.iKey"
                  validate-on="blur"
                  :error="localData.error"
                >
                  <template v-slot:prepend-inner>
                    <v-label>{{ $t('views.role.form.iKey') }}:</v-label>
                  </template>
                </v-text-field>
              </v-col>
              <v-col cols="4">
                <v-text-field
                  type="number"
                  density="compact"
                  :label="$t('views.role.form.orderNum')"
                  v-model="formData.orderNum"
                  :rules="formRules.orderNum"
                  validate-on="blur"
                  :error="localData.error"
                  variant="outlined"
                ></v-text-field>
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
                  :disabled="formData.roleId === 1"
                  inline
                >
                  <template v-slot:prepend>
                    <v-label> {{ $t('common.form.status', [$t('views.role.title')]) }}: </v-label>
                  </template>

                  <v-radio :label="$t('common.status.enabled')" :value="1"></v-radio>
                  <v-radio :label="$t('common.status.disabled')" :value="0"></v-radio>
                </v-radio-group>
              </v-col>
              <v-spacer></v-spacer>
            </v-row>
          </v-container>
        </v-form>
      </v-card-text>

      <v-card-actions>
        <!-- actions -->
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1" @click="methods.closeRoleForm" :disabled="localData.isSaving">
          {{ $t('common.form.cancel') }}
        </v-btn>
        <v-btn @click="methods.save" :loading="localData.isSaving" :disabled="localData.isSaving">
          {{ $t('common.form.save') }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
