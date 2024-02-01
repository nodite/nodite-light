<script setup lang="ts">
import { IconPicker } from '@nodite-light/vuetify-icon-picker';
import { toast } from 'vuetify-sonner';

import { DataTreeIMenu, IMenu } from '@/api/admin/data-contracts';
import i18n from '@/plugins/i18n';
import { useMenuStore } from '@/stores/modules/menuStore';
import lodash from '@/utils/lodash';

const menuStore = useMenuStore();

const emit = defineEmits(['update:dialog', 'update:menuId', 'save']);

const props = defineProps({
  dialog: {
    type: Boolean,
    default: false,
  },
  menuId: {
    type: String,
    default: '',
  },
});

const dialog = computed({
  get: () => props.dialog,
  set: (v) => emit('update:dialog', v),
});

const menuId = computed({
  get: () => props.menuId,
  set: (v) => emit('update:menuId', v),
});

// static Data.
const staticData = ref({
  menus: [] as DataTreeIMenu[],
});

// local Data.
const localData = ref({
  iconDialog: false,
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
  parentId: [(v: string) => lodash.isString(v) || (!v && i18n.ndt('Parent Menu is required.'))],
  orderNum: [],
  iType: [(v: string) => !!v || i18n.ndt('Menu Type is required.')],
  menuName: [(v: string) => !!v || i18n.ndt('Menu Name is required.')],
  icon: [],
  path: [(v: string) => !v || v.startsWith('/') || i18n.ndt('Path must start with slash (/).')],
  redirect: [],
  component: [],
  layout: [(v: string) => !!v || i18n.ndt('Layout is required')],
  perms: [],
  hidden: [],
});

// methods.
const methods = {
  async loadFormData() {
    formData.value = menuId.value
      ? (await menuStore.query(menuId.value)) || ({} as IMenu)
      : ({} as IMenu);
  },
  closeMenuForm() {
    if (localData.value.isSaving) {
      toast.warning(i18n.ndt("It's saving, please wait a moment."));
      return;
    }
    dialog.value = false;
    menuId.value = '';
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
      await (formData.value.menuId
        ? menuStore.edit(formData.value)
        : menuStore.create(formData.value));

      toast.success(i18n.ndt('Saved successfully.'));
    } finally {
      localData.value.isSaving = false;
    }

    methods.closeMenuForm();

    emit('save');
  },
};

onMounted(() => {
  menuStore.listTree().then((res) => {
    staticData.value.menus = [{ menuName: 'Root', menuId: '' } as IMenu, ...res];
  });
});

watchEffect(() => {
  methods.loadFormData();
});
</script>

<template>
  <v-dialog
    v-model="dialog"
    @click:outside="methods.closeMenuForm"
    :persistent="localData.isSaving"
    max-width="750"
  >
    <template v-slot:activator="{ props }">
      <v-btn v-bind="props" prepend-icon="mdi-creation" variant="tonal" density="comfortable">
        {{ $ndt('Create Menu') }}
      </v-btn>
    </template>

    <v-card density="compact" elevation="8" rounded="lg">
      <v-card-title class="pt-4">
        <v-label>
          {{ menuId ? $ndt('Edit Menu - {0}', [formData.menuName]) : $ndt('New Menu') }}
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
                    <v-label>{{ $ndt('Parent Menu') }}:</v-label>
                  </template>
                  <template v-slot:chip="{ item }">
                    <v-chip>{{ $ndt(item.raw.menuName) }}</v-chip>
                  </template>
                  <template v-slot:item="{ props, item }">
                    <v-list-item v-bind="props" :title="$ndt(item.raw.menuName)"></v-list-item>
                  </template>
                </v-select>
              </v-col>

              <v-col cols="4">
                <v-text-field
                  type="number"
                  density="compact"
                  :label="$ndt('Order')"
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
                    <v-label> {{ $ndt('Menu Type') }}: </v-label>
                  </template>
                  <v-radio :label="$ndt('Overline')" value="overline"></v-radio>
                  <v-radio :label="$ndt('Directory')" value="directory"></v-radio>
                  <v-radio :label="$ndt('Menu')" value="menu"></v-radio>
                  <v-radio :label="$ndt('Action')" value="action"></v-radio>
                </v-radio-group>
              </v-col>
            </v-row>

            <v-row dense>
              <!-- menu name & icon -->
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
                    <v-label> {{ $ndt('Menu Name') }}: </v-label>
                  </template>
                </v-text-field>
              </v-col>
              <v-col cols="4">
                <IconPicker
                  v-model="formData.icon"
                  v-model:dialog="localData.iconDialog"
                  v-model:error="localData.error"
                ></IconPicker>
              </v-col>
            </v-row>

            <v-row dense>
              <!-- perms -->
              <v-col>
                <v-text-field
                  v-model="formData.perms"
                  :hint="$ndt('Format: [dom]:[obj]:[act], e.g. admin:menu:create')"
                  :rules="formRules.perms"
                  validate-on="blur"
                  :error="localData.error"
                  density="compact"
                  variant="outlined"
                >
                  <template v-slot:prepend>
                    <v-label> {{ $ndt('Permission') }}: </v-label>
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
                    <v-label>{{ $ndt('Path') }}:</v-label>
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
                    <v-label>{{ $ndt('redirect to') }}:</v-label>
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
                  :hint="$ndt('The path of the component to be rendered.')"
                  :rules="formRules.component"
                  validate-on="blur"
                  :error="localData.error"
                >
                  <template v-slot:prepend>
                    <v-label>{{ $ndt('Component') }}:</v-label>
                  </template>
                </v-text-field>
              </v-col>
              <v-col cols="4">
                <v-select
                  density="compact"
                  v-model="formData.layout"
                  :items="[
                    { value: 'default', title: $ndt('Default') },
                    { value: 'auth', title: $ndt('Auth') },
                    { value: 'landing', title: $ndt('Landing') },
                    { value: 'ui', title: $ndt('UI') },
                  ]"
                  :label="$ndt('Layout')"
                  :hint="$ndt('The layout used for component render.')"
                  :rules="formRules.layout"
                  validate-on="blur"
                  :error="localData.error"
                  variant="outlined"
                  clearable
                ></v-select>
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
                    <v-label>{{ $ndt('Visibility') }}:</v-label>
                  </template>
                  <v-radio :label="$ndt('Show')" :value="0"></v-radio>
                  <v-radio :label="$ndt('Hidden')" :value="1"></v-radio>
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
          {{ $ndt('Cancel') }}
        </v-btn>
        <v-btn @click="methods.save" :loading="localData.isSaving" :disabled="localData.isSaving">
          {{ $ndt('Save') }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<style scoped lang="css"></style>
