const crypto = require('crypto');
const buffer = crypto.randomBytes(32);
console.log(buffer.toString('hex'));