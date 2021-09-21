const store = (() => {
  try {
    const { localStorage } = window;
    const x = '__test__';
    localStorage.setItem(x, x);
    localStorage.removeItem(x);
    return localStorage;
  } catch (e) {
    return null;
  }
})();

export default {
  clear() {
    // eslint-disable-next-line no-unused-expressions
    store && store.clear();
  },
  getItem(key) {
    return store ? store.getItem(key) : undefined;
  },
  removeItem(key) {
    // eslint-disable-next-line no-unused-expressions
    store && store.removeItem(key);
  },
  keys() {
    // eslint-disable-next-line no-unused-expressions
    return ((store && Object.keys(store)) || []);
  },
  setItem(key, value) {
    // eslint-disable-next-line no-unused-expressions
    store && store.setItem(key, value);
  },
};
