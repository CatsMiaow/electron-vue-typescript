import Vue from 'vue';

import Axios, { AxiosInstance, AxiosRequestConfig } from 'axios';

class Plugin implements Vue.PluginObject<{}> {
  private installed: boolean = false;

  public install(vue: typeof Vue, options?: AxiosRequestConfig): void {
    if (this.installed) {
      return;
    }

    this.installed = true;

    Object.defineProperties(vue.prototype, {
      $http: {
        get(): AxiosInstance {
          return Axios.create(options);
        },
      },
    });
  }
}

export const VueRequest: Plugin = new Plugin();
