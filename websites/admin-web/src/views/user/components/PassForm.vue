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

// Local data.
const myRefStore = ref({
  isFormValid: false,
  isSaving: false,
  showPassword: false,
  showConfirmPassword: false,
  error: false,
  errorMessage: '',
});

// Form.
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

// Methods.
const methods = {
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
    userId.value = 0;
    formData.value = {} as IPasswordReset;
    myRefStore.value.showPassword = false;
    myRefStore.value.showConfirmPassword = false;
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
      await userStore.resetPassword(
        props.userId as number,
        formData.value.password,
        formData.value.confirmPassword,
      );

      toast.success(i18n.ndt('Saved successfully.'));
    } finally {
      myRefStore.value.isSaving = false;
    }

    methods.close();

    emit('save');
  },
};
</script>

<template>
  <v-dialog
    v-model="dialog"
    @click:outside="methods.close"
    :persistent="myRefStore.isSaving"
    max-width="550"
  >
    <v-card>
      <v-card-title>
        <v-label>{{ $ndt('Reset Password - {0}', [username]) }}</v-label>
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
              <v-col>
                <!-- password -->
                <v-text-field
                  density="compact"
                  v-model="formData.password"
                  :label="$ndt('Password')"
                  :rules="formRules.password"
                  :disabled="myRefStore.isSaving"
                  :type="myRefStore.showPassword ? 'text' : 'password'"
                  :append-icon="myRefStore.showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                  @click:append="myRefStore.showPassword = !myRefStore.showPassword"
                  validate-on="blur"
                  :error="myRefStore.error"
                  variant="outlined"
                ></v-text-field>
              </v-col>
            </v-row>

            <v-row dense>
              <v-col>
                <!-- confirmPassword -->
                <v-text-field
                  density="compact"
                  v-model="formData.confirmPassword"
                  :label="$ndt('Confirm Password')"
                  :rules="formRules.confirmPassword"
                  :disabled="myRefStore.isSaving"
                  :type="myRefStore.showConfirmPassword ? 'text' : 'password'"
                  :append-icon="myRefStore.showConfirmPassword ? 'mdi-eye' : 'mdi-eye-off'"
                  @click:append="myRefStore.showConfirmPassword = !myRefStore.showConfirmPassword"
                  validate-on="blur"
                  :error="myRefStore.error"
                  variant="outlined"
                ></v-text-field>
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
