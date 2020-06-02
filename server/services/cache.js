const redisClient = require('./redis');
// TODO: env helper function to handle data type;
const CACHE_TTL = process.env.CACHE_TTL || 30;

function get(key, fallback) {
  return new Promise((resolve, reject) => {
    redisClient.get(key, (err, result) => {
      if (err) {
        reject(err)
      } else if (result) {
        resolve(JSON.parse(result));
      } else if (!fallback) {
        resolve(result); // NUll or false ?
      } else if (fallback instanceof Function) {
        resolve(fallback());
      } else {
        resolve(fallback);
      }
    });
  })
}

// ttl minute
function put(key, data, ttl = CACHE_TTL) {
  return new Promise((resolve, reject) => {
    const params = [
      key, JSON.stringify(data),
    ]
    if (ttl) {
      params.push('EX');
      params.push(ttl * 60); 
    }
    redisClient.set(params, (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    })
  })
}

function has(key) {
  return new Promise((resolve, reject) => {
    redisClient.exists(key, (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    })
  })
}

function remember(key, ttl, query) {
  return new Promise((resolve, reject) => {
    redisClient.get(key, (err, result) => {
      if (err) {
        reject(err)
      } else if (result) {
        resolve(JSON.parse(result));
      } else if (query) {
        query().then((data) => {
          put(key, data, ttl)
          return data
        }).then(resolve).catch(reject)
      }
    });
  })
}

function forget(key) {
  return new Promise((resolve, reject) => {
    redisClient.del(key, (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    })
  })
}


// function increment() { }
// function decrement() { }
// function pull() {}
// function add() {}
// function forever() {}
// function flush() {}

module.exports = {
  get,
  put, 
  has,
  remember,
  forget,
}
