/**
 * components/localData/LocalData.ts
 */
import * as crypto from 'crypto';
import { remote } from 'electron';
import Vue from 'vue';
import { Component } from 'vue-property-decorator';
import { alpha, between, minLength, required, sameAs } from 'vuelidate/lib/validators';

import { logger } from '@/utils/logger';

export interface ILocalForm {
  _id?: PouchDB.Core.DocumentId;
  _rev?: PouchDB.Core.RevisionId;
  id: string;
  password: string;
  repeatPassword: string;
  nick: string;
  age: number;
  memo?: string;
}

//<default>
const iForm: ILocalForm = { _id: '', _rev: '', id: '', password: '', repeatPassword: '', nick: '', age: 0, memo: '' };
//</default>

@Component({
  template: require('./localData.html'),
  validations: {
    form: {
      id: { required, alpha },
      password: { required, minLength: minLength(6) },
      repeatPassword: { required, sameAsPassword: sameAs('password') },
      nick: { required },
      age: { required, between: between(1, 100) }
    }
  }
})
export class LocalData extends Vue {
  public form: ILocalForm = Object.assign({}, iForm);
  public list: ILocalForm[] = [];
  public activeTab: number = 0;
  private db: PouchDB.Database<ILocalForm> = remote.getGlobal('db').localData;

  public created(): void {
    this.$emit('loading');

    this.db.find({
      selector: { _id: { $gt: 0 } },
      sort: [{ _id: 'desc' }]
    }).then((result: PouchDB.Find.FindResponse<ILocalForm>) => {
      // https://kr.vuejs.org/v2/guide/reactivity.html
      this.list = Object.assign([], this.list, result.docs);

      this.$nextTick(() => this.$emit('ready'));
    }).catch((err: Error) => {
      logger.error('Database', err);
    });
  }

  public mounted(): void {
    // this.$nextTick(() => this.$emit('ready'));
  }

  public save(): void {
    this.db.find({ // 마지막 _id 값 가져오기
      selector: { _id: { $gt: 0 } },
      fields: ['_id'],
      sort: [{ _id: 'desc' }],
      limit: 1
    }).then((result: PouchDB.Find.FindResponse<ILocalForm>) => {
      const [max] = result.docs;

      // 마지막 _id로 auto_increment 구현
      this.form._id = `${max ? +max._id + 1 : 1}`;
      // 비밀번호 대충 암호화
      this.form.password = crypto.createHmac('sha256', 'passwordKey').update(this.form.password).digest('hex');
      // DB에 넣지 않을 파라미터 삭제
      delete this.form.repeatPassword;

      return this.db.put(this.form);
    }).then((row: PouchDB.Core.Response) => {
      this.form._id = row.id; //= _id
      this.form._rev = row.rev; // 수정할 때 필요
      this.list.unshift(Object.assign({}, this.form)); // 목록에 추가

      Object.assign(this.form, iForm); // model 초기화
      this.$v.form.$reset(); // validations 초기화
      this.activeTab = 1; // 목록으로
    }).catch((err: Error) => {
      logger.error('Database', err);
    });
  }

  // 수정 예시
  public update(): void {
    this.db.put(this.form).then((row: PouchDB.Core.Response) => {
      this.form._rev = row.rev; // 필수
    }).catch((err: Error) => {
      logger.error('Database', err);
    });
  }

  public changeTab(index: number): void {
    if (this.activeTab !== index) {
      this.activeTab = index;
    }
  }
}
