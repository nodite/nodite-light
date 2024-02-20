<script setup lang="ts">
import { toast } from 'vuetify-sonner';

import { IUser } from '@/api/admin/data-contracts';
import i18n from '@/plugins/i18n';
import { useUserStore } from '@/stores/modules/userStore';

const userStore = useUserStore();

const emit = defineEmits(['update:dialog', 'update:userId', 'save']);

const props = defineProps({
  dialog: {
    type: Boolean,
    default: false,
  },
  userId: {
    type: Number,
    default: 0,
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
  title: '',
  isFormValid: true,
  isSaving: false,
  error: false,
  errorMessage: '',
});

// Form.
const refForm = ref();
const formData = ref({} as IUser);
const formRules = ref({
  username: [
    (v: string) => !!v || i18n.ndt('Username is required.'),
    (v: string) => (v && v.length <= 25) || i18n.ndt('Username must be less than 25 characters.'),
  ],
  nickname: [
    (v: string) => !v || v.length <= 32 || i18n.ndt('Nickname must be less than 32 characters.'),
  ],
  email: [
    (v: string) => !v || v.length <= 50 || i18n.ndt('Email must be less than 50 characters.'),
    (v: string) => !v || /.+@.+\..+/.test(v) || i18n.ndt('Please enter a valid email address.'),
  ],
  phone: [],
  sex: [],
  password: [
    (v: string) => !!v || i18n.ndt('Password is required.'),
    (v: string) =>
      formData.value.userId > 0 ||
      (v && v.length <= 25) ||
      i18n.ndt('Password must be less than 25 characters.'),
  ],
  status: [],
});

// Methods.
const methods = {
  // Load form data.
  async loadFormData() {
    formData.value = userId.value
      ? (await userStore.query(userId.value)) || ({} as IUser)
      : ({} as IUser);

    myRefStore.value.title = userId.value
      ? i18n.ndt('Edit User - {0}', [formData.value.username])
      : i18n.ndt('New User');
  },
  // Close user form.
  closeUserForm() {
    if (myRefStore.value.isSaving) {
      toast.warning(i18n.ndt("It's saving, please wait a moment."));
      return;
    }
    dialog.value = false;
    userId.value = 0;
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
      await (formData.value.userId > 0
        ? userStore.edit(formData.value)
        : userStore.create(formData.value));

      toast.success(i18n.ndt('Saved successfully.'));
    } finally {
      myRefStore.value.isSaving = false;
    }

    methods.closeUserForm();

    emit('save');
  },
};

// Lifecycle.
watchEffect(async () => {
  await methods.loadFormData();
});
</script>

<template>
  <v-dialog
    v-model="dialog"
    @click:outside="methods.closeUserForm"
    :persistent="myRefStore.isSaving"
    max-width="750"
  >
    <template v-slot:activator="{ props }">
      <v-btn v-bind="props" prepend-icon="mdi-creation" variant="tonal" density="comfortable">
        {{ $ndt('Create User') }}
      </v-btn>
    </template>

    <v-card density="compact" elevation="8" rounded="lg">
      <v-card-title>
        <v-label>{{ myRefStore.title }}</v-label>
        <v-spacer></v-spacer>
        <v-btn icon @click="methods.closeUserForm" density="compact" variant="text">
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
              <!-- username & nickname -->
              <v-col>
                <v-text-field
                  density="compact"
                  v-model="formData.username"
                  :rules="formRules.username"
                  :disabled="!!formData.userId"
                  validate-on="blur"
                  :error="myRefStore.error"
                  variant="outlined"
                >
                  <template v-slot:prepend-inner>
                    <v-label>{{ $ndt('Username') }}:</v-label>
                  </template>
                </v-text-field>
              </v-col>

              <v-col>
                <v-text-field
                  density="compact"
                  v-model="formData.nickname"
                  :rules="formRules.nickname"
                  validate-on="blur"
                  :error="myRefStore.error"
                  variant="outlined"
                >
                  <template v-slot:prepend-inner>
                    <v-label>{{ $ndt('Nickname') }}:</v-label>
                  </template>
                </v-text-field>
              </v-col>
            </v-row>

            <v-row dense>
              <!-- email -->
              <v-col>
                <v-text-field
                  v-model="formData.email"
                  :rules="formRules.email"
                  validate-on="blur"
                  :error="myRefStore.error"
                  density="compact"
                  variant="outlined"
                >
                  <template v-slot:prepend-inner>
                    <v-label>{{ $ndt('Email') }}:</v-label>
                  </template>
                  <template v-slot:append-inner>
                    <v-icon>mdi-email</v-icon>
                  </template>
                </v-text-field>
              </v-col>
            </v-row>

            <v-row dense>
              <!-- phone -->
              <v-col>
                <v-text-field
                  v-model="formData.phone"
                  :rules="formRules.phone"
                  validate-on="blur"
                  :error="myRefStore.error"
                  density="compact"
                  variant="outlined"
                >
                  <template v-slot:prepend-inner>
                    <v-label>{{ $ndt('Phone') }}:</v-label>
                  </template>
                  <template v-slot:append-inner>
                    <v-icon>mdi-cellphone</v-icon>
                  </template>
                </v-text-field>
              </v-col>
            </v-row>

            <v-row dense>
              <!-- password -->
              <v-col>
                <v-text-field
                  v-model="formData.password"
                  :rules="formRules.password"
                  validate-on="blur"
                  :error="myRefStore.error"
                  :disabled="!!formData.userId"
                  type="password"
                  density="compact"
                  variant="outlined"
                >
                  <template v-slot:prepend-inner>
                    <v-label>{{ $ndt('Password') }}:</v-label>
                  </template>
                  <template v-slot:append-inner>
                    <v-icon>mdi-lock</v-icon>
                  </template>
                </v-text-field>
              </v-col>
            </v-row>

            <v-row dense>
              <!-- sex & status -->
              <v-col>
                <v-radio-group
                  v-model="formData.sex"
                  :rules="formRules.sex"
                  validate-on="blur"
                  :error="myRefStore.error"
                  inline
                >
                  <template v-slot:prepend>
                    <v-label>{{ $ndt('Sex') }}:</v-label>
                  </template>
                  <v-radio :label="$ndt('Secret')" :value="0"></v-radio>
                  <v-radio :label="$ndt('Male')" :value="1"></v-radio>
                  <v-radio :label="$ndt('Female')" :value="2"></v-radio>
                </v-radio-group>
              </v-col>
              <v-col cols="5">
                <v-radio-group
                  v-model="formData.status"
                  :rules="formRules.status"
                  validate-on="blur"
                  :error="myRefStore.error"
                  :disabled="formData.userId === 1"
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
        <v-btn color="blue darken-1" @click="methods.closeUserForm" :disabled="myRefStore.isSaving">
          {{ $ndt('Cancel') }}
        </v-btn>
        <v-btn @click="methods.save" :loading="myRefStore.isSaving" :disabled="myRefStore.isSaving">
          {{ $ndt('Save') }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
