<script setup lang="ts">
import { defineEmits, defineProps, ref, watchEffect } from 'vue';
import { useI18n } from 'vue-i18n';
import { toast } from 'vuetify-sonner';

const { t: $t } = useI18n();

const emit = defineEmits(['confirm', 'cancel']);

const props = defineProps({
  dialog: {
    type: Boolean,
    default: false,
  },
  item: {
    type: Object,
    default: () => ({}),
  },
});

const localData = ref({
  dialog: props.dialog,
  deleting: false,
});

const methods = {
  close() {
    if (localData.value.deleting) {
      toast.warning($t('$vuetify.delete_confirm_form.deleting'));
      return;
    }
    localData.value.dialog = false;
  },
  confirm() {
    localData.value.deleting = true;
    emit('confirm', props.item, () => {
      localData.value.deleting = false;
      methods.close();
    });
  },
  cancel() {
    emit('cancel');
    methods.close();
  },
};

watchEffect(() => {
  localData.value.dialog = props.dialog;
});
</script>

<template>
  <v-dialog
    v-model="localData.dialog"
    max-width="400"
    @clock:outside="methods.close"
    :persistent="localData.deleting"
  >
    <v-card>
      <v-card-text>{{ $t('$vuetify.delete_confirm_form.title') }}</v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          color="blue-darken-1"
          variant="text"
          @click="methods.cancel"
          :disabled="localData.deleting"
        >
          {{ $t('$vuetify.delete_confirm_form.cancel') }}
        </v-btn>
        <v-btn
          color="blut-darken-1"
          variant="text"
          @click="methods.confirm"
          :loading="localData.deleting"
          :disabled="localData.deleting"
        >
          {{ $t('$vuetify.delete_confirm_form.confirm') }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
