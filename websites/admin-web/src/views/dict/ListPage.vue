<script setup lang="ts">
import '@employee87/vue3-treeview/dist/style.css';

import VueTreeView from '@employee87/vue3-treeview';
import { VDataTablePagination } from '@nodite-light/vuetify-data-table-pagination';
import lodash from 'lodash';
import moment from 'moment';

import {
  IDictGroup,
  IDictType,
  SequelizePaginationIDictTypeWithItems,
} from '@/api/admin/data-contracts';
import CopyLabel from '@/components/common/CopyLabel.vue';
import DictElement from '@/components/form/DictElement.vue';
import i18n from '@/plugins/i18n';
import { useDictStore } from '@/stores/modules/dictStore';
import { VueTreeView as VueTreeViewConfig } from '@/types/config';
import dialogs from '@/utils/dialogs';
import DictGroupForm from '@/views/dict/components/DictGroupForm.vue';
import DictTypeForm from '@/views/dict/components/DictTypeForm.vue';

const dictStore = useDictStore();

interface QueryParams {
  _dictGid?: string;
  dictName?: string;
  dictKey?: string;
  status?: 0 | 1;
}

// Local data.
const myRefStore = ref({
  loading: true,

  groups: [] as IDictGroup[],
  sideGroups: [] as IDictGroup[],
  pageResult: {} as SequelizePaginationIDictTypeWithItems,

  page: 1,
  itemsPerPage: 10,
});

const groupTree = ref({
  nodes: {} as Record<string, VueTreeViewConfig.TreeNode<IDictGroup>>,
  config: {} as VueTreeViewConfig.TreeConfig,
});

// Dict Group form.
const dictGroupFormData = ref({
  dialog: false,
  groupId: '',
  parentId: '',
});

// Dict Type form.
const dictTypeFormData = ref({
  dialog: false,
  dictKey: '',
});

// Query params.
const queryParamPage = computed({
  get: () => myRefStore.value.page || 1,
  set: (v: number) => {
    myRefStore.value.page = v;
    methods.loadDictTypeList();
  },
});

const queryParamItemsPerPage = computed({
  get: () => myRefStore.value.itemsPerPage || 10,
  set: (v: number) => {
    myRefStore.value.itemsPerPage = v;
    methods.loadDictTypeList();
  },
});

const queryParams = ref({} as QueryParams);

// Methods.
const methods = {
  // Load groups.
  async loadGroupList() {
    myRefStore.value.groups = (await dictStore.listGroup()) || [];
    myRefStore.value.sideGroups = [
      { groupId: '', groupName: 'Root' } as IDictGroup,
      ...myRefStore.value.groups,
    ];
  },
  // Filter group.
  async filterGroup(node?: VueTreeViewConfig.TreeNode<IDictGroup>) {
    queryParams.value._dictGid = node?.id;
    await methods.loadDictTypeList();
  },
  // Reset search.
  async resetSearch() {
    queryParams.value = {} as QueryParams;
    await methods.loadDictTypeList();
  },
  // Open dict group form.
  openDictGroupForm(groupId?: string, parentId?: string) {
    dictGroupFormData.value.dialog = true;
    dictGroupFormData.value.groupId = groupId || '';
    dictGroupFormData.value.parentId = parentId || '';
  },
  // Delete group.
  async deleteGroup(item: IDictGroup) {
    const confirm = await dialogs.deleteConfirm(
      i18n.ndt('Are you sure to delete this Dict Group ({0})?', [item.groupName]),
    );

    if (!confirm) return;

    if (queryParams.value._dictGid === item.groupId) {
      queryParams.value._dictGid = '';
    }

    await dictStore.deleteGroup(item.groupId);
    await methods.loadGroupList();
  },
  // Open parent of group.
  _openParent(node: VueTreeViewConfig.TreeNode<IDictGroup>) {
    if (!node) return;
    const parent = groupTree.value.nodes[node.item.parentId];
    if (!parent) return;
    parent.state.opened = true;
    methods._openParent(parent);
  },

  // Load list.
  async loadDictTypeList() {
    myRefStore.value.loading = true;

    const pageResult = await dictStore.listType({
      page: queryParamPage.value,
      itemsPerPage: queryParamItemsPerPage.value,
      ...queryParams.value,
      _dictGid: queryParams.value._dictGid ? `eq:${queryParams.value._dictGid}` : '',
    });

    myRefStore.value.pageResult = pageResult || ({} as SequelizePaginationIDictTypeWithItems);

    myRefStore.value.loading = false;
  },
  // Change dict type status.
  async changeDictTypeStatus(dictKey: string, status: number) {
    await dictStore.editType({ dictKey: dictKey, status: status } as IDictType);
  },
  // Open dict type form.
  openDictTypeForm(dictKey: string) {
    dictTypeFormData.value.dialog = true;
    dictTypeFormData.value.dictKey = dictKey;
  },
  // Delete dict type.
  async deleteDictType(item: IDictType) {
    const confirm = await dialogs.deleteConfirm(
      i18n.ndt('Are you sure to delete this Dict Type ({0})?', [item.dictName]),
    );

    if (!confirm) return;

    await dictStore.deleteType(item.dictKey);
    await methods.loadDictTypeList();
  },
};

// Lifecycle.
onMounted(() => {
  methods.loadGroupList();
  methods.loadDictTypeList();
});

watchEffect(async () => {
  groupTree.value.nodes = lodash
    .chain(myRefStore.value.sideGroups)
    .mapValues((group) => ({
      id: group.groupId,
      text: i18n.ndt(group.groupName, undefined, { context: 'dict.group' }),
      item: group,
      state: {
        opened:
          groupTree.value.nodes[group.groupId]?.state?.opened ||
          group.groupName === 'Root' ||
          false,
        checked: group.groupId === queryParams.value._dictGid,
        disabled: false,
      },
      children: lodash
        .chain(myRefStore.value.sideGroups)
        .filter({ parentId: group.groupId })
        .map('groupId')
        .value(),
    }))
    .keyBy('id')
    .value();

  if (queryParams.value._dictGid) {
    methods._openParent(groupTree.value.nodes[queryParams.value._dictGid]);
  }

  groupTree.value.config = {
    checkboxes: false,
    roots: lodash
      .chain(myRefStore.value.sideGroups)
      .filter((group) => lodash.isUndefined(group.parentId))
      .map('groupId')
      .value(),
  };
});
</script>

<template>
  <!-- search -->
  <v-card density="compact" class="mb-2 search">
    <v-card-text>
      <v-row dense>
        <v-col cols="12" lg="2" md="3" sm="6">
          <v-select
            density="compact"
            :label="$ndt('Dict Group')"
            v-model="queryParams._dictGid"
            variant="outlined"
            :items="myRefStore.sideGroups"
            item-title="groupName"
            item-value="groupId"
            @click:clear="methods.filterGroup()"
            hide-details
            chips
            clearable
            readonly
          >
            <template #chip="{ item }">
              <v-chip density="comfortable">
                {{ $ndt(item.title, undefined, { context: 'dict.group' }) }}
              </v-chip>
            </template>
          </v-select>
        </v-col>
        <v-col cols="12" lg="2" md="3" sm="6">
          <v-text-field
            density="compact"
            :label="$ndt('Dict Name')"
            v-model="queryParams.dictName"
            variant="outlined"
            hide-details
            clearable
          ></v-text-field>
        </v-col>
        <v-col cols="12" lg="2" md="3" sm="6">
          <v-text-field
            density="compact"
            :label="$ndt('Dict Key')"
            v-model="queryParams.dictKey"
            variant="outlined"
            hide-details
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
            methods.loadDictTypeList();
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
      <!-- dict group -->
      <v-col cols="12" lg="3" md="4">
        <v-card density="compact">
          <v-card-text>
            <VueTreeView
              class="dict-group"
              :nodes="groupTree.nodes"
              :config="groupTree.config"
              @node-focus="methods.filterGroup"
            >
              <template #after-input="{ node }">
                <v-btn
                  v-if="node.item.groupName !== 'Root'"
                  class="text-primary"
                  icon="mdi-pencil"
                  size="small"
                  density="compact"
                  color="transparent"
                  elevation="0"
                  @click.stop.prevent="methods.openDictGroupForm(node.item.groupId, undefined)"
                ></v-btn>
                <v-btn
                  class="text-primary"
                  icon="mdi-plus"
                  size="small"
                  density="compact"
                  color="transparent"
                  elevation="0"
                  @click.stop.prevent="methods.openDictGroupForm(undefined, node.item.groupId)"
                ></v-btn>
                <v-btn
                  v-if="node.item.groupName !== 'Root' && node.item.deleted !== 9"
                  class="text-error"
                  icon="mdi-minus"
                  size="small"
                  density="compact"
                  color="transparent"
                  elevation="0"
                  @click.stop.prevent="methods.deleteGroup(node.item)"
                ></v-btn>
              </template>
            </VueTreeView>
          </v-card-text>
        </v-card>
      </v-col>

      <!-- dict -->
      <v-col cols="12" lg="9" md="8">
        <v-data-table
          item-value="dictKey"
          :headers="[
            { title: '', align: 'start', key: 'data-table-select' },
            { title: $ndt('Dict Name'), value: 'dictName' },
            { title: $ndt('Dict Style'), value: 'dictStyle' },
            { title: $ndt('Status'), value: 'status' },
            { title: $ndt('Dict Items'), value: 'dictItems', align: 'center' },
            { title: $ndt('Create Time'), value: 'createTime' },
            { key: 'actions', sortable: false },
          ]"
          :items="myRefStore.pageResult.items"
          :items-per-page="queryParamItemsPerPage"
        >
          <template #top>
            <v-toolbar density="compact" color="background">
              <DictTypeForm
                v-model:dialog="dictTypeFormData.dialog"
                v-model:dictKey="dictTypeFormData.dictKey"
                :groups="myRefStore.groups"
                :dict-gid="queryParams._dictGid"
                @save="methods.loadDictTypeList"
              ></DictTypeForm>
            </v-toolbar>
          </template>

          <template #item.dictName="{ item }">
            <v-label>
              <span>
                {{ item.dictName }}
                <v-tooltip activator="parent" location="bottom">
                  {{ item.dictDesc }}
                </v-tooltip>
              </span>
              &nbsp;(<CopyLabel :text="item.dictKey"></CopyLabel>)
            </v-label>
            <br />
            <v-label class="text-caption text-disabled">
              {{ $ndt('Translation') }}:
              {{ $ndt(item.dictName, undefined, { context: 'dict.type' }) }}
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
              @change="methods.changeDictTypeStatus(item.dictKey, Number(item.status))"
              hide-details
            ></v-switch>
          </template>

          <template #item.dictItems="{ item }">
            <router-link class="link" :to="`/dict/${item.dictKey}/items`">
              {{ '< ' + item.dictItems.length + ' >' }}
            </router-link>
          </template>

          <template #item.createTime="{ value }">
            <v-label>{{ moment(value).format('YYYY-MM-DD HH:mm:ss') }}</v-label>
          </template>

          <template #item.actions="{ item }">
            <v-btn
              class="px-0"
              variant="text"
              @click="methods.openDictTypeForm(item.dictKey)"
              min-width="calc(var(--v-btn-height) + 0px)"
            >
              <v-icon>mdi-square-edit-outline</v-icon>
            </v-btn>

            <v-btn
              class="px-0"
              color="red"
              variant="text"
              @click="methods.deleteDictType(item)"
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

  <DictGroupForm
    v-model:dialog="dictGroupFormData.dialog"
    v-model:group-id="dictGroupFormData.groupId"
    :groups="myRefStore.groups"
    :parent-id="dictGroupFormData.parentId"
    @save="methods.loadGroupList"
  ></DictGroupForm>
</template>

<style scoped lang="css">
.tree.dict-group :deep(.node-wrapper.checked) {
  border: 0;
  background-color: #e0e0e0;
}
</style>
