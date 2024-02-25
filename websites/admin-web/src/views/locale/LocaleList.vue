<script setup lang="ts">
import { Icon } from '@nodite-light/vuetify-icon-picker';

import { ILocale } from '@/api/admin/data-contracts';
import i18n from '@/plugins/i18n';
import { useLocaleStore } from '@/stores/modules/localeStore';
import dialogs from '@/utils/dialogs';
import lodash from '@/utils/lodash';
import LocaleForm from '@/views/locale/components/LocaleForm.vue';

const localeStore = useLocaleStore();

// Local data.
const myRefStore = ref({
  loading: false,
  locales: [] as ILocale[],
});

// Locale form.
const localeFormData = ref({
  dialog: false,
  localeId: 0,
});

// Methods.
const methods = {
  // Load list.
  async loadList() {
    myRefStore.value.loading = true;
    myRefStore.value.locales = (await localeStore.listLocales()) as ILocale[];
    myRefStore.value.loading = false;
  },
  // Set default locale.
  async setLocaleDefault(locale: ILocale) {
    try {
      await localeStore.setDefaultLocale(locale);
    } finally {
      locale.isDefault = 1;
      lodash
        .chain(myRefStore.value.locales)
        .filter((item) => item.localeId !== locale.localeId)
        .forEach((item) => (item.isDefault = 0))
        .value();
    }
  },
  // Change locale status.
  async changeLocaleStatus(id: number, status: number) {
    await localeStore.editLocale({ localeId: id, status: status } as ILocale);
    const locales = await localeStore.listAvailableLocales(true);
    if (locales.length === 1) {
      await localeStore.setCurrLocale(locales[0]);
    }
  },
  // Open locale form.
  openLocaleForm(id: number) {
    localeFormData.value.dialog = true;
    localeFormData.value.localeId = id;
  },
  // Delete locale.
  async delete(item: ILocale) {
    const confirm = await dialogs.deleteConfirm(
      i18n.ndt('Are you sure to delete this Locale ({0})?', [item.label]),
    );

    if (!confirm) return;

    await localeStore.deleteLocale(item.localeId);
    await methods.loadList();
  },
};

// Lifecycle.
onMounted(async () => {
  await methods.loadList();
});
</script>

<template>
  <v-data-table
    item-value="localeId"
    :headers="[
      { title: $ndt('ID'), value: 'localeId' },
      { title: $ndt('Label'), value: 'label' },
      { title: $ndt('Langcode'), value: 'langcode' },
      { title: $ndt('Order'), value: 'orderNum' },
      { title: $ndt('Default'), value: 'isDefault' },
      { title: $ndt('Status'), value: 'status' },
      { key: 'actions', sortable: false },
    ]"
    :items="myRefStore.locales"
  >
    <template v-slot:top>
      <v-toolbar density="compact" color="inherit">
        <LocaleForm
          v-model:dialog="localeFormData.dialog"
          v-model:localeId="localeFormData.localeId"
          @save="methods.loadList"
        ></LocaleForm>
      </v-toolbar>
    </template>

    <template v-slot:item.label="{ item }">
      <v-label>
        <Icon :icon="item.icon" class="mr-2"></Icon>
        {{ item.label }}
      </v-label>
    </template>

    <template v-slot:item.isDefault="{ item }">
      <v-switch
        color="success"
        density="compact"
        v-model="item.isDefault"
        :label="item.isDefault ? $ndt('Default') : $ndt('Set as default')"
        :true-value="1"
        :false-value="0"
        @change="methods.setLocaleDefault(item)"
        hide-details
      ></v-switch>
    </template>

    <template v-slot:item.status="{ item }">
      <v-switch
        color="success"
        density="compact"
        v-model="item.status"
        :true-value="1"
        :false-value="0"
        @change="methods.changeLocaleStatus(item.localeId, Number(item.status))"
        hide-details
      ></v-switch>
    </template>

    <template v-slot:item.actions="{ item }">
      <v-btn
        class="px-0"
        variant="text"
        @click="methods.openLocaleForm(item.localeId)"
        min-width="calc(var(--v-btn-height) + 0px)"
      >
        <v-icon>mdi-square-edit-outline</v-icon>
      </v-btn>

      <v-btn
        class="px-0"
        color="red"
        variant="text"
        @click="methods.delete(item)"
        min-width="calc(var(--v-btn-height) + 0px)"
        :disabled="item.deleted == 9 || item.localeId == 1"
      >
        <v-icon>mdi-delete</v-icon>
      </v-btn>
    </template>
  </v-data-table>
</template>
