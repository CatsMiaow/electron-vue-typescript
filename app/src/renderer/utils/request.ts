/**
 * utils/request.ts
 */
import Vue from 'vue';

import * as request from 'request-promise-native';

export class Plugin implements Vue.PluginObject<{}> {
  private installed: boolean = false;

  public install(vue: typeof Vue, options: request.RequestPromiseOptions): void {
    if (this.installed) {
      return;
    }

    this.installed = true;

    // tslint:disable:no-reserved-keywords
    Object.defineProperties(vue.prototype, {
      $http: {
        get(): request.requestAPI {
          return request.defaults(options);
        }
      }
    });
    // tslint:enable:no-reserved-keywords
  }
}

export const plugin: Plugin = new Plugin();
