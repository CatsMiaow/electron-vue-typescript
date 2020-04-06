import Vue from 'vue';

import { Confirm } from '@/components';

class Plugin implements Vue.PluginObject<{}> {
  private installed: boolean = false;

  public install(vue: typeof Vue): void {
    if (this.installed) {
      return;
    }

    this.installed = true;

    Object.defineProperties(vue.prototype, {
      $confirm: {
        value(message: string, options: { [key: string]: string } = {}): Promise<boolean> {
          // eslint-disable-next-line @typescript-eslint/typedef
          return new Promise((resolve, reject) => {
            try {
              const confirm = new Confirm({
                propsData: { title: message, desc: options.desc },
                destroyed(): void {
                  resolve(confirm.value);
                },
              }).$mount();
            } catch (err) {
              reject(err);
            }
          });
        },
      },
    });
  }
}

export const VueConfirm: Plugin = new Plugin();
