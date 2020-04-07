import { AxiosResponse } from 'axios';
import Vue from 'vue';
import { Component } from 'vue-property-decorator';
import { required } from 'vuelidate/lib/validators';

import { logger } from '@/utils/logger';

interface Param {
  userId?: number;
  id?: number;
  title?: string;
  body?: string;
}

@Component({
  template: require('./apiData.html'),
  validations: {
    param: {
      userId: { required },
      title: { required },
      body: { required },
    },
  },
})
export class APIData extends Vue {
  public fetching: boolean = false;
  public headers: object[] = [
    { text: 'UserId', value: 'userId', divider: true },
    { text: 'ID', value: 'id' },
    { text: 'Title', value: 'title' },
    { text: 'Body', value: 'body' },
  ];
  public param: Param = {};
  public items: Param[] = [];

  public async created(): Promise<void> {
    logger.info('APIData created');
    this.$emit('loading');
    await this.fetchData();
  }

  public mounted(): void {
    logger.info('APIData mounted');
    this.$nextTick(() => this.$emit('ready'));
  }

  public async save(): Promise<void> {
    this.fetching = true;
    try {
      const body: AxiosResponse<Param> = await this.$http.post('https://jsonplaceholder.typicode.com/posts', { ...this.param });

      this.items.unshift({ ...this.param, ...body.data });
      this.param = {};
    } catch (err) {
      this.httpErr(err);
    } finally {
      this.fetching = false;
    }
  }

  // example
  public async update(): Promise<void> {
    try {
      const body: AxiosResponse<Param> = await this.$http.put(`https://jsonplaceholder.typicode.com/posts/${this.param.id}`, {
        ...this.param });

      this.alert(JSON.stringify(body.data));
    } catch (err) {
      this.httpErr(err);
    }
  }

  private async fetchData(): Promise<void> {
    try {
      const body: AxiosResponse<Param[]> = await this.$http.get('https://jsonplaceholder.typicode.com/posts');
      this.items = body.data.slice(0, 50);
    } catch (err) {
      this.httpErr(err);
    }
  }
}
