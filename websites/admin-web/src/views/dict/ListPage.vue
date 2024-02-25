<script setup lang="ts">
import '@employee87/vue3-treeview/dist/style.css';

import VueTreeView from '@employee87/vue3-treeview';
import moment from 'moment';

import { IDictGroup, IDictType, SequelizePaginationIDictType } from '@/api/admin/data-contracts';
import CopyLabel from '@/components/common/CopyLabel.vue';
import i18n from '@/plugins/i18n';
import { useDictStore } from '@/stores/modules/dictStore';
import { VueTreeView as VueTreeViewConfig } from '@/types/config';
import dialogs from '@/utils/dialogs';
import lodash from '@/utils/lodash';
import DictGroupForm from '@/views/dict/components/DictGroupForm.vue';
import DictTypeForm from '@/views/dict/components/DictTypeForm.vue';

const dictStore = useDictStore();

interface QueryParams {
  dictGid?: string;
}

// Local data.
const myRefStore = ref({
  loading: true,

  groups: [] as IDictGroup[],
  sideGroups: [] as IDictGroup[],
  pageResult: {} as SequelizePaginationIDictType,
  items: [] as IDictType[],

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
  dictId: '',
});

// Query params.
const queryParamPage = computed({
  get: () => myRefStore.value.page || 1,
  set: (v: number) => {
    myRefStore.value.page = v;
    methods.loadTypeList();
  },
});

const queryParamItemsPerPage = computed({
  get: () => myRefStore.value.itemsPerPage || 10,
  set: (v: number) => {
    myRefStore.value.itemsPerPage = v;
    methods.loadTypeList();
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
    queryParams.value.dictGid = node?.id;
    await methods.loadTypeList();
  },
  // Reset search.
  async resetSearch() {
    queryParams.value = {} as QueryParams;
    await methods.loadTypeList();
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

    if (queryParams.value.dictGid === item.groupId) {
      queryParams.value.dictGid = '';
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
  async loadTypeList() {
    myRefStore.value.loading = true;

    const pageResult = await dictStore.listType({
      page: queryParamPage.value,
      itemsPerPage: queryParamItemsPerPage.value,
      ...queryParams.value,
    });

    myRefStore.value.pageResult = pageResult || ({} as SequelizePaginationIDictType);

    myRefStore.value.loading = false;
  },
  // Change dict type status.
  async changeDictTypeStatus(id: string, status: number) {
    await dictStore.editType({ dictId: id, status: status } as IDictType);
  },
  // Open dict type form.
  openDictTypeForm(id: string) {
    dictTypeFormData.value.dialog = true;
    dictTypeFormData.value.dictId = id;
  },
  // Delete dict type.
  async deleteType(item: IDictType) {
    const confirm = await dialogs.deleteConfirm(
      i18n.ndt('Are you sure to delete this Dict Type ({0})?', [item.dictName]),
    );

    if (!confirm) return;

    await dictStore.deleteType(item.dictId);
    await methods.loadTypeList();
  },
};

// Lifecycle.
onMounted(() => {
  methods.loadGroupList();
  methods.loadTypeList();
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
        checked: group.groupId === queryParams.value.dictGid,
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

  if (queryParams.value.dictGid) {
    methods._openParent(groupTree.value.nodes[queryParams.value.dictGid]);
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
            v-model="queryParams.dictGid"
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
            <template v-slot:chip="{ item }">
              <v-chip density="comfortable">
                {{ $ndt(item.title, undefined, { context: 'dict.group' }) }}
              </v-chip>
            </template>
          </v-select>
        </v-col>
        <v-spacer></v-spacer>
        <v-btn
          class="mr-2 align-self-center"
          color="primary"
          prepend-icon="mdi-magnify"
          density="comfortable"
          @click="
            myRefStore.page = 1;
            methods.loadTypeList();
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
              <template v-slot:after-input="{ node }">
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
          item-value="dictId"
          :headers="[
            { title: '', align: 'start', key: 'data-table-select' },
            { title: $ndt('Dict Name'), value: 'dictName' },
            { title: $ndt('Translation'), value: 'trans' },
            { title: $ndt('Dict Style'), value: 'dictStyle' },
            { title: $ndt('Order'), value: 'orderNum' },
            { title: $ndt('Status'), value: 'status' },
            { title: $ndt('Create Time'), value: 'createTime' },
            { key: 'actions', sortable: false },
          ]"
          :items="myRefStore.pageResult.items"
          :items-per-page="queryParamItemsPerPage"
        >
          <template v-slot:top>
            <v-toolbar density="compact" color="background">
              <DictTypeForm
                v-model:dialog="dictTypeFormData.dialog"
                v-model:dict-id="dictTypeFormData.dictId"
                :groups="myRefStore.groups"
                :dict-gid="queryParams.dictGid"
                @save="methods.loadTypeList"
              ></DictTypeForm>
            </v-toolbar>
          </template>

          <template v-slot:item.dictName="{ item }">
            <v-label>
              <span>
                {{ item.dictName }}
                <v-tooltip activator="parent" location="bottom">
                  {{ item.dictDesc }}
                </v-tooltip>
              </span>
              &nbsp;(<CopyLabel :text="item.dictKey"></CopyLabel>)
            </v-label>
          </template>

          <template v-slot:item.trans="{ item }">
            <v-label>{{ $ndt(item.dictName, undefined, { context: 'dict.type' }) }}</v-label>
          </template>

          <template v-slot:item.status="{ item }">
            <!-- status -->
            <v-switch
              color="success"
              density="compact"
              v-model="item.status"
              :true-value="1"
              :false-value="0"
              @change="methods.changeDictTypeStatus(item.dictId, Number(item.status))"
              hide-details
            ></v-switch>
          </template>

          <template v-slot:item.createTime="{ value }">
            <v-label>{{ moment(value).format('YYYY-MM-DD HH:mm:ss') }}</v-label>
          </template>

          <template v-slot:item.actions="{ item }">
            <v-btn
              class="px-0"
              variant="text"
              @click="methods.openDictTypeForm(item.dictId)"
              min-width="calc(var(--v-btn-height) + 0px)"
            >
              <v-icon>mdi-square-edit-outline</v-icon>
            </v-btn>

            <v-btn
              class="px-0"
              color="red"
              variant="text"
              @click="methods.deleteType(item)"
              min-width="calc(var(--v-btn-height) + 0px)"
              :disabled="item.deleted === 9"
            >
              <v-icon>mdi-delete</v-icon>
            </v-btn>
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
