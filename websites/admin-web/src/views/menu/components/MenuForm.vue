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
import { VIconPicker } from '@nodite-light/vuetify-icon-picker';
import lodash from 'lodash';
import { toast } from 'vuetify-sonner';

import { IMenu, MenuTree } from '@/api/admin/data-contracts';
import i18n, { $tnd } from '@/plugins/i18n';
import { useMenuStore } from '@/stores/modules/menuStore';

const menuStore = useMenuStore();

const emit = defineEmits(['close', 'save']);

const props = defineProps({
  dialog: {
    type: Boolean,
    default: false,
  },
  menuId: {
    type: Number,
    default: 0,
  },
});

// static Data.
const staticData = ref({
  menus: [] as MenuTree[],
  layouts: [
    { value: 'default', title: 'Default' },
    { value: 'auth', title: 'Auth' },
    { value: 'landing', title: 'Landing' },
    { value: 'ui', title: 'UI' },
  ],
});

// local Data.
const defLocalData = {
  dialog: props.dialog,
  openIconPicker: false,
  isFormValid: true,
  isSaving: false,
  error: false,
  errorMessages: '',
};

const localData = ref(lodash.cloneDeep(defLocalData));

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
      // v required
      !!v || i18n.global.t('common.form.required', [i18n.global.t('views.menu.form.layout')]),
    (v: string) =>
      // v is in layouts
      lodash.map(staticData.value.layouts, 'value').includes(v) ||
      i18n.global.t('common.form.invalid', [v]),
  ],
  perms: [],
  hidden: [(v: number) => [0, 1].includes(v) || i18n.global.t('common.form.invalid')],
});

// methods.
const methods = {
  async fillFormData() {
    let menu = undefined;
    if (props.menuId > 0) {
      menu = await menuStore.query(props.menuId);
    }
    formData.value = lodash.isUndefined(menu) ? ({} as IMenu) : menu;
  },
  closeMenuForm() {
    if (localData.value.isSaving) {
      toast.warning(i18n.global.t('common.form.saving'));
      return;
    }
    localData.value = lodash.cloneDeep(defLocalData);
    formData.value = {} as IMenu;
    emit('close');
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

    try {
      await (formData.value.menuId > 0
        ? menuStore.edit(formData.value)
        : menuStore.create(formData.value));
    } finally {
      localData.value.isSaving = false;
    }

    toast.success(i18n.global.t('common.form.success'));

    methods.closeMenuForm();
    emit('save');
  },
};

onMounted(() => {
  menuStore.listTree().then((res) => {
    staticData.value.menus = [
      { menuName: 'Root', iKey: 'views.menu.form.parentRoot', menuId: 0 } as IMenu,
      ...res,
    ];
  });
});

watchEffect(() => {
  localData.value.dialog = props.dialog;
  methods.fillFormData();
});
</script>

<template>
  <v-dialog
    v-model="localData.dialog"
    @click:outside="methods.closeMenuForm"
    :persistent="localData.isSaving"
    max-width="750"
  >
    <template v-slot:activator="{ props }">
      <v-btn v-bind="props" prepend-icon="mdi-creation" variant="tonal" density="comfortable">
        {{ $t('common.form.create', [$t('views.menu.form.title')]) }}
      </v-btn>
    </template>

    <v-card density="compact" elevation="8" rounded="lg">
      <v-card-title class="pt-4">
        <v-label>
          {{
            props.menuId > 0
              ? $t('common.form.editHeader', [$t('views.menu.form.title'), formData.menuName])
              : $t('common.form.newHeader', [$t('views.menu.form.title')])
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
                    <v-chip>{{ $tnd(item.raw.iKey, item.raw.menuName) }}</v-chip>
                  </template>
                  <template v-slot:item="{ props, item }">
                    <v-list-item
                      v-bind="props"
                      :title="$tnd(item.raw.iKey, item.raw.menuName)"
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
                    <VIconPicker
                      :dialog="localData.openIconPicker"
                      @close="methods.closeIconPicker"
                      @input="methods.inputIconPicker"
                    ></VIconPicker>
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
                  :hint="$t('views.menu.form.permsHint')"
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
              <!-- visibility -->
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
            </v-row>
          </v-container>
        </v-form>
      </v-card-text>

      <v-card-actions>
        <!-- actions -->
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1" @click="methods.closeMenuForm" :disabled="localData.isSaving">
          {{ $t('common.form.cancel') }}
        </v-btn>
        <v-btn @click="methods.save" :loading="localData.isSaving" :disabled="localData.isSaving">
          {{ $t('common.form.save') }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<style scoped lang="css"></style>
