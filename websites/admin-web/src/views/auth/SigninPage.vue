<script setup lang="ts">
import { Icon } from '@iconify/vue';

import i18n from '@/plugins/i18n';
import { useAuthStore } from '@/stores/modules/authStore';

const authStore = useAuthStore();

// auth state
const loginState = ref({
  isLoading: false,
  isSignInDisabled: false,
  isFormValid: true,
  showPassword: false,
});

// login form
const refLoginForm = ref();

const loginForm = ref({
  username: 'admin',
  password: 'admin',
});

const loginRules = ref({
  username: [(v: string) => !!v || i18n.ndt('Username is required.')],
  password: [
    (v: string) => !!v || i18n.ndt('Password is required'),
    (v: string) => (v && v.length <= 10) || i18n.ndt('Password must be less than 10 characters'),
  ],
});

const methods = {
  async handleLogin() {
    const { valid } = await refLoginForm.value.validate();

    if (!valid || !loginState.value.isFormValid) {
      return;
    }

    loginState.value.isLoading = true;
    loginState.value.isSignInDisabled = true;

    try {
      await authStore.login(loginForm.value as never);
    } finally {
      loginState.value.isLoading = false;
      loginState.value.isSignInDisabled = false;
    }
  },
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
      <v-form ref="refLoginForm" class="text-left" v-model="loginState.isFormValid" lazy-validation>
        <!-- username -->
        <v-text-field
          v-model="loginForm.username"
          required
          :error="errorHandler.error"
          :label="$ndt('Username')"
          density="default"
          variant="underlined"
          color="primary"
          bg-color="#fff"
          :rules="loginRules.username"
          name="username"
          outlined
          validateOn="blur"
          placeholder=""
          @keyup.enter="methods.handleLogin"
          @change="resetErrors"
        ></v-text-field>

        <!-- password -->
        <v-text-field
          v-model="loginForm.password"
          :append-inner-icon="loginState.showPassword ? 'mdi-eye' : 'mdi-eye-off'"
          :type="loginState.showPassword ? 'text' : 'password'"
          :error="errorHandler.error"
          :error-messages="errorHandler.errorMessages"
          :label="$ndt('Password')"
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
          @keyup.enter="methods.handleLogin"
          @click:append-inner="loginState.showPassword = !loginState.showPassword"
        ></v-text-field>

        <v-btn
          :loading="loginState.isLoading"
          :disabled="loginState.isSignInDisabled"
          block
          size="x-large"
          color="primary"
          @click="methods.handleLogin"
          class="mt-2"
          >{{ $ndt('Sign In') }}</v-btn
        >

        <!-- orsign overtext -->
        <div class="text-grey text-center text-caption font-weight-bold text-uppercase my-5">
          {{ $ndt('Or sign in with') }}
        </div>

        <!-- external providers list -->
        <v-btn
          class="mb-2 text-capitalize"
          color="white"
          elevation="1"
          block
          size="x-large"
          @click="signInWithWeChat"
          :disabled="loginState.isSignInDisabled"
        >
          <Icon icon="ic:baseline-wechat" class="mr-3 my-2" />
          {{ $ndt('WeChat') }}
        </v-btn>

        <!-- error message -->
        <div v-if="errorHandler.errorProvider" class="error--text my-2">
          {{ errorHandler.errorProviderMessage }}
        </div>

        <!-- forgot password -->
        <div class="mt-5 text-center">
          <router-link class="text-primary" to="/auth/forgot-password">
            {{ $ndt('Forgot password?') }}
          </router-link>
        </div>
      </v-form>
    </v-card-text>
  </v-card>
  <div class="text-center mt-6">
    {{ $ndt("Don't have an account?") }}
    <router-link to="/auth/signup" class="text-primary font-weight-bold">
      {{ $ndt('Create one here') }}
    </router-link>
  </div>
</template>
