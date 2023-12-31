<!--
* Component: PassForm.vue
* Project: @nodite-light/admin-web
* Created Date: Su Dec 2023
* Author: Oscaner Miao
-----
* Last Modified: Sun Dec 31 2023
* Modified By: Oscaner Miao
-----
* Copyright (c) 2023 @nodite
-->

<script setup lang="ts">
import { toast } from 'vuetify-sonner';

import { IPasswordReset } from '@/api/admin/data-contracts';
import i18n from '@/plugins/i18n';
import { useUserStore } from '@/stores/modules/userStore';

const userStore = useUserStore();

const emit = defineEmits(['close-pass-form', 'saved']);

const props = defineProps({
  dialog: {
    type: Boolean,
    default: false,
  },
  username: {
    type: String,
  },
  userId: {
    type: Number,
  },
});

// local data.
const localData = ref({
  dialog: props.dialog,
  isFormValid: true,
  isSaving: false,
  showPassword: false,
  showConfirmPassword: false,
  error: false,
  errorMessage: '',
});

// form.
const refForm = ref();
const formData = ref({} as IPasswordReset);
const formRules = ref({
  password: [
    (v: string) =>
      !!v || i18n.global.t('common.form.required', [i18n.global.t('views.user.form.password')]),
    (v: string) =>
      (v && v.length <= 25) ||
      i18n.global.t('common.form.max', [i18n.global.t('views.user.form.password'), 25]),
  ],
  confirmPassword: [
    (v: string) =>
      !!v ||
      i18n.global.t('common.form.required', [i18n.global.t('views.user.form.confirmPassword')]),
    (v: string) =>
      v === formData.value.password ||
      i18n.global.t('common.form.notEq', [
        i18n.global.t('views.user.form.confirmPassword'),
        i18n.global.t('views.user.form.password'),
      ]),
  ],
});

watchEffect(() => {
  localData.value.dialog = props.dialog;
});

// methods.
const methods = {
  clearLocalData() {
    localData.value.dialog = false;
    localData.value.isSaving = false;
    localData.value.isFormValid = true;
    formData.value = {} as IPasswordReset;
  },
  closePassForm() {
    if (localData.value.isSaving) {
      toast.warning(i18n.global.t('common.form.saving'));
      return;
    }
    methods.clearLocalData();
    emit('close-pass-form');
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
      await userStore.resetPassword(
        props.userId as number,
        formData.value.password,
        formData.value.confirmPassword,
      );
    } finally {
      localData.value.isSaving = false;
    }

    toast.success(i18n.global.t('common.form.success'));

    methods.closePassForm();
    emit('saved');
  },
};
</script>

<template>
  <v-dialog
    v-model="localData.dialog"
    @click:outside="methods.closePassForm"
    :persistent="localData.isSaving"
    max-width="700"
  >
    <v-card>
      <v-card-title>
        <v-label>{{ $t('views.user.form.resetPassword', [props.username]) }}</v-label>
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
              <v-col>
                <!-- password -->
                <v-text-field
                  density="compact"
                  v-model="formData.password"
                  :rules="formRules.password"
                  :disabled="localData.isSaving"
                  :type="localData.showPassword ? 'text' : 'password'"
                  :append-icon="localData.showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                  @click:append="localData.showPassword = !localData.showPassword"
                  validate-on="blur"
                  :error="localData.error"
                  variant="outlined"
                >
                  <template v-slot:prepend-inner>
                    <v-label>{{ $t('views.user.form.password') }}:</v-label>
                  </template>
                </v-text-field>
              </v-col>
            </v-row>

            <v-row dense>
              <v-col>
                <!-- confirmPassword -->
                <v-text-field
                  density="compact"
                  v-model="formData.confirmPassword"
                  :rules="formRules.confirmPassword"
                  :disabled="localData.isSaving"
                  :type="localData.showConfirmPassword ? 'text' : 'password'"
                  :append-icon="localData.showConfirmPassword ? 'mdi-eye' : 'mdi-eye-off'"
                  @click:append="localData.showConfirmPassword = !localData.showConfirmPassword"
                  validate-on="blur"
                  :error="localData.error"
                  variant="outlined"
                >
                  <template v-slot:prepend-inner>
                    <v-label>{{ $t('views.user.form.confirmPassword') }}:</v-label>
                  </template>
                </v-text-field>
              </v-col>
            </v-row>
          </v-container>
        </v-form>
      </v-card-text>

      <v-card-actions>
        <!-- actions -->
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1" @click="methods.closePassForm" :disabled="localData.isSaving">
          {{ $t('common.form.cancel') }}
        </v-btn>
        <v-btn @click="methods.save" :loading="localData.isSaving" :disabled="localData.isSaving">
          {{ $t('common.form.save') }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
