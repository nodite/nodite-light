<script setup lang="ts">
import { VDataTablePagination } from '@nodite-light/vuetify-data-table-pagination';

import {
  ILocaleMessage,
  ISourceWithMessages,
  SequelizePaginationISourceWithMessages,
} from '@/api/admin/data-contracts';
import { useLocaleStore } from '@/stores/modules/localeStore';
import lodash from '@/utils/lodash';

const localeStore = useLocaleStore();

interface QueryParams {
  langcode: string;
  source?: string;
  context?: string;
}

// Local data.
const myRefStore = ref({
  loading: false,
  sourceChange: {} as { [key: string]: ISourceWithMessages },

  langcodeOptions: [] as string[],
  pageResult: {} as SequelizePaginationISourceWithMessages,

  page: 1,
  itemsPerPage: 10,
});

const sources = computed(() => lodash.cloneDeep(myRefStore.value.pageResult.items));

// Query params.
const queryParamPage = computed({
  get: () => myRefStore.value.page || 1,
  set: (v: number) => {
    myRefStore.value.page = v;
    methods.loadList();
  },
});

const queryParamItemsPerPage = computed({
  get: () => myRefStore.value.itemsPerPage || 10,
  set: (v: number) => {
    myRefStore.value.itemsPerPage = v;
    methods.loadList();
  },
});

const queryParams = ref({
  langcode: localeStore.currLocale.langcode,
  source: undefined,
  context: undefined,
} as QueryParams);

// Methods.
const methods = {
  // Load list.
  async loadList() {
    myRefStore.value.loading = true;

    const pageResult = await localeStore.listSource({
      page: queryParamPage.value,
      itemsPerPage: queryParamItemsPerPage.value,
      ...queryParams.value,
    });

    myRefStore.value.pageResult = pageResult || ({} as SequelizePaginationISourceWithMessages);

    // Add empty message if not exists.
    lodash.forEach(myRefStore.value.pageResult.items, (item) => {
      if (!lodash.isEmpty(item.messages)) return;
      item.messages = [
        {
          srcId: item.srcId,
          message: '',
          langcode: queryParams.value.langcode,
        },
      ] as ILocaleMessage[];
    });

    myRefStore.value.loading = false;
  },
  // Reset search.
  async resetSearch() {
    queryParams.value = { langcode: localeStore.currLocale.langcode } as QueryParams;
    await methods.loadList();
  },
  // Save message.
  async save(sources: ISourceWithMessages[]) {
    await localeStore.upsertMessages(
      lodash.chain(sources).map('messages').flatten().uniq().value(),
    );

    await localeStore.initializeMessages(queryParams.value.langcode, true);
    await methods.loadList();

    lodash.forEach(sources, (source) => {
      delete myRefStore.value.sourceChange[source.srcId];
    });
  },
};

// Lifecycle.
onMounted(async () => {
  myRefStore.value.langcodeOptions = lodash.map(
    await localeStore.listAvailableLocales(),
    'langcode',
  );
  await methods.loadList();
});
</script>

<template>
  <v-card density="compact" class="mb-2 search">
    <v-card-text>
      <v-row dense>
        <v-col cols="12" lg="2" md="3" sm="6">
          <v-select
            density="compact"
            :label="$ndt('Langcode')"
            v-model="queryParams.langcode"
            :items="myRefStore.langcodeOptions"
            variant="outlined"
            hide-details
          ></v-select>
        </v-col>
        <v-col cols="12" lg="4" md="4" sm="6">
          <v-text-field
            density="compact"
            :label="$ndt('Source')"
            v-model="queryParams.source"
            variant="outlined"
            hide-details
            clearable
          ></v-text-field>
        </v-col>
        <v-col cols="12" lg="2" md="3" sm="6">
          <v-text-field
            density="compact"
            :label="$ndt('Context')"
            v-model="queryParams.context"
            variant="outlined"
            hide-details
            clearable
          ></v-text-field>
        </v-col>
        <v-spacer></v-spacer>
        <v-btn
          class="mr-2 align-self-center"
          color="primary"
          prepend-icon="mdi-magnify"
          density="comfortable"
          @click="
            myRefStore.page = 1;
            methods.loadList();
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

  <v-card density="compact" class="mb-2">
    <v-card-text>
      <v-row dense>
        <v-spacer></v-spacer>
        <v-btn
          class="mr-2 align-self-center"
          color="primary"
          density="comfortable"
          @click="methods.save(lodash.values(myRefStore.sourceChange))"
          :disabled="lodash.isEmpty(myRefStore.sourceChange)"
        >
          {{
            lodash.isEmpty(myRefStore.sourceChange)
              ? $ndt('Save All')
              : $ndt('Save All ({0})', [lodash.size(myRefStore.sourceChange)])
          }}
        </v-btn>
      </v-row>
    </v-card-text>
  </v-card>

  <v-data-table
    item-value="srcId"
    :headers="[
      { title: $ndt('Source'), width: '20%', value: 'source' },
      { title: $ndt('Context'), width: '10%', value: 'context' },
      {
        title: $ndt('Message', undefined, { context: 'locale.messages.header' }),
        value: 'messages',
      },
      { width: '15%', value: 'actions' },
    ]"
    :items="sources"
    :items-per-page="queryParamItemsPerPage"
  >
    <template v-slot:item.context="{ item }">
      {{ item.context || $ndt('(empty)') }}
    </template>
    <template v-slot:item.messages="{ item }">
      <v-textarea
        density="compact"
        variant="outlined"
        v-for="(message, idx) in item.messages"
        :key="idx"
        v-model="message.message"
        @update:model-value="lodash.set(myRefStore.sourceChange, item.srcId, item)"
        rows="1"
        auto-grow
        hide-details
      >
        <template
          v-if="
            lodash.find(myRefStore.pageResult.items, item)?.messages[idx].message !==
            message.message
          "
          v-slot:append
        >
          <v-btn
            class="align-self-center"
            color="primary"
            variant="tonal"
            density="compact"
            @click="methods.save([item])"
            :title="$ndt('Save')"
          >
            {{ $ndt('Save') }}
          </v-btn>
        </template>
      </v-textarea>
    </template>

    <template v-slot:bottom>
      <VDataTablePagination
        v-model:page="queryParamPage"
        v-model:items-per-page="queryParamItemsPerPage"
        :current-count="myRefStore.pageResult.count"
        :total-count="myRefStore.pageResult.totalCount"
        :total-page="myRefStore.pageResult.totalPage"
      ></VDataTablePagination>
    </template>
  </v-data-table>
</template>

<style scoped lang="css">
.v-data-table :deep(.v-input__append) {
  padding-top: 0 !important;
}
</style>
