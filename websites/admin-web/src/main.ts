/**
 * main.js
 *
 */

// Components
import 'vue-virtual-scroller/dist/vue-virtual-scroller.css';
import '@/styles/main.scss';

import { autoAnimatePlugin } from '@formkit/auto-animate/vue';
import { IconPicker } from '@nodite-light/vuetify-icon-picker';
import { VTreeDataTable } from '@nodite-light/vuetify-tree-data-table';
import MasonryWall from '@yeger/vue-masonry-wall';
// Composables
import { createApp } from 'vue';
import VueVirtualScroller from 'vue-virtual-scroller';
import VueApexCharts from 'vue3-apexcharts';
import Vue3Lottie from 'vue3-lottie';
import PerfectScrollbar from 'vue3-perfect-scrollbar';

import App from '@/App.vue';
import i18n from '@/plugins/i18n';
import vuetify from '@/plugins/vuetify';
import router from '@/router';
import pinia from '@/stores';

const app = createApp(App);

app.use(router);
app.use(PerfectScrollbar);
app.use(MasonryWall);
app.use(VueVirtualScroller);
app.use(VueApexCharts);
app.use(pinia);
app.use(i18n);
app.use(Vue3Lottie, { name: 'LottieAnimation' });
app.use(autoAnimatePlugin);
app.use(vuetify);
app.component('icon-picker', IconPicker);
app.component('v-tree-data-table', VTreeDataTable);
app.mount('#app');
