<!--
* Component: UserForm.vue
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

import { IUser } from '@/api/admin/data-contracts';
import i18n from '@/plugins/i18n';
import { useUserStore } from '@/stores/modules/userStore';

const userStore = useUserStore();

const emit = defineEmits(['close', 'save']);

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

// static data.
const staticData = ref({
  sex: [] as { title: string; value: number }[],
});

// local data.
const defLocalData = {
  dialog: props.dialog,
  isFormValid: true,
  isSaving: false,
  error: false,
  errorMessage: '',
};

const localData = ref(lodash.cloneDeep(defLocalData));

// form.
const refForm = ref();
const formData = ref({} as IUser);
const formRules = ref({
  username: [
    (v: string) =>
      !!v || i18n.global.t('common.form.required', [i18n.global.t('views.user.form.username')]),
    (v: string) =>
      (v && v.length <= 25) ||
      i18n.global.t('common.form.max', [i18n.global.t('views.user.form.username'), 25]),
  ],
  nickname: [
    (v: string) =>
      !v ||
      v.length <= 32 ||
      i18n.global.t('common.form.max', [i18n.global.t('views.user.form.nickname'), 32]),
  ],
  email: [
    (v: string) =>
      !v ||
      v.length <= 50 ||
      i18n.global.t('common.form.max', [i18n.global.t('views.user.form.email'), 50]),
    (v: string) => !v || /.+@.+\..+/.test(v) || i18n.global.t('common.form.email'),
  ],
  phone: [],
  sex: [(v: number) => [0, 1, 2].includes(v) || i18n.global.t('common.form.invalid')],
  password: [
    (v: string) =>
      !!v || i18n.global.t('common.form.required', [i18n.global.t('views.user.form.password')]),
    (v: string) =>
      formData.value.userId > 0 ||
      (v && v.length <= 25) ||
      i18n.global.t('common.form.max', [i18n.global.t('views.user.form.password'), 25]),
  ],
  status: [(v: number) => [0, 1].includes(v) || i18n.global.t('common.form.invalid')],
});

// methods.
const methods = {
  async fillFormData() {
    let user = undefined;
    if (props.userId > 0) {
      user = await userStore.query(props.userId);
    }
    formData.value = lodash.isUndefined(user) ? ({} as IUser) : user;
  },
  closeUserForm() {
    if (localData.value.isSaving) {
      toast.warning(i18n.global.t('common.form.saving'));
      return;
    }
    localData.value = lodash.cloneDeep(defLocalData);
    formData.value = {} as IUser;
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
      await (formData.value.userId > 0
        ? userStore.edit(formData.value)
        : userStore.create(formData.value));
    } finally {
      localData.value.isSaving = false;
    }

    toast.success(i18n.global.t('common.form.success'));

    methods.closeUserForm();
    emit('save');
  },
};

watchEffect(() => {
  // watch i18n.
  staticData.value.sex = [
    { value: 0, title: i18n.global.t('views.user.sex.secret') },
    { value: 1, title: i18n.global.t('views.user.sec.male') },
    { value: 2, title: i18n.global.t('views.user.sex.female') },
  ];

  localData.value.dialog = props.dialog;

  methods.fillFormData();
});
</script>

<template>
  <v-dialog
    v-model="localData.dialog"
    @click:outside="methods.closeUserForm"
    :persistent="localData.isSaving"
    max-width="750"
  >
    <template v-slot:activator="{ props }">
      <v-btn v-bind="props" prepend-icon="mdi-creation" variant="tonal" density="comfortable">
        {{ $t('common.form.create', [$t('views.user.form.title')]) }}
      </v-btn>
    </template>

    <v-card density="compact" elevation="8" rounded="lg">
      <v-card-title>
        <v-label>
          {{
            props.userId > 0
              ? $t('common.form.editHeader', [$t('views.user.form.title'), formData.username])
              : $t('common.form.newHeader', [$t('views.user.form.title')])
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
              <!-- username & nickname -->
              <v-col>
                <v-text-field
                  density="compact"
                  v-model="formData.username"
                  :rules="formRules.username"
                  :disabled="!!formData.userId"
                  validate-on="blur"
                  :error="localData.error"
                  variant="outlined"
                >
                  <template v-slot:prepend-inner>
                    <v-label>{{ $t('views.user.form.username') }}:</v-label>
                  </template>
                </v-text-field>
              </v-col>

              <v-col>
                <v-text-field
                  density="compact"
                  v-model="formData.nickname"
                  :rules="formRules.nickname"
                  validate-on="blur"
                  :error="localData.error"
                  variant="outlined"
                >
                  <template v-slot:prepend-inner>
                    <v-label>{{ $t('views.user.form.nickname') }}:</v-label>
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
                  :error="localData.error"
                  density="compact"
                  variant="outlined"
                >
                  <template v-slot:prepend-inner>
                    <v-label>{{ $t('views.user.form.email') }}:</v-label>
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
                  :error="localData.error"
                  density="compact"
                  variant="outlined"
                >
                  <template v-slot:prepend-inner>
                    <v-label>{{ $t('views.user.form.phone') }}:</v-label>
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
                  :error="localData.error"
                  :disabled="!!formData.userId"
                  type="password"
                  density="compact"
                  variant="outlined"
                >
                  <template v-slot:prepend-inner>
                    <v-label>{{ $t('views.user.form.password') }}:</v-label>
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
                  :error="localData.error"
                  inline
                >
                  <template v-slot:prepend>
                    <v-label>{{ $t('views.user.form.sex') }}:</v-label>
                  </template>
                  <v-radio :label="$t('views.user.sex.secret')" :value="0"></v-radio>
                  <v-radio :label="$t('views.user.sex.male')" :value="1"></v-radio>
                  <v-radio :label="$t('views.user.sex.female')" :value="2"></v-radio>
                </v-radio-group>
              </v-col>
              <v-col cols="5">
                <v-radio-group
                  v-model="formData.status"
                  :rules="formRules.status"
                  validate-on="blur"
                  :error="localData.error"
                  inline
                >
                  <template v-slot:prepend>
                    <v-label>
                      {{ $t('common.form.status', [$t('views.user.form.title')]) }}:
                    </v-label>
                  </template>
                  <v-radio :label="$t('common.status.enabled')" :value="1"></v-radio>
                  <v-radio :label="$t('common.status.disabled')" :value="0"></v-radio>
                </v-radio-group>
              </v-col>
            </v-row>
          </v-container>
        </v-form>
      </v-card-text>

      <v-card-actions>
        <!-- actions -->
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1" @click="methods.closeUserForm" :disabled="localData.isSaving">
          {{ $t('common.form.cancel') }}
        </v-btn>
        <v-btn @click="methods.save" :loading="localData.isSaving" :disabled="localData.isSaving">
          {{ $t('common.form.save') }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
