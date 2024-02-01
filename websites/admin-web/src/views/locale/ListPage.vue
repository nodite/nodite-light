<script setup lang="ts">
import { ConfirmCallback, VDeleteConfirmForm } from '@nodite-light/vuetify-delete-confirm-form';
import { Icon } from '@nodite-light/vuetify-icon-picker';

import { ILocale } from '@/api/admin/data-contracts';
import { useLocaleStore } from '@/stores/modules/localeStore';
import LocaleForm from '@/views/locale/components/LocaleForm.vue';

const localeStore = useLocaleStore();

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
    localData.value.locales = (await localeStore.listLocales()) as ILocale[];
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
    await localeStore.editLocale({ localeId: id, status: status } as ILocale);
  },
  openLocaleForm(id: number) {
    localeFormData.value.dialog = true;
    localeFormData.value.localeId = id;
  },
  openDeleteConfirmForm(item: ILocale) {
    deleteConfirmFormData.value.dialog = true;
    deleteConfirmFormData.value.item = item;
  },
  async delete(item: ILocale, cb: ConfirmCallback) {
    try {
      await localeStore.deleteLocale(item.localeId);
      await methods.loadList();
      cb(true);
    } catch (e) {
      cb(false);
    }
  },
};

onMounted(() => {
  methods.loadList();
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
    :items="localData.locales"
  >
    <template v-slot:top>
      <v-toolbar density="compact" color="inherit">
        <locale-form
          v-model:dialog="localeFormData.dialog"
          v-model:localeId="localeFormData.localeId"
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
    v-model:dialog="deleteConfirmFormData.dialog"
    v-model:item="deleteConfirmFormData.item"
    @confirm="methods.delete"
  ></VDeleteConfirmForm>
</template>
