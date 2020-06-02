/* eslint-disable */

class SimpleStorage {
  store = {};
  setItem(key, value) {
    this.store[key] = value;
    return Promise.resolve(this);
  }
  getItem(key) {
    return this.store[key];
  }
  removeItem(key) {
    delete this.store[key];
  }
}

let storage;

if (global.localStorage) {
  storage = global.localStorage;
} else if (global.sessionStorage) {
  storage = global.sessionStorage;
} else {
  storage = new SimpleStorage();
}

export default storage;
