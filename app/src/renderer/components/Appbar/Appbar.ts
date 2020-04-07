import Vue from 'vue';
import { Component } from 'vue-property-decorator';

import { logger } from '@/utils';

@Component({
  template: require('./appbar.html'),
})
export class Appbar extends Vue {
  public items: object[] = [{
    text: 'Home',
    to: '/',
  }, {
    text: 'LocalStorage',
    to: '/data/local-storage',
  }, {
    text: 'APIData',
    to: '/data/api-data',
  }, {
    text: 'Google',
    to: '/webviewer/google',
  }, {
    text: 'Google Translate',
    to: '/webviewer/translate',
  }];

  public created(): void {
    logger.info('Appbar created');
  }

  public mounted(): void {
    logger.info('Appbar mounted');
  }
}
