import storage from '../localStorage';


const load = (key) => {
  const item = storage.getItem(key);
  if (item) {
    return JSON.parse(item);
  }
  return {};
};
const del = (key) => {
  storage.removeItem(key);
};

const store = (key, data) => {
  storage.setItem(key, JSON.stringify(data));
};

const searchUUIDStorage = {
  get(url) {
    const key = `rbs_${url}`;
    const data = load(key);
    const { searchUUID } = data;
    return searchUUID;
  },
  set(url, searchUUID) {
    store(`rbs_${url}`, { searchUUID, createdAt: new Date() });
  },
};

storage.keys().forEach((key) => {
  if (key.match('rbs_')) {
    const data = load(key);
    if (data.createdAt) {
      const createdAt = new Date(Date.parse(data.createdAt));
      // advance 30 minutes in the future
      createdAt.setMinutes(createdAt.getMinutes() + 30);
      // if still too old
      if (createdAt < new Date()) {
        del(key);
      }
    }
  }
});

export default searchUUIDStorage;
