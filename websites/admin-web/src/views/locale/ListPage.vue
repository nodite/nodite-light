<script setup lang="ts">
import { ConfirmCallback, VDeleteConfirmForm } from '@nodite-light/vuetify-delete-confirm-form';
import { Icon } from '@nodite-light/vuetify-icon-picker';
import { DataTableItemProps } from '@nodite-light/vuetify-tree-data-table';

import { ILocale } from '@/api/admin/data-contracts';
import { $ndt } from '@/plugins/i18n';
import { useLocaleStore } from '@/stores/modules/localeStore';
import LocaleForm from '@/views/locale/components/LocaleForm.vue';

const localeStore = useLocaleStore();

const staticData = ref({
  headers: [] as DataTableItemProps['headers'],
  status: [] as { title: string; value: number }[],
});

const localData = ref({
  loading: false,
  locales: [] as ILocale[],
});

const localeFormData = ref({
  dialog: false,
  localeId: 0,
});

const deleteConfirmFormData = ref({
  dialog: false,
  item: {} as ILocale,
});

const methods = {
  async loadList() {
    localData.value.loading = true;
    localData.value.locales = (await localeStore.list()) as ILocale[];
    localData.value.loading = false;
  },
  async setLocaleDefault(locale: ILocale) {
    await localeStore.setDefaultLocale(locale);
    localData.value.locales.forEach((item) => {
      if (item.localeId === locale.localeId) return;
      item.isDefault = 0;
    });
  },
  async changeLocaleStatus(id: number, status: number) {
    await localeStore.edit({ localeId: id, status: status } as ILocale);
  },
  openLocaleForm(id: number) {
    localeFormData.value.dialog = true;
    localeFormData.value.localeId = id;
  },
  closeLocaleForm() {
    localeFormData.value.dialog = false;
    localeFormData.value.localeId = 0;
  },
  openDeleteConfirmForm(item: ILocale) {
    deleteConfirmFormData.value.dialog = true;
    deleteConfirmFormData.value.item = item;
  },
  closeDeleteConfirmForm() {
    deleteConfirmFormData.value.dialog = false;
    deleteConfirmFormData.value.item = {} as ILocale;
  },
  async delete(item: ILocale, cb: ConfirmCallback) {
    try {
      await localeStore.delete(item.localeId);
      await methods.loadList();
      methods.closeDeleteConfirmForm();
      cb(true);
    } catch (e) {
      cb(false);
    }
  },
};

onMounted(() => {
  methods.loadList();
});

watchEffect(() => {
  staticData.value.headers = [
    { title: $ndt('ID'), value: 'localeId' },
    { title: $ndt('Label', undefined, { context: 'locale.list' }), value: 'label' },
    { title: $ndt('Langcode'), value: 'langcode' },
    { title: $ndt('Order'), value: 'orderNum' },
    { title: $ndt('Default'), value: 'isDefault' },
    { title: $ndt('Status'), value: 'status' },
    { key: 'actions', sortable: false },
  ];

  staticData.value.status = [
    { title: $ndt('Enabled'), value: 1 },
    { title: $ndt('Disabled'), value: 0 },
  ];
});
</script>

<template>
  <v-data-table item-value="localeId" :headers="staticData.headers" :items="localData.locales">
    <template v-slot:top>
      <v-toolbar density="compact" color="inherit">
        <locale-form
          :dialog="localeFormData.dialog"
          :localeId="localeFormData.localeId"
          @close="methods.closeLocaleForm"
          @save="methods.loadList"
        ></locale-form>
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
        :disabled="item.localeId == 1"
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
        @click="methods.openDeleteConfirmForm(item)"
        min-width="calc(var(--v-btn-height) + 0px)"
        :disabled="item.deleted == 9 || item.localeId == 1"
      >
        <v-icon>mdi-delete</v-icon>
      </v-btn>
    </template>
  </v-data-table>

  <!-- delete confirm -->
  <VDeleteConfirmForm
    :dialog="deleteConfirmFormData.dialog"
    :item="deleteConfirmFormData.item"
    @confirm="methods.delete"
    @cancel="methods.closeDeleteConfirmForm"
  ></VDeleteConfirmForm>
</template>
