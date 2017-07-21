/**
 * main.ts
 */
import { ipcRenderer } from 'electron';
import Vue from 'vue';
import VueMaterial from 'vue-material';
import Vuelidate from 'vuelidate';

import { router } from '@/router';
import { logger } from '@/utils/logger';
import { plugin as VueRequest } from '@/utils/request';

Vue.use(VueMaterial);
Vue.use(VueRequest, { strictSSL: false, json: true });
Vue.use(Vuelidate);

// https://github.com/vuematerial/vue-material/blob/master/docs/src/config.js
Vue.material.registerTheme({
  default: { primary: 'blue', accent: 'pink' },
  blue: { primary: 'blue', accent: 'pink' },
  indigo: { primary: 'indigo', accent: 'pink' },
  brown: { primary: 'brown', accent: 'green' },
  purple: { primary: 'purple', accent: 'blue' },
  orange: { primary: 'orange', accent: 'purple' },
  green: { primary: 'green', accent: 'pink' },
  'light-blue': { primary: 'light-blue', accent: 'yellow' },
  teal: { primary: 'teal', accent: 'orange' },
  'blue-grey': { primary: 'blue-grey', accent: 'blue' },
  cyan: { primary: 'cyan', accent: 'pink' },
  red: { primary: 'red', accent: 'pink' },
  white: { primary: 'white', accent: 'blue' },
  grey: { primary: { color: 'grey', hue: 300 }, accent: 'indigo' }
});

// tslint:disable:no-invalid-this
Vue.mixin({
  created(): void {
    this.$on('ipc:on', (channel: string, callback: Function) => {
      ipcRenderer.on(channel, callback);
    });

    this.$on('ipc:send', (channel: string, ...args: (string | object)[]) => {
      ipcRenderer.send(channel, ...args);
    });
  }
});

// tslint:disable-next-line:no-unused-expression
new Vue({
  el: '#Tested',
  router,
  data: { loading: true },
  created(): void {
    // 페이지 이동
    this.$emit('ipc:on', 'router:replace', (event: Function, path: string) => {
      router.replace(path);
    });
    // PingPong
    this.$emit('ipc:on', 'pong', (event: Function, data: string) => {
      alert('Pong!');
    });
  },
  mounted(): void {
    logger.info('Vue Mounted');
    this.$emit('ipc:send', 'ping');
  },
  methods: {}
});
// tslint:enable:no-invalid-this
