import Vue from 'vue';
import * as validators from './lib/validators';

export function Vuelidate(vue: typeof Vue): void;
export default Vuelidate;

declare module 'vue/types/vue' {
  interface ValidationMethods {
    $touch(): void;
    $reset(): void;
    $flattenParams(): any[];
  }
  interface ValidationMethodsNested  {
    [key: string]: ValidationMethods & ValidationMethodsNested;
  }
  interface Vue {
    $v: ValidationMethods & ValidationMethodsNested;
  }
}

declare module 'vue/types/options' {
  interface ComponentOptions<V extends Vue> {
    validations?: { [key: string]: validators.Validators };
  }
}
