// https://vuejs.org/v2/guide/typescript.html#Augmenting-Types-for-Use-with-Plugins
import { AxiosInstance, AxiosError } from 'axios';

declare module 'vue/types/vue' {
  interface Vue {
    // Plugins
    $http: AxiosInstance;
    $confirm(message: string, options?: object): Promise<boolean>;
    // Mixin
    alert(message: string): void;
    httpErr(err: AxiosError): void;
  }
}
