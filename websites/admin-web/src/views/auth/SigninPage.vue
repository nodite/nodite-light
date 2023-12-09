<script setup lang="ts">
import { Icon } from '@iconify/vue';

import i18n from '@/plugins/i18n';
import { useAuthStore } from '@/stores/modules/authStore';
import { useSnackbarStore } from '@/stores/modules/snackbarStore';

const snackbarStore = useSnackbarStore();
const authStore = useAuthStore();

// auth state
const authState = ref({
  isLoading: false,
  isSignInDisabled: false,
});

// login form
const refLoginForm = ref();

const loginForm = ref({
  username: 'admin',
  password: 'admin',
  isFormValid: true,
  showPassword: false,
});

const loginRules = ref({
  username: [(v: string) => !!v || i18n.global.t('login.rules.usernameRequired')],
  password: [
    (v: string) => !!v || i18n.global.t('login.rules.passwordRequired'),
    (v: string) => (v && v.length <= 10) || i18n.global.t('login.rules.passwordMax'),
  ],
});

const handleLogin = async () => {
  const { valid } = await refLoginForm.value.validate();
  if (valid && loginForm.value.isFormValid) {
    authState.value.isLoading = true;
    authState.value.isSignInDisabled = true;
    authStore.login(loginForm.value);
  } else {
    snackbarStore.showErrorMessage(i18n.global.t('common.validateFailed'));
  }
};

// other sign in providers
const signInWithWeChat = () => {
  authStore.loginWithWeChat();
};

// error provider
const errorHandler = ref({
  errorProvider: false,
  errorProviderMessage: '',
  error: false,
  errorMessages: '',
});

const resetErrors = () => {
  errorHandler.value.error = false;
  errorHandler.value.errorMessages = '';
};
</script>
<template>
  <v-card color="white" class="pa-3 ma-3" elevation="3">
    <v-card-title class="my-4 text-h4">
      <span class="flex-fill"> Welcome </span>
    </v-card-title>
    <v-card-subtitle>Sign in to your account</v-card-subtitle>
    <!-- sign in form -->

    <v-card-text>
      <v-form ref="refLoginForm" class="text-left" v-model="loginForm.isFormValid" lazy-validation>
        <!-- username -->
        <v-text-field
          v-model="loginForm.username"
          required
          :error="errorHandler.error"
          :label="$t('login.username')"
          density="default"
          variant="underlined"
          color="primary"
          bg-color="#fff"
          :rules="loginRules.username"
          name="username"
          outlined
          validateOn="blur"
          placeholder=""
          @keyup.enter="handleLogin"
          @change="resetErrors"
        ></v-text-field>

        <!-- password -->
        <v-text-field
          v-model="loginForm.password"
          :append-inner-icon="loginForm.showPassword ? 'mdi-eye' : 'mdi-eye-off'"
          :type="loginForm.showPassword ? 'text' : 'password'"
          :error="errorHandler.error"
          :error-messages="errorHandler.errorMessages"
          :label="$t('login.password')"
          placeholder=""
          density="default"
          variant="underlined"
          color="primary"
          bg-color="#fff"
          :rules="loginRules.password"
          name="password"
          outlined
          validateOn="blur"
          @change="resetErrors"
          @keyup.enter="handleLogin"
          @click:append-inner="loginForm.showPassword = !loginForm.showPassword"
        ></v-text-field>

        <v-btn
          :loading="authState.isLoading"
          :disabled="authState.isSignInDisabled"
          block
          size="x-large"
          color="primary"
          @click="handleLogin"
          class="mt-2"
          >{{ $t('login.button') }}</v-btn
        >

        <!-- orsign overtext -->
        <div class="text-grey text-center text-caption font-weight-bold text-uppercase my-5">
          {{ $t('login.orsign') }}
        </div>

        <!-- external providers list -->
        <v-btn
          class="mb-2 text-capitalize"
          color="white"
          elevation="1"
          block
          size="x-large"
          @click="signInWithWeChat"
          :disabled="authState.isSignInDisabled"
        >
          <Icon icon="ic:baseline-wechat" class="mr-3 my-2" />
          WeChat
        </v-btn>

        <!-- error message -->
        <div v-if="errorHandler.errorProvider" class="error--text my-2">
          {{ errorHandler.errorProviderMessage }}
        </div>

        <!-- forgot password -->
        <div class="mt-5 text-center">
          <router-link class="text-primary" to="/auth/forgot-password">
            {{ $t('login.forgot') }}
          </router-link>
        </div>
      </v-form>
    </v-card-text>
  </v-card>
  <div class="text-center mt-6">
    {{ $t('login.noaccount') }}
    <router-link to="/auth/signup" class="text-primary font-weight-bold">
      {{ $t('login.create') }}
    </router-link>
  </div>
</template>
