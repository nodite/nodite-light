<!--
* Component: MenuForm.vue
* Project: @nodite-light/admin-web
* Created Date: We Dec 2023
* Author: Oscaner Miao
-----
* Last Modified: Thu Dec 28 2023
* Modified By: Oscaner Miao
-----
* Copyright (c) 2023 @nodite
-->

<script setup lang="ts">
import lodash from 'lodash';
import { PropType } from 'vue';

import { IMenu } from '@/api/admin/data-contracts';
import { useMenuStore } from '@/stores/modules/menuStore';
import * as menuUtil from '@/utils/menu';

const menuStore = useMenuStore();

const emit = defineEmits(['close-menu-form']);

const props = defineProps({
  dialog: {
    type: Boolean,
    default: false,
  },
  item: {
    type: Object as PropType<IMenu>,
    default: undefined,
  },
});

const localData = ref({
  dialog: props.dialog,
  form: props.item || ({} as IMenu),
  menus: [] as IMenu[],
  openIconPicker: false,
  layouts: [
    { value: 'default', title: 'Default' },
    { value: 'auth', title: 'Auth' },
    { value: 'landing', title: 'Landing' },
    { value: 'ui', title: 'UI' },
  ],
});

watchEffect(() => {
  localData.value.dialog = props.dialog;
  localData.value.form = lodash.cloneDeep(props.item) || ({} as IMenu);

  menuStore.getMenuList().then((res) => {
    localData.value.menus = [
      { menuName: 'Root', iKey: 'views.menu.form.parentRoot', menuId: 0 } as IMenu,
      ...res,
    ];
  });
});

const methods = {
  clearLocalData() {
    localData.value.dialog = false;
    localData.value.form = {} as IMenu;
  },
  closeMenuForm() {
    methods.clearLocalData();
    emit('close-menu-form');
  },
  closeIconPicker() {
    localData.value.openIconPicker = false;
  },
  inputIconPicker(icon: string) {
    localData.value.form.icon = icon;
  },
  save() {
    console.log(localData.value.form);
    console.log('save');
  },
};
</script>

<template>
  <v-dialog v-model="localData.dialog" @click:outside="methods.closeMenuForm" max-width="700">
    <template v-slot:activator="{ props }">
      <v-btn v-bind="props" prepend-icon="mdi-creation" variant="tonal" density="comfortable">
        {{ $t('views.menu.form.create') }}
      </v-btn>
    </template>

    <v-card density="compact" elevation="8" rounded="lg">
      <v-card-title class="pt-4">
        <v-label>
          {{
            lodash.isEmpty(props.item)
              ? $t('views.menu.form.newHeader')
              : $t('views.menu.form.editHeader', [props.item.menuName])
          }}
        </v-label>
        <v-spacer></v-spacer>
        <v-btn icon @click="methods.closeMenuForm" density="compact" variant="text">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>

      <v-card-text>
        <v-container class="px-10 pb-0">
          <v-row dense>
            <v-col>
              <!-- todo: v-treeview -->
              <v-select
                density="compact"
                v-model="localData.form.parentId"
                :items="localData.menus"
                item-title="menuName"
                item-value="menuId"
                prepend-inner-icon="mdi-sort-variant"
                variant="outlined"
                chips
                clearable
              >
                <template v-slot:prepend>
                  <v-label>{{ $t('views.menu.form.parent') }}:</v-label>
                </template>
                <template v-slot:chip="{ item }">
                  <v-chip>{{ menuUtil.toI18TitleWithMenu(item.raw) }}</v-chip>
                </template>
                <template v-slot:item="{ props, item }">
                  <v-list-item
                    v-bind="props"
                    :title="menuUtil.toI18TitleWithMenu(item.raw)"
                  ></v-list-item>
                </template>
              </v-select>
            </v-col>

            <v-col cols="4">
              <v-text-field
                type="number"
                density="compact"
                :label="$t('views.menu.form.orderNum')"
                v-model="localData.form.orderNum"
                variant="outlined"
                required
              ></v-text-field>
            </v-col>
          </v-row>

          <v-row dense>
            <!-- menu type -->
            <v-col>
              <v-radio-group v-model="localData.form.iType" inline>
                <template v-slot:prepend>
                  <v-label>{{ $t('views.menu.form.iType') }}:</v-label>
                </template>
                <v-radio :label="$t('views.menu.type.overline')" value="overline"></v-radio>
                <v-radio :label="$t('views.menu.type.directory')" value="directory"></v-radio>
                <v-radio :label="$t('views.menu.type.menu')" value="menu"></v-radio>
                <v-radio :label="$t('views.menu.type.action')" value="action"></v-radio>
              </v-radio-group>
            </v-col>
          </v-row>

          <v-row dense>
            <!-- menu name -->
            <v-col>
              <v-text-field
                density="compact"
                v-model="localData.form.menuName"
                variant="outlined"
                required
              >
                <template v-slot:prepend>
                  <v-label>{{ $t('views.menu.form.menuName') }}:</v-label>
                </template>
              </v-text-field>
            </v-col>
          </v-row>

          <v-row v-if="localData.form.iType !== 'action'" dense>
            <!-- i18n key & icon -->
            <v-col>
              <v-text-field
                density="compact"
                v-model="localData.form.iKey"
                :label="$t('views.menu.form.iKey')"
                variant="outlined"
                :hint="$t('views.menu.form.iKeyHint')"
              ></v-text-field>
            </v-col>
            <v-col>
              <v-text-field
                density="compact"
                v-model="localData.form.icon"
                :label="$t('views.menu.form.icon')"
                :prepend-inner-icon="localData.form.icon"
                variant="outlined"
                @click="localData.openIconPicker = !localData.openIconPicker"
                :readonly="localData.form.iType !== 'overline'"
                :disabled="localData.form.iType === 'overline'"
              >
                <template v-slot:append-inner>
                  <icon-picker
                    :dialog="localData.openIconPicker"
                    @close-icon-picker="methods.closeIconPicker"
                    @input="methods.inputIconPicker"
                  ></icon-picker>
                </template>
              </v-text-field>
            </v-col>
          </v-row>

          <v-row v-if="localData.form.iType === 'menu'" dense>
            <!-- path & redirect -->
            <v-col>
              <v-text-field density="compact" v-model="localData.form.path" variant="outlined">
                <template v-slot:prepend-inner>
                  <v-label>{{ $t('views.menu.form.path') }}:</v-label>
                </template>
              </v-text-field>
            </v-col>
            <v-col>
              <v-text-field density="compact" v-model="localData.form.redirect" variant="outlined">
                <template v-slot:prepend-inner>
                  <v-label>{{ $t('views.menu.form.redirect') }}:</v-label>
                </template>
              </v-text-field>
            </v-col>
          </v-row>

          <v-row v-if="localData.form.iType === 'menu'" dense>
            <!-- component & layout -->
            <v-col>
              <v-text-field
                density="compact"
                v-model="localData.form.component"
                variant="outlined"
                :hint="$t('views.menu.form.componentHint')"
              >
                <template v-slot:prepend>
                  <v-label>{{ $t('views.menu.form.component') }}:</v-label>
                </template>
              </v-text-field>
            </v-col>
            <v-col cols="4">
              <v-select
                density="compact"
                v-model="localData.form.layout"
                :items="localData.layouts"
                :label="$t('views.menu.form.layout')"
                :hint="$t('views.menu.form.layoutHint')"
                variant="outlined"
                clearable
              ></v-select>
            </v-col>
          </v-row>

          <v-row dense>
            <!-- perms -->
            <v-col>
              <v-text-field density="compact" v-model="localData.form.perms" variant="outlined">
                <template v-slot:prepend>
                  <v-label>{{ $t('views.menu.form.perms') }}:</v-label>
                </template>
              </v-text-field>
            </v-col>
          </v-row>

          <v-row dense>
            <!-- visibility & status -->
            <v-col>
              <v-radio-group v-model="localData.form.hidden" inline>
                <template v-slot:prepend>
                  <v-label>{{ $t('views.menu.form.hidden') }}:</v-label>
                </template>
                <v-radio :label="$t('common.visibility.show')" :value="0"></v-radio>
                <v-radio :label="$t('common.visibility.hidden')" :value="1"></v-radio>
              </v-radio-group>
            </v-col>
            <v-col>
              <v-radio-group v-model="localData.form.status" inline>
                <template v-slot:prepend>
                  <v-label>{{ $t('views.menu.form.status') }}:</v-label>
                </template>
                <v-radio :label="$t('common.status.enabled')" :value="1"></v-radio>
                <v-radio :label="$t('common.status.disabled')" :value="0"></v-radio>
              </v-radio-group>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1" @click="methods.closeMenuForm">
          {{ $t('views.menu.form.cancel') }}
        </v-btn>
        <v-btn @click="methods.save">{{ $t('views.menu.form.save') }}</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<style scoped lang="css"></style>
