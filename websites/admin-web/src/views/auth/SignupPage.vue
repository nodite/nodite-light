<script setup lang="ts">
import { Icon } from '@iconify/vue';

import { useAuthStore } from '@/stores/modules/authStore';

const authStore = useAuthStore();

// sign in buttons
const signupState = ref({
  isLoading: false,
  isSignInDisabled: false,
  isFormValid: true,
  showPassword: false,
});

// login form
const refSignupForm = ref();

const signupForm = ref({
  username: '',
  email: '',
  password: '',
});

const signupRules = ref({
  username: [(v: string) => !!v || 'UserNmae is required'],
  email: [
    (v: string) => !!v || 'E-mail is required',
    (v: string) => /.+@.+\..+/.test(v) || 'E-mail must be valid',
  ],
  password: [
    (v: string) => !!v || 'Password is required',
    (v: string) => (v && v.length <= 10) || 'Password must be less than 10 characters',
  ],
});

// Submit
const handleRegister = async () => {
  const { valid } = await refSignupForm.value.validate();
  if (valid) {
    signupState.value.isLoading = true;
    signupState.value.isSignInDisabled = true;
    authStore.register(signupForm.value);
  } else {
    console.log('no');
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
    <v-card-title primary-title class="my-4 text-h4">
      <span class="flex-fill">{{ $ndt('Create Account') }}</span>
    </v-card-title>
    <v-card-subtitle>{{ $ndt("Let's build amazing products") }}</v-card-subtitle>

    <!-- sign in form -->
    <v-card-text>
      <v-form
        ref="refSignupForm"
        class="text-left"
        v-model="signupState.isFormValid"
        lazy-validation
      >
        <v-text-field
          v-model="signupForm.username"
          required
          :error="errorHandler.error"
          :label="$ndt('Username')"
          density="default"
          variant="underlined"
          color="primary"
          bg-color="#fff"
          :rules="signupRules.username"
          name="username"
          outlined
          validateOn="blur"
          @keyup.enter="handleRegister"
          @change="resetErrors"
        ></v-text-field>

        <v-text-field
          v-model="signupForm.email"
          required
          :error="errorHandler.error"
          :label="$ndt('Email')"
          density="default"
          variant="underlined"
          color="primary"
          bg-color="#fff"
          :rules="signupRules.email"
          name="email"
          outlined
          validateOn="blur"
          @keyup.enter="handleRegister"
          @change="resetErrors"
        ></v-text-field>

        <v-text-field
          v-model="signupForm.password"
          :append-inner-icon="signupState.showPassword ? 'mdi-eye' : 'mdi-eye-off'"
          :type="signupState.showPassword ? 'text' : 'password'"
          :error="errorHandler.error"
          :error-messages="errorHandler.errorMessages"
          :label="$ndt('Password')"
          density="default"
          variant="underlined"
          color="primary"
          bg-color="#fff"
          :rules="signupRules.password"
          name="password"
          outlined
          validateOn="blur"
          @change="resetErrors"
          @keyup.enter="handleRegister"
          @click:append-inner="signupState.showPassword = !signupState.showPassword"
        ></v-text-field>

        <v-btn
          :loading="signupState.isLoading"
          :disabled="signupState.isSignInDisabled"
          block
          size="x-large"
          color="primary"
          @click="handleRegister"
          class="mt-2"
          >{{ $ndt('Create Account') }}</v-btn
        >

        <div class="text-grey text-center text-caption font-weight-bold text-uppercase my-5">
          {{ $ndt('Or sign up with') }}
        </div>

        <!-- external providers list -->
        <v-btn
          class="mb-2 text-capitalize"
          color="white"
          elevation="1"
          block
          size="x-large"
          @click="signInWithWeChat"
          :disabled="signupState.isSignInDisabled"
        >
          <Icon icon="ic:baseline-wechat" class="mr-3 my-2" />
          {{ $ndt('WeChat') }}
        </v-btn>

        <div v-if="errorHandler.errorProvider" class="error--text my-5">
          {{ errorHandler.errorProviderMessage }}
        </div>

        <div class="my-5 text-center">
          {{ $ndt('By signing up, you agree to the') }}
          <br />
          <router-link class="text-primary" to="">{{ $ndt('Terms of Service') }}</router-link>
          &
          <router-link class="text-primary" to="">{{ $ndt('Privacy Policy') }}</router-link>
        </div>
      </v-form></v-card-text
    >
  </v-card>

  <div class="text-center mt-6">
    {{ $ndt('Already have an account?') }}
    <router-link to="/auth/signin" class="text-primary font-weight-bold">
      {{ $ndt('Sign In') }}
    </router-link>
  </div>
</template>
