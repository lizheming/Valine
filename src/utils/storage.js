let store = {};
const memoryStorage = {
  getItem: function (name) {
    return store[name];
  },
  setItem: function (name, value) {
    store[name] = value;
  },
  removeItem: function (name) {
    delete store[name];
  },
  clear: function () {
    store = {};
  }
}
let supportLocal = false;
let supportSession = false;
['localStorage', 'sessionStorage'].some((store, index) => {
  let key = 'test';
  try {
    window[store].setItem(key, 1);
    if (window[store].getItem(key) | 0 === 1) {
      if (index === 0) {
        supportLocal = true;
      } else {
        supportSession = true;
      }
    }
  } catch (err) { }
})
function getStore(type = 'local') {
  if (type === 'local' && supportLocal) {
    return window.localStorage;
  }
  if (supportSession) {
    return window.sessionStorage;
  }
  return memoryStorage;
}
module.exports = {
  getItem: function (key, type) {
    let store = getStore(type);
    //支持数组方式 getItem([key, itemKey]);
    if (Array.isArray(key)) {
      let value = store.getItem(key[0]);
      try {
        value = JSON.parse(value) || {};
        value = value[key[1]];
        if (!value.expire) {
          return value;
        }
        if (value.expire > Date.now()) {
          return value.value;
        } else {
          // delete value[key[1]];
          // store.setItem(key[0], JSON.stringify(value));
        }
      } catch (e) {
        return value;
      }
    } else {
      let value = store.getItem(key);
      try {
        value = JSON.parse(value);
        if (!value.expire) {
          return value;
        }
        if (value.expire > Date.now()) {
          return value.value;
        } else {
          store.removeItem(key);
        }
      } catch (e) {
      }
    }
  },
	/**
	 * 设置 storage，支持过期时间，支持将多个值设置在一个 key 里面，并且有过期时间
	 * @param {String|Array} key       []
	 * @param {} value     []
	 * @param {[type]} type      []
	 * @param {[type]} expire    []
	 * @param {Number} maxLength []
	 */
  setItem: function (key, value, type, expire, maxLength = 10) {
    if (typeof type === 'number') {
      maxLength = expire;
      expire = type;
      type = 'local';
    }
    let store = getStore(type);
    //数组，将多个值放在一个 key 里
    if (Array.isArray(key)) {
      let oldValue = this.getItem(key[0]) || {};
      let itemKey = key[1];
      key = key[0];
      if (typeof (oldValue) !== 'object') {
        return false;
      }
      if (expire) {
        expire += Date.now();
        oldValue[itemKey] = { expire, value };
      } else {
        oldValue[itemKey] = value;
      }
      //删除更多的值
      if (Object.keys(oldValue).length > maxLength) {
        for (let i in oldValue) {
          delete oldValue[i];
          break;
        }
      }
      if (typeof (oldValue) !== 'string') {
        oldValue = JSON.stringify(oldValue);
      }
      store.setItem(key, oldValue);
    } else {
      if (expire) {
        expire += Date.now();
        store.setItem(key, JSON.stringify({ expire, value }));
      } else {
        if (typeof (value) !== 'string') {
          value = JSON.stringify(value);
        }
        store.setItem(key, JSON.stringify(value));
      }
    }
  },
  removeItem: function (key, type) {
    let store = getStore(type);
    store.removeItem(key);
  },
  clear: function (type) {
    let store = getStore(type);
    store.clear();
  }
};