/**
 * router.ts
 */
import Vue from 'vue';
import Router from 'vue-router';

import * as component from '@/components';

Vue.use(Router);

export const router: Router = new Router({
  routes: [
    { path: '/', component: component.Home },
    { path: '/webviewer/:page', component: component.Webviewer, props: true },
    { path: '/local-data', component: component.LocalData },
    { path: '/api-data', component: component.ApiData }
  ]
});
