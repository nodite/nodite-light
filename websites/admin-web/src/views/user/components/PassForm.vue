<script setup lang="ts">
import { toast } from 'vuetify-sonner';

import { IPasswordReset } from '@/api/admin/data-contracts';
import i18n from '@/plugins/i18n';
import { useUserStore } from '@/stores/modules/userStore';

const userStore = useUserStore();

const emit = defineEmits(['update:dialog', 'update:userId', 'save']);

const props = defineProps({
  dialog: {
    type: Boolean,
    default: false,
  },
  username: {
    type: String,
    default: '',
  },
  userId: {
    type: Number,
    required: true,
  },
});

const dialog = computed({
  get: () => props.dialog,
  set: (v) => emit('update:dialog', v),
});

const userId = computed({
  get: () => props.userId,
  set: (v) => emit('update:userId', v),
});

// local data.
const localData = ref({
  isFormValid: false,
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
    (v: string) => !!v || i18n.ndt('Password is required.'),
    (v: string) => (v && v.length <= 25) || i18n.ndt('Password must be less than 25 characters.'),
  ],
  confirmPassword: [
    (v: string) => !!v || i18n.ndt('Confirm Password is required.'),
    (v: string) =>
      v === formData.value.password || i18n.ndt('Confirm Password must be equal to Password.'),
  ],
});

// methods.
const methods = {
  closePassForm() {
    if (localData.value.isSaving) {
      toast.warning(i18n.ndt("It's saving, please wait a moment."));
      return;
    }
    dialog.value = false;
    userId.value = 0;
    formData.value = {} as IPasswordReset;
    localData.value.showPassword = false;
    localData.value.showConfirmPassword = false;
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

      toast.success(i18n.ndt('Saved successfully.'));
    } finally {
      localData.value.isSaving = false;
    }

    methods.closePassForm();

    emit('save');
  },
};
</script>

<template>
  <v-dialog
    v-model="dialog"
    @click:outside="methods.closePassForm"
    :persistent="localData.isSaving"
    max-width="700"
  >
    <v-card>
      <v-card-title>
        <v-label>{{ $ndt('Reset Password - {0}', [username]) }}</v-label>
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
                    <v-label>{{ $ndt('Password') }}:</v-label>
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
                    <v-label>{{ $ndt('Confirm Password') }}:</v-label>
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
