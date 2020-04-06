import Vue from 'vue';
import { Component, Prop } from 'vue-property-decorator';
import Vuetify from 'vuetify';

import { logger } from '@/utils';

@Component({
  vuetify: new Vuetify(),
  template: require('./confirm.html'),
})
export class Confirm extends Vue {
  public value: boolean = false;

  @Prop(String) public title?: string;
  @Prop(String) public desc?: string;

  public created(): void {
    logger.info('Confirm created');
  }

  public mounted(): void {
    logger.info('Confirm mounted');
    document.body.appendChild(this.$el);
  }

  public selected(value: boolean): void {
    this.value = value;
    this.close();
  }

  public close(): void {
    this.$destroy();
  }

  public destroyed(): void {
    logger.info('Confirm destroyed');
    document.body.removeChild(this.$el);
  }
}
