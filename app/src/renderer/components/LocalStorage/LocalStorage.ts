import * as crypto from 'crypto';
import { remote } from 'electron';
import Vue from 'vue';
import { Component } from 'vue-property-decorator';
import { alpha, between, minLength, required, sameAs } from 'vuelidate/lib/validators';

import { Database } from '@/../types';
import { logger } from '@/utils/logger';

interface Param {
  id?: string;
  password?: string;
  repeatPassword?: string;
  nick?: string;
  age?: number;
  memo?: string;
}

@Component({
  template: require('./localStorage.html'),
  validations: {
    param: {
      id: { required, alpha },
      password: { required, minLength: minLength(6) },
      repeatPassword: { required, sameAsPassword: sameAs('password') },
      nick: { required },
      age: { required, between: between(1, 100) },
    },
  },
})
export class LocalStorage extends Vue {
  public headers: object[] = [
    { text: 'ID', value: 'id', divider: true },
    { text: 'Nick', value: 'nick' },
    { text: 'Age', value: 'age' },
    { text: 'Memo', value: 'memo' },
  ];
  public param: Param = {};
  public items: Param[] = [];
  private db: Database = remote.getGlobal('db');

  public async created(): Promise<void> {
    logger.info('LocalStorage created');
    this.$emit('loading');
    await this.fetchData();
  }

  public mounted(): void {
    logger.info('LocalStorage created');
    this.$nextTick(() => this.$emit('ready'));
  }

  public async save(): Promise<void> {
    if (!this.param.password) {
      return;
    }

    this.param.password = crypto.createHmac('sha256', 'passwordKey').update(this.param.password).digest('hex');
    delete this.param.repeatPassword;

    this.items.unshift({ ...this.param });
    this.param = {};

    await this.db.put('items', this.items);
  }

  // example
  public async update(): Promise<void> {
    await this.db.put('items', this.items);
  }

  private async fetchData(): Promise<void> {
    this.items = await this.db.get('items') || [];
  }
}
