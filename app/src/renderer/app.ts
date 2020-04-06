import { ipcRenderer } from 'electron';
import { AxiosError } from 'axios';
import Vue from 'vue';
import Vuelidate from 'vuelidate';

import { Appbar } from '@/components';
import { VueConfirm, VueRequest, vuetify } from '@/plugins';
import { router } from '@/router';
import { logger } from '@/utils';

Vue.use(Vuelidate);
Vue.use(VueRequest, { baseURL: '/' });
Vue.use(VueConfirm);

// https://vuejs.org/v2/guide/mixins.html
Vue.mixin({
  created(this: Vue): void {
    this.$on('ipc:on', (channel: string, callback: () => void) => {
      ipcRenderer.on(channel, callback);
    });

    this.$on('ipc:send', (channel: string, ...args: (string | object)[]) => {
      ipcRenderer.send(channel, ...args);
    });
  },
  methods: {
    alert(message: string): void {
      this.$root.alert(message);
    },
    // Http Error
    httpErr(err: AxiosError): void {
      logger.error(err, err.response);
      this.$root.alert((err.response?.status === 400) ? `${err.response.data.error}: ${err.response.data.message}` : err.message);
    },
  },
});

// eslint-disable-next-line no-new
new Vue({
  el: '#yourappid',
  // https://github.com/vuetifyjs/vuetify/issues/6895#issuecomment-510640903
  vuetify,
  router,
  data: { loading: true, showAlert: false, message: '' },
  components: {
    appbar: Appbar,
  },
  created(this: Vue): void {
    // Move page
    this.$emit('ipc:on', 'router:replace', async (event: Event, path: string) => {
      await router.replace(path);
    });
  },
  mounted(): void {
    logger.info('Mounted');
  },
  methods: {
    alert(message: string): void {
      this.message = message;
      this.showAlert = true;
    },
  },
});
