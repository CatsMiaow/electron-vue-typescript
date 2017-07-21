/**
 * components/webviewer/Webviewer.ts
 */
import Vue from 'vue';
import { Component, Prop } from 'vue-property-decorator';

import { logger } from '@/utils/logger';

@Component({
  template: require('./webviewer.html')
})
export class Webviewer extends Vue {
  @Prop()
  private page: string;

  get pageUrl(): string {
    let url: string = '';

    switch (this.page) {
      case 'google':
        url = 'https://www.google.co.kr/';
        break;
      case 'naver':
        url = 'https://www.naver.com/';
        break;
      case 'daum':
        url = 'http://www.daum.net/';
        break;
      default:
        break;
    }

    return url;
  }

  public created(): void {
    this.$emit('loading');
  }

  public mounted(): void {
    (<Electron.WebviewTag>document.querySelector('#webview')).style.height = `${window.innerHeight}px`;
    this.$nextTick(() => this.$emit('ready'));
  }

  public finish(): void {
    logger.info('Webview Finish');
  }
}
