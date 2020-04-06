import Vue from 'vue';
import VueRouter from 'vue-router';

import * as component from '@/components';

Vue.use(VueRouter);

export const router: VueRouter = new VueRouter({
  routes: [
    { path: '/', component: component.Home },
    { path: '/webviewer/:page', component: component.Webviewer, props: true },
    { path: '/data/local-storage', component: component.LocalStorage },
    { path: '/data/api-data', component: component.APIData },
  ],
});
