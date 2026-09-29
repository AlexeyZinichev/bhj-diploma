import { Entity } from './Entity.js';
import { createRequest } from './createRequest.js';

export class Account extends Entity {
  static URL = '/account';

  static get(id, callback) {
    createRequest({
      url: `${this.URL}/${id}`,
      method: 'GET',
      callback
    });
  }
}
