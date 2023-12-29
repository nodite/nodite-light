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
import i18n from '@/plugins/i18n';
import { useMenuStore } from '@/stores/modules/menuStore';
import { useSnackbarStore } from '@/stores/modules/snackbarStore';
import * as menuUtil from '@/utils/menu';

const menuStore = useMenuStore();
const snackbarStore = useSnackbarStore();

const emit = defineEmits(['close-menu-form', 'clean-menu-store']);

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

// Static Data.
const staticData = ref({
  menus: [] as IMenu[],
  layouts: [
    { value: 'default', title: 'Default' },
    { value: 'auth', title: 'Auth' },
    { value: 'landing', title: 'Landing' },
    { value: 'ui', title: 'UI' },
  ],
  defaultFormData: {
    parentId: 0,
    hidden: 0,
    status: 1,
  } as IMenu,
});

// Local Data.
const localData = ref({
  dialog: props.dialog,
  openIconPicker: false,
  isFormValid: true,
  isSaving: false,
  error: false,
  errorMessages: '',
});

// Form.
const refForm = ref();
const formData = ref({} as IMenu);
const formRules = ref({
  parentId: [
    (v: number) =>
      (lodash.isNumber(v) && v >= 0) ||
      i18n.global.t('common.form.required', [i18n.global.t('views.menu.form.parent')]),
  ],
  orderNum: [],
  iType: [
    (v: string) =>
      !!v || i18n.global.t('common.form.required', [i18n.global.t('views.menu.form.iType')]),
  ],
  menuName: [
    (v: string) =>
      !!v || i18n.global.t('common.form.required', [i18n.global.t('views.menu.form.menuName')]),
  ],
  iKey: [],
  icon: [],
  path: [],
  redirect: [],
  component: [],
  layout: [
    (v: string) =>
      // v exists and v is in layouts
      (!!v && lodash.map(staticData.value.layouts, 'value').includes(v)) ||
      i18n.global.t('common.form.invalid', [v]),
  ],
  perms: [],
  hidden: [(v: number) => [0, 1].includes(v) || i18n.global.t('common.form.invalid')],
  status: [(v: number) => [0, 1].includes(v) || i18n.global.t('common.form.invalid')],
});

watchEffect(() => {
  localData.value.dialog = props.dialog;

  formData.value = lodash.isEmpty(props.item)
    ? staticData.value.defaultFormData
    : lodash.cloneDeep(props.item);

  menuStore.getMenuList().then((res) => {
    staticData.value.menus = [
      { menuName: 'Root', iKey: 'views.menu.form.parentRoot', menuId: 0 } as IMenu,
      ...res,
    ];
  });
});

// Methods.
const methods = {
  clearLocalData() {
    localData.value.dialog = false;
    localData.value.openIconPicker = false;
    localData.value.isSaving = false;
    localData.value.isFormValid = true;
    formData.value = staticData.value.defaultFormData;
  },
  closeMenuForm() {
    if (localData.value.isSaving) {
      snackbarStore.showWarningMessage(i18n.global.t('common.form.saving'));
      return;
    }
    methods.clearLocalData();
    emit('close-menu-form');
  },
  closeIconPicker() {
    localData.value.openIconPicker = false;
  },
  inputIconPicker(icon: string) {
    formData.value.icon = icon;
  },
  resetErrors() {
    localData.value.error = false;
    localData.value.errorMessages = '';
  },
  async save() {
    localData.value.isSaving = true;

    const { valid } = await refForm.value.validate();

    if (!valid || !localData.value.isFormValid) {
      localData.value.isSaving = false;
      return;
    }

    await (formData.value.menuId
      ? menuStore.updateMenu(formData.value)
      : menuStore.createMenu(formData.value));

    localData.value.isSaving = false;

    snackbarStore.showSuccessMessage(i18n.global.t('common.form.success'));

    methods.closeMenuForm();
    emit('clean-menu-store');
  },
};
</script>

<template>
  <v-dialog
    v-model="localData.dialog"
    @click:outside="methods.closeMenuForm"
    :persistent="localData.isSaving"
    max-width="700"
  >
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
        <v-form
          ref="refForm"
          v-model="localData.isFormValid"
          :disabled="localData.isSaving"
          lazy-validation
        >
          <v-container class="px-10 pb-0">
            <v-row dense>
              <v-col>
                <!-- todo: v-treeview -->
                <v-select
                  density="compact"
                  v-model="formData.parentId"
                  :items="staticData.menus"
                  item-title="menuName"
                  item-value="menuId"
                  prepend-inner-icon="mdi-sort-variant"
                  variant="outlined"
                  :rules="formRules.parentId"
                  validate-on="blur"
                  :error="localData.error"
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
                  v-model="formData.orderNum"
                  :rules="formRules.orderNum"
                  validate-on="blur"
                  :error="localData.error"
                  variant="outlined"
                ></v-text-field>
              </v-col>
            </v-row>

            <v-row dense>
              <!-- menu type -->
              <v-col>
                <v-radio-group
                  v-model="formData.iType"
                  :rules="formRules.iType"
                  validate-on="blur"
                  :error="localData.error"
                  inline
                >
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
                  v-model="formData.menuName"
                  :rules="formRules.menuName"
                  validate-on="blur"
                  :error="localData.error"
                  variant="outlined"
                >
                  <template v-slot:prepend>
                    <v-label>{{ $t('views.menu.form.menuName') }}:</v-label>
                  </template>
                </v-text-field>
              </v-col>
            </v-row>

            <v-row v-if="formData.iType !== 'action'" dense>
              <!-- i18n key & icon -->
              <v-col>
                <v-text-field
                  density="compact"
                  v-model="formData.iKey"
                  :label="$t('views.menu.form.iKey')"
                  variant="outlined"
                  :hint="$t('views.menu.form.iKeyHint')"
                  :rules="formRules.iKey"
                  validate-on="blur"
                  :error="localData.error"
                ></v-text-field>
              </v-col>
              <v-col>
                <v-text-field
                  density="compact"
                  v-model="formData.icon"
                  :label="$t('views.menu.form.icon')"
                  :prepend-inner-icon="formData.icon"
                  variant="outlined"
                  @click="localData.openIconPicker = !localData.openIconPicker"
                  :readonly="formData.iType !== 'overline'"
                  :disabled="formData.iType === 'overline' || localData.isSaving"
                  :rules="formRules.icon"
                  validate-on="blur"
                  :error="localData.error"
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

            <v-row v-if="formData.iType === 'menu'" dense>
              <!-- path & redirect -->
              <v-col>
                <v-text-field
                  v-model="formData.path"
                  :rules="formRules.path"
                  validate-on="blur"
                  :error="localData.error"
                  density="compact"
                  variant="outlined"
                >
                  <template v-slot:prepend-inner>
                    <v-label>{{ $t('views.menu.form.path') }}:</v-label>
                  </template>
                </v-text-field>
              </v-col>
              <v-col>
                <v-text-field
                  v-model="formData.redirect"
                  :rules="formRules.redirect"
                  validate-on="blur"
                  :error="localData.error"
                  density="compact"
                  variant="outlined"
                >
                  <template v-slot:prepend-inner>
                    <v-label>{{ $t('views.menu.form.redirect') }}:</v-label>
                  </template>
                </v-text-field>
              </v-col>
            </v-row>

            <v-row v-if="formData.iType === 'menu'" dense>
              <!-- component & layout -->
              <v-col>
                <v-text-field
                  v-model="formData.component"
                  density="compact"
                  variant="outlined"
                  :hint="$t('views.menu.form.componentHint')"
                  :rules="formRules.component"
                  validate-on="blur"
                  :error="localData.error"
                >
                  <template v-slot:prepend>
                    <v-label>{{ $t('views.menu.form.component') }}:</v-label>
                  </template>
                </v-text-field>
              </v-col>
              <v-col cols="4">
                <v-select
                  density="compact"
                  v-model="formData.layout"
                  :items="staticData.layouts"
                  :label="$t('views.menu.form.layout')"
                  :hint="$t('views.menu.form.layoutHint')"
                  :rules="formRules.layout"
                  validate-on="blur"
                  :error="localData.error"
                  variant="outlined"
                  clearable
                ></v-select>
              </v-col>
            </v-row>

            <v-row dense>
              <!-- perms -->
              <v-col>
                <v-text-field
                  v-model="formData.perms"
                  :rules="formRules.perms"
                  validate-on="blur"
                  :error="localData.error"
                  density="compact"
                  variant="outlined"
                >
                  <template v-slot:prepend>
                    <v-label>{{ $t('views.menu.form.perms') }}:</v-label>
                  </template>
                </v-text-field>
              </v-col>
            </v-row>

            <v-row dense>
              <!-- visibility & status -->
              <v-col>
                <v-radio-group
                  v-model="formData.hidden"
                  :rules="formRules.hidden"
                  validate-on="blur"
                  :error="localData.error"
                  inline
                >
                  <template v-slot:prepend>
                    <v-label>{{ $t('views.menu.form.hidden') }}:</v-label>
                  </template>
                  <v-radio :label="$t('common.visibility.show')" :value="0"></v-radio>
                  <v-radio :label="$t('common.visibility.hidden')" :value="1"></v-radio>
                </v-radio-group>
              </v-col>
              <v-col>
                <v-radio-group
                  v-model="formData.status"
                  :rules="formRules.status"
                  validate-on="blur"
                  :error="localData.error"
                  inline
                >
                  <template v-slot:prepend>
                    <v-label>{{ $t('views.menu.form.status') }}:</v-label>
                  </template>
                  <v-radio :label="$t('common.status.enabled')" :value="1"></v-radio>
                  <v-radio :label="$t('common.status.disabled')" :value="0"></v-radio>
                </v-radio-group>
              </v-col>
            </v-row>
          </v-container>
        </v-form>
      </v-card-text>

      <v-card-actions>
        <!-- actions -->
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1" @click="methods.closeMenuForm" :disabled="localData.isSaving">
          {{ $t('views.menu.form.cancel') }}
        </v-btn>
        <v-btn @click="methods.save" :loading="localData.isSaving" :disabled="localData.isSaving">
          {{ $t('views.menu.form.save') }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<style scoped lang="css"></style>