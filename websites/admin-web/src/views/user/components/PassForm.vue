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
import lodash from 'lodash';
import { toast } from 'vuetify-sonner';

import { IPasswordReset } from '@/api/admin/data-contracts';
import { $ndt } from '@/plugins/i18n';
import { useUserStore } from '@/stores/modules/userStore';

const userStore = useUserStore();

const emit = defineEmits(['close', 'save']);

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
const defLocalData = {
  dialog: props.dialog,
  isFormValid: false,
  isSaving: false,
  showPassword: false,
  showConfirmPassword: false,
  error: false,
  errorMessage: '',
};

const localData = ref(lodash.cloneDeep(defLocalData));

// form.
const refForm = ref();
const formData = ref({} as IPasswordReset);
const formRules = ref({
  password: [
    (v: string) => !!v || $ndt('common.form.required', [$ndt('views.user.form.password')]),
    (v: string) =>
      (v && v.length <= 25) || $ndt('common.form.max', [$ndt('views.user.form.password'), 25]),
  ],
  confirmPassword: [
    (v: string) => !!v || $ndt('common.form.required', [$ndt('views.user.form.confirmPassword')]),
    (v: string) =>
      v === formData.value.password ||
      $ndt('common.form.notEq', [
        $ndt('views.user.form.confirmPassword'),
        $ndt('views.user.form.password'),
      ]),
  ],
});

watchEffect(() => {
  localData.value.dialog = props.dialog;
});

// methods.
const methods = {
  closePassForm() {
    if (localData.value.isSaving) {
      toast.warning($ndt('common.form.saving'));
      return;
    }
    localData.value = lodash.cloneDeep(defLocalData);
    formData.value = {} as IPasswordReset;
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
      await userStore.resetPassword(
        props.userId as number,
        formData.value.password,
        formData.value.confirmPassword,
      );
    } finally {
      localData.value.isSaving = false;
    }

    toast.success($ndt('Saved successfully.'));

    methods.closePassForm();
    emit('save');
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
        <v-label>{{ $ndt('views.user.form.resetPassword', [props.username]) }}</v-label>
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
                    <v-label>{{ $ndt('views.user.form.password') }}:</v-label>
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
                    <v-label>{{ $ndt('views.user.form.confirmPassword') }}:</v-label>
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
          {{ $ndt('Cancel') }}
        </v-btn>
        <v-btn @click="methods.save" :loading="localData.isSaving" :disabled="localData.isSaving">
          {{ $ndt('Save') }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
