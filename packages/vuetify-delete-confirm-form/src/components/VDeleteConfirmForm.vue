<script setup lang="ts">
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { toast } from 'vuetify-sonner';

const { t: $t } = useI18n();

const emit = defineEmits(['update:dialog', 'update:item', 'confirm']);

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

const dialog = computed({
  get: () => props.dialog,
  set: (v) => emit('update:dialog', v),
});

const item = computed({
  get: () => props.item,
  set: (v) => emit('update:item', v),
});

const deleting = ref(false);

const methods = {
  close() {
    if (deleting.value) {
      toast.warning($t('$vuetify.deleteConfirmForm.deleting'));
      return;
    }
    dialog.value = false;
    item.value = {};
  },
  confirm() {
    deleting.value = true;
    emit('confirm', props.item, (close: boolean = true) => {
      deleting.value = false;
      if (close) methods.close();
    });
  },
};
</script>

<template>
  <v-dialog v-model="dialog" max-width="400" @clock:outside="methods.close" :persistent="deleting">
    <v-card>
      <v-card-text>{{ $t('$vuetify.deleteConfirmForm.title') }}</v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue-darken-1" variant="text" @click="methods.close" :disabled="deleting">
          {{ $t('$vuetify.deleteConfirmForm.cancel') }}
        </v-btn>
        <v-btn
          color="blut-darken-1"
          variant="text"
          @click="methods.confirm"
          :loading="deleting"
          :disabled="deleting"
        >
          {{ $t('$vuetify.deleteConfirmForm.confirm') }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
