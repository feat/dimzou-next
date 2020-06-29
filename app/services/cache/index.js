import storage from "../../utils/storage";

const defaultOptions = {
  cacheKey: 'cache',
  userId: undefined,
  timeout: 500,
}


const isEmpty = (object) => !Object.values(object).some((item) => !!item)

class Cache {
  constructor(options) {
    this.options = {
      ...defaultOptions,
      ...options,
    }
    const {
      cacheKey,
      userId,
    } = this.options;
    let sessionCache;
    let cache;
    if (typeof sessionStorage === 'object') {
      sessionCache = JSON.parse(sessionStorage.getItem(cacheKey) || 'null');
      if (sessionCache) {
        sessionStorage.removeItem(cacheKey);
      }
    }
    
    if (userId) {
      cache = JSON.parse(storage.getItem(`${userId}:${cacheKey}`) || 'null');
    }
    if (cache && sessionCache) {
      this.data = {
        ...cache,
        ...sessionCache,
      }
    } else {
      this.data = cache || sessionCache || {};
    }
    this.userId = userId;
    this.cacheKey = cacheKey;
  }

  triggerCache() {
    if (this.cacheTimer) {
      clearTimeout(this.cacheTimer);
    }
    this.cacheTimer = setTimeout(this.cache, this.options.timeout)
  }

  getUserCacheKey() {
    return `${this.options.userId}:${this.options.cacheKey}`
  }

  hasData = () => !isEmpty(this.data)

  cache = () => {
    try {
      if (isEmpty(this.data)) {
        if (!this.options.userId) {
          sessionStorage.removeItem(this.options.cacheKey);
        } else {
          storage.removeItem(this.getUserCacheKey());
        }
      } else if (!this.options.userId) {
        sessionStorage.setItem(this.options.cacheKey, JSON.stringify(this.data))
      } else {
        storage.setItem(this.getUserCacheKey(), JSON.stringify(this.data))
      }
    } catch (err) {
      logging.warn(err)
    }
  }

  put(data) {
    if (this.data !== data) {
      this.data = data;
      this.triggerCache();
    }
  }

  set(key, value) {
    if (this.data[key] !== value) {
      this.data[key] = value;
      this.triggerCache();
    }
  }

  get(key) {
    return this.data[key];
  }

  remove(key) {
    delete this.data[key];
    this.triggerCache();
  }

  flush() {
    if (this.cacheTimer) {
      clearTimeout(this.cacheTimer);
    }
    if (!this.options.userId) {
      sessionStorage.removeItem(this.options.cacheKey);
    } else {
      storage.removeItem(this.getUserCacheKey())
    }
  }

  all() {
    return this.data;
  }
}

export default Cache;

const cacheMap = {};

export const initCache = (options, reinit = false) => {
  const key = options.cacheKey;
  if (!cacheMap[key] || reinit) {
    cacheMap[key] = new Cache(options)
  } 
  return cacheMap[key];
}

export const getCache = (key) => cacheMap[key]