<script setup lang="ts">
import { IconPicker } from '@nodite-light/vuetify-icon-picker';
import lodash from 'lodash';
import { toast } from 'vuetify-sonner';

import { IMenu } from '@/api/admin/data-contracts';
import TreeSelect from '@/components/form/TreeSelect.vue';
import i18n from '@/plugins/i18n';
import { useMenuStore } from '@/stores/modules/menuStore';

const menuStore = useMenuStore();

const emit = defineEmits(['update:dialog', 'update:menuId', 'save']);

const props = defineProps({
  menus: {
    type: Array as PropType<IMenu[]>,
    default: () => [] as IMenu[],
  },
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

// Local Data.
const myRefStore = ref({
  title: '',
  parentIdDialog: false,
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
  parentId: [
    (v: string) => lodash.isString(v) || (!v && i18n.ndt('Parent Menu is required.')),
    (v: string) => !menuId.value || v !== menuId.value || i18n.ndt('Parent Menu cannot be itself.'),
  ],
  iType: [(v: string) => !!v || i18n.ndt('Menu Type is required.')],
  menuName: [(v: string) => !!v || i18n.ndt('Menu Name is required.')],
  path: [(v: string) => !v || v.startsWith('/') || i18n.ndt('Path must start with slash (/).')],
  redirect: [
    (v: string) => !v || v.startsWith('/') || i18n.ndt('Redirect must start with slash (/).'),
  ],
  layout: [(v: string) => !!v || i18n.ndt('Layout is required')],
  perms: [(v: string) => !v || v.split(':').length >= 3 || i18n.ndt('Invalid perms format.')],
});

// Methods.
const methods = {
  // Load form data.
  async loadFormData() {
    formData.value = menuId.value
      ? (await menuStore.query(menuId.value)) || ({} as IMenu)
      : ({} as IMenu);

    myRefStore.value.title = menuId.value
      ? i18n.ndt('Edit Menu - {0}', [formData.value.menuName])
      : i18n.ndt('New Menu');
  },
  // Reset errors.
  resetErrors() {
    myRefStore.value.error = false;
    myRefStore.value.errorMessages = '';
  },
  // Close.
  close() {
    if (myRefStore.value.isSaving) {
      toast.warning(i18n.ndt("It's saving, please wait a moment."));
      return;
    }
    dialog.value = false;
    menuId.value = '';
  },
  // Save.
  async save() {
    myRefStore.value.isSaving = true;

    const { valid } = await refForm.value.validate();

    if (!valid || !myRefStore.value.isFormValid) {
      myRefStore.value.isSaving = false;
      return;
    }

    try {
      await (formData.value.menuId
        ? menuStore.edit(formData.value)
        : menuStore.create(formData.value));

      toast.success(i18n.ndt('Saved successfully.'));
    } finally {
      myRefStore.value.isSaving = false;
    }

    methods.close();

    emit('save');
  },
};

// Lifecycle.
watch(
  () => props.dialog,
  (v) => v && methods.loadFormData(),
);
</script>

<template>
  <v-dialog
    v-model="dialog"
    @click:outside="methods.close"
    :persistent="myRefStore.isSaving"
    max-width="750"
  >
    <template #activator="{ props }">
      <v-btn v-bind="props" prepend-icon="mdi-creation" variant="tonal" density="comfortable">
        {{ $ndt('Create Menu') }}
      </v-btn>
    </template>

    <v-card density="compact" elevation="8" rounded="lg">
      <v-card-title class="pt-4">
        <v-label>{{ myRefStore.title }}</v-label>
        <v-spacer></v-spacer>
        <v-btn icon @click="methods.close" density="compact" variant="text">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>

      <v-card-text>
        <v-form
          ref="refForm"
          v-model="myRefStore.isFormValid"
          :disabled="myRefStore.isSaving"
          lazy-validation
        >
          <v-container class="px-10 pb-0">
            <v-row dense>
              <!-- parent & order -->
              <v-col>
                <TreeSelect
                  v-model="formData.parentId"
                  v-model:dialog="myRefStore.parentIdDialog"
                  :items="menus"
                  item-title="menuName"
                  item-value="menuId"
                  parent-value="parentId"
                  variant="outlined"
                  :rules="formRules.parentId"
                  :error="myRefStore.error"
                  :disabled-items="menuId ? [formData.menuId] : []"
                  show-root
                  chips
                  clearable
                >
                  <template #prepend>
                    <v-label>{{ $ndt('Parent Menu') }}:</v-label>
                  </template>
                  <template #chip="{ item }">
                    <v-chip>{{ $ndt(item.raw.menuName) }}</v-chip>
                  </template>
                </TreeSelect>
              </v-col>

              <v-col cols="4">
                <v-text-field
                  type="number"
                  density="compact"
                  :label="$ndt('Order')"
                  v-model="formData.orderNum"
                  validate-on="blur"
                  :error="myRefStore.error"
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
                  :error="myRefStore.error"
                  inline
                >
                  <template #prepend>
                    <v-label>{{ $ndt('Menu Type') }}:</v-label>
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
                  :error="myRefStore.error"
                  variant="outlined"
                >
                  <template #prepend>
                    <v-label> {{ $ndt('Menu Name') }}: </v-label>
                  </template>
                </v-text-field>
              </v-col>
              <v-col cols="5">
                <IconPicker
                  v-model="formData.icon"
                  v-model:dialog="myRefStore.iconDialog"
                  :label="$ndt('Icon')"
                  :disabled="myRefStore.isSaving"
                  :error="myRefStore.error"
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
                  :error="myRefStore.error"
                  density="compact"
                  variant="outlined"
                >
                  <template #prepend>
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
                  :error="myRefStore.error"
                  density="compact"
                  variant="outlined"
                >
                  <template #prepend-inner>
                    <v-label>{{ $ndt('Path') }}:</v-label>
                  </template>
                </v-text-field>
              </v-col>
              <v-col>
                <v-text-field
                  v-model="formData.redirect"
                  :rules="formRules.redirect"
                  validate-on="blur"
                  :error="myRefStore.error"
                  density="compact"
                  variant="outlined"
                >
                  <template #prepend-inner>
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
                  validate-on="blur"
                  :error="myRefStore.error"
                >
                  <template #prepend>
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
                  :error="myRefStore.error"
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
                  validate-on="blur"
                  :error="myRefStore.error"
                  inline
                >
                  <template #prepend>
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
        <v-btn color="blue darken-1" @click="methods.close" :disabled="myRefStore.isSaving">
          {{ $ndt('Cancel') }}
        </v-btn>
        <v-btn @click="methods.save" :loading="myRefStore.isSaving" :disabled="myRefStore.isSaving">
          {{ $ndt('Save') }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<style scoped lang="css"></style>
