// https://www.typescriptlang.org/docs/handbook/declaration-files/templates/global-modifying-module-d-ts.html
import * as PouchDB from 'pouchdb';
import * as requestPromise from 'request-promise-native';
import * as http from 'http';

declare global {
  namespace NodeJS {
    interface Global {
      db: { [key: string]: PouchDB.Database<{}> };
      dataPath: string;
    }
  }
}

declare module 'request-promise-native/errors' {
  interface ErrorResponse extends StatusCodeError {
    response: http.IncomingMessage & { body: any };
  }
}

export {};
