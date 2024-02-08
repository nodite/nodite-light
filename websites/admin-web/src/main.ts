/**
 * main.js
 *
 */

import 'vue-virtual-scroller/dist/vue-virtual-scroller.css';
import '@/styles/main.scss';

import { autoAnimatePlugin } from '@formkit/auto-animate/vue';
import MasonryWall from '@yeger/vue-masonry-wall';
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
import { useLocaleStore } from '@/stores/modules/localeStore';

const app = createApp(App);

app.config.globalProperties.$ndt = i18n.ndt;

// Locale initial.
app.use(pinia);
useLocaleStore().initialize();

app.use(router);
app.use(PerfectScrollbar);
app.use(MasonryWall);
app.use(VueVirtualScroller);
app.use(VueApexCharts);
app.use(i18n);
app.use(Vue3Lottie, { name: 'LottieAnimation' });
app.use(autoAnimatePlugin);
app.use(vuetify);
app.mount('#app');
