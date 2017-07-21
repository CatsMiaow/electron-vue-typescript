/**
 * components/apiData/ApiData.ts
 */
import * as rerrors from 'request-promise-native/errors';
import Vue from 'vue';
import { Component } from 'vue-property-decorator';

import { logger } from '@/utils/logger';

export interface IApiForm {
  userId: number;
  id?: number;
  title: string;
  body: string;
}

//<default>
const iForm: IApiForm = { userId: 1, id: 0, title: '테스트', body: '내용'};
//</default>

@Component({
  template: require('./apiData.html')
})
export class ApiData extends Vue {
  public form: IApiForm = Object.assign({}, iForm);
  public list: IApiForm[] = [];
  public activeTab: number = 0;

  public created(): void {
    this.$emit('loading');

    this.$http.get('https://jsonplaceholder.typicode.com/posts').then((result: IApiForm[]) => {
      this.list = Object.assign([], this.list, result);

      this.$nextTick(() => this.$emit('ready'));
    }).catch((err: rerrors.ErrorResponse) => {
      if (err.response && err.response.statusCode === 400) {
        alert(err.response.body);
      } else {
        logger.error('Request', err, err.response.body);
      }
    });
  }

  public mounted(): void {
    // this.$nextTick(() => this.$emit('ready'));
  }

  public save(): void {
    this.$http.post('https://jsonplaceholder.typicode.com/posts', {
      formData: this.form
    }).then((row: IApiForm) => {
      this.form.id = row.id;
      this.list.unshift(Object.assign({}, this.form)); // 목록에 추가

      Object.assign(this.form, iForm); // model 초기화
      this.activeTab = 1; // 목록으로
    }).catch((err: Error) => {
      logger.error('Request', err);
    });
  }

  // 수정 예시
  public update(): void {
    this.$http.put(`https://jsonplaceholder.typicode.com/posts/${this.form.id}`, {
      formData: this.form
    }).then((row: IApiForm) => {
      //
    }).catch((err: Error) => {
      logger.error('Request', err);
    });
  }

  public changeTab(index: number): void {
    if (this.activeTab !== index) {
      this.activeTab = index;
    }
  }
}
