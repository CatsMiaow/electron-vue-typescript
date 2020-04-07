import Vue from 'vue';
import { Component, Prop } from 'vue-property-decorator';

import { logger } from '@/utils';

@Component({
  template: require('./webviewer.html'),
})
export class Webviewer extends Vue {
  @Prop()
  private readonly page!: string;

  get pageUri(): string {
    let url = '';

    logger.info(`Webviewer: ${this.page}`);
    switch (this.page) {
      case 'google':
        url = 'https://www.google.com';
        break;
      case 'translate':
        url = 'https://translate.google.com/m/translate';
        break;
      default:
    }

    return url;
  }

  public created(): void {
    logger.info('Webviewer created');
    this.$emit('loading');
  }

  public mounted(): void {
    logger.info('Webviewer created');
    this.$nextTick(() => this.$emit('ready'));
  }
}
