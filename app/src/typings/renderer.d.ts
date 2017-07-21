// https://www.typescriptlang.org/docs/handbook/declaration-files/templates/global-modifying-module-d-ts.html
import * as request from 'request';
import * as requestPromise from 'request-promise-native';
import * as http from 'http';

declare global {
  //
}

declare module 'request-promise-native' {
  type requestAPI = request.RequestAPI<requestPromise.RequestPromise, requestPromise.RequestPromiseOptions, request.RequiredUriUrl>;
}

declare module 'request-promise-native/errors' {
  interface ErrorResponse extends StatusCodeError {
    response: http.IncomingMessage & { body: any };
  }
}

declare module 'vue/types/vue' {
  interface Vue {
    $http: requestPromise.requestAPI;
  }
}

export {};
