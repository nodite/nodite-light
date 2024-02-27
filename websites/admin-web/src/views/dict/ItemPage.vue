<script setup lang="ts">
import { VDataTablePagination } from '@nodite-light/vuetify-data-table-pagination';
import moment from 'moment';

import { IDictItem, IDictType, SequelizePaginationIDictItem } from '@/api/admin/data-contracts';
import CopyLabel from '@/components/common/CopyLabel.vue';
import DictElement from '@/components/form/DictElement.vue';
import i18n from '@/plugins/i18n';
import { useDictStore } from '@/stores/modules/dictStore';
import dialogs from '@/utils/dialogs';
import lodash from '@/utils/lodash';
import DictItemForm from '@/views/dict/components/DictItemForm.vue';

const route = useRoute();
const dictStore = useDictStore();

interface QueryParams {
  itemKey?: string;
  itemValue?: string;
  status?: 0 | 1;
}

const dictKey = computed(() => lodash.toString(route.params.dictKey));

// Local data.
const myRefStore = ref({
  loading: false,

  dictType: {} as IDictType,
  pageResult: {} as SequelizePaginationIDictItem,

  page: 1,
  itemsPerPage: 10,
});

// Dict Item form.
const dictItemFormData = ref({
  dialog: false,
  itemId: 0,
});

// Query params.
const queryParamPage = computed({
  get: () => myRefStore.value.page || 1,
  set: (v: number) => {
    myRefStore.value.page = v;
    methods.loadDictItemList();
  },
});

const queryParamItemsPerPage = computed({
  get: () => myRefStore.value.itemsPerPage || 10,
  set: (v: number) => {
    myRefStore.value.itemsPerPage = v;
    methods.loadDictItemList();
  },
});

const queryParams = ref({} as QueryParams);

// Methods.
const methods = {
  // Load dict type.
  async loadDictType() {
    if (!dictKey.value) return;
    myRefStore.value.dictType = (await dictStore.queryType(dictKey.value)) as IDictType;
  },
  // Load list.
  async loadDictItemList() {
    myRefStore.value.loading = true;

    const pageResult = await dictStore.listItem({
      page: myRefStore.value.page,
      itemsPerPage: myRefStore.value.itemsPerPage,
      ...queryParams.value,
      _dictKey: `eq:${myRefStore.value.dictType.dictKey}`,
    });

    myRefStore.value.pageResult = pageResult || ({} as SequelizePaginationIDictItem);

    myRefStore.value.loading = false;
  },
  // Reset search.
  async resetSearch() {
    queryParams.value = {};
    await methods.loadDictItemList();
  },
  // Open dict item form.
  openDictItemForm(id: number) {
    dictItemFormData.value.dialog = true;
    dictItemFormData.value.itemId = id;
  },
  // Change dict item status.
  async changeDictItemStatus(id: number, status: number) {
    await dictStore.editItem({ itemId: id, status: status } as IDictItem);
  },
  // Delete dict item.
  async deleteDictItem(item: IDictItem) {
    const confirm = await dialogs.deleteConfirm(
      i18n.ndt('Are you sure to delete this Dict Item ({0})?', [item.itemKey]),
    );

    if (!confirm) return;

    await dictStore.deleteItem(item.itemId);
    await methods.loadDictItemList();
  },
};

// Lifecycle.
onMounted(async () => {
  await methods.loadDictType();
  await methods.loadDictItemList();
});
</script>

<template>
  <!-- search -->
  <v-card density="compact" class="mb-2 search">
    <v-card-text>
      <v-row dense>
        <v-col cols="12" lg="2" md="3" sm="6">
          <v-text-field
            density="compact"
            :label="$ndt('Item Key', undefined, { context: 'dict.item' })"
            v-model="queryParams.itemKey"
            variant="outlined"
            hide-details
            hide-spin-buttons
            clearable
          ></v-text-field>
        </v-col>
        <v-col cols="12" lg="2" md="3" sm="6">
          <v-text-field
            density="compact"
            :label="$ndt('Item Value', undefined, { context: 'dict.item' })"
            v-model="queryParams.itemValue"
            variant="outlined"
            hide-details
            hide-spin-buttons
            clearable
          ></v-text-field>
        </v-col>
        <v-col cols="12" lg="2" md="3" sm="6">
          <DictElement
            component="VSelect"
            dict-key="status"
            v-model="queryParams.status"
            :component-props="{
              density: 'compact',
              variant: 'outlined',
              hideDetails: true,
              clearable: true,
            }"
          >
            <template #chip="{ item }">
              <v-chip density="comfortable">{{ item.title }}</v-chip>
            </template>
          </DictElement>
        </v-col>
        <v-spacer></v-spacer>
        <v-btn
          class="mr-2 align-self-center"
          color="primary"
          prepend-icon="mdi-magnify"
          density="comfortable"
          @click="
            myRefStore.page = 1;
            methods.loadDictItemList();
          "
        >
          {{ $ndt('Search') }}
        </v-btn>
        <v-btn
          class="align-self-center"
          prepend-icon="mdi-sync"
          density="comfortable"
          @click="methods.resetSearch"
        >
          {{ $ndt('Reset') }}
        </v-btn>
      </v-row>
    </v-card-text>
  </v-card>

  <v-container class="pa-0" style="max-width: unset">
    <v-row dense>
      <!-- overview -->
      <v-col cols="12" lg="3" md="3" sm="3">
        <v-card density="compact">
          <v-card-title>
            <v-label>{{ $ndt('DictType Overview') }}</v-label>
          </v-card-title>
          <v-card-text>
            <v-list density="compact">
              <v-list-item
                density="compact"
                class="px-0"
                v-for="item in [
                  {
                    title: $ndt('ID'),
                    key: 'dictId',
                    value: myRefStore.dictType.dictId,
                  },
                  {
                    title: $ndt('Dict Name'),
                    key: 'dictName',
                    value: myRefStore.dictType.dictName,
                  },
                  {
                    title: $ndt('Dict Key'),
                    key: 'dictKey',
                    value: myRefStore.dictType.dictKey,
                  },
                  {
                    title: $ndt('Dict Style'),
                    key: 'dictStyle',
                    value: myRefStore.dictType.dictStyle,
                  },
                  {
                    title: $ndt('Dict Desc'),
                    key: 'dictDesc',
                    value: myRefStore.dictType.dictDesc,
                  },
                  {
                    title: $ndt('Status'),
                    key: 'status',
                    value: myRefStore.dictType.status
                      ? $ndt('Enabled', undefined, { context: 'dict.type.status' })
                      : $ndt('Disabled', undefined, { context: 'dict.type.status' }),
                  },
                  {
                    title: $ndt('Create Time'),
                    key: 'createTime',
                    value: myRefStore.dictType.createTime
                      ? moment(myRefStore.dictType.createTime).format('YYYY-MM-DD HH:mm:ss')
                      : '',
                  },
                  {
                    title: $ndt('Update Time'),
                    key: 'updateTime',
                    value: myRefStore.dictType.updateTime
                      ? moment(myRefStore.dictType.updateTime).format('YYYY-MM-DD HH:mm:ss')
                      : '',
                  },
                ]"
                :key="item.key"
              >
                {{ item.title }}: <v-label>{{ item.value }}</v-label>
              </v-list-item>
            </v-list>
          </v-card-text>
        </v-card>
      </v-col>

      <!-- data table -->
      <v-col cols="12" lg="9" md="9" sm="9">
        <v-data-table
          item-value="itemId"
          :headers="[
            { title: '', align: 'start', key: 'data-table-select' },
            { title: $ndt('ID'), value: 'itemId' },
            { title: $ndt('Item Key', undefined, { context: 'dict.item' }), value: 'itemKey' },
            { title: $ndt('Item Value', undefined, { context: 'dict.item' }), value: 'itemValue' },
            { title: $ndt('Item Desc', undefined, { context: 'dict.item' }), value: 'itemDesc' },
            { title: $ndt('Order'), value: 'orderNum' },
            { title: $ndt('Status'), value: 'status' },
            { key: 'actions', sortable: false },
          ]"
          :items="myRefStore.pageResult.items"
          :items-per-page="queryParamItemsPerPage"
        >
          <template #top>
            <v-toolbar density="compact" color="background">
              <DictItemForm
                v-model:dialog="dictItemFormData.dialog"
                v-model:item-id="dictItemFormData.itemId"
                :dict-type="myRefStore.dictType"
                @save="methods.loadDictItemList"
              ></DictItemForm>
            </v-toolbar>
          </template>

          <template #item.itemKey="{ value }">
            <CopyLabel :text="value"></CopyLabel>
          </template>

          <template #item.itemValue="{ item }">
            <v-label>{{ item.itemValue }}</v-label>
            <br />
            <v-label class="text-caption text-disabled">
              {{ $ndt('Translation') }}:
              {{ $ndt(item.itemValue, undefined, { context: `dict.type.${item.dictKey}` }) }}
            </v-label>
          </template>

          <template #item.status="{ item }">
            <!-- status -->
            <v-switch
              color="success"
              density="compact"
              v-model="item.status"
              :true-value="1"
              :false-value="0"
              @change="methods.changeDictItemStatus(item.itemId, Number(item.status))"
              hide-details
            ></v-switch>
          </template>

          <template #item.actions="{ item }">
            <v-btn
              class="px-0"
              variant="text"
              @click="methods.openDictItemForm(item.itemId)"
              min-width="calc(var(--v-btn-height) + 0px)"
            >
              <v-icon>mdi-square-edit-outline</v-icon>
            </v-btn>

            <v-btn
              class="px-0"
              color="red"
              variant="text"
              @click="methods.deleteDictItem(item)"
              min-width="calc(var(--v-btn-height) + 0px)"
              :disabled="item.deleted === 9"
            >
              <v-icon>mdi-delete</v-icon>
            </v-btn>
          </template>

          <template #bottom>
            <VDataTablePagination
              v-model:page="queryParamPage"
              v-model:items-per-page="queryParamItemsPerPage"
              :current-count="myRefStore.pageResult.count"
              :total-count="myRefStore.pageResult.totalCount"
              :total-page="myRefStore.pageResult.totalPage"
            ></VDataTablePagination>
          </template>
        </v-data-table>
      </v-col>
    </v-row>
  </v-container>
</template>
