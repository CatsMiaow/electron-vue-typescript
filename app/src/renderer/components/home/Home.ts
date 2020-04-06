import Vue from 'vue';
import { Component } from 'vue-property-decorator';

@Component({
  template: require('./home.html'),
})
export class Home extends Vue {
  public created(): void {
    this.$emit('loading');
  }

  public mounted(): void {
    this.$nextTick(() => this.$emit('ready'));
  }
}
