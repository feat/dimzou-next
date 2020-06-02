const crypto = require('crypto');
const algorithm = 'aes-256-cbc';

function encrypt(text, secret) {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(algorithm, Buffer.from(secret, 'hex'), iv);
  let encrypted = cipher.update(text);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return `${iv.toString('hex')}.${encrypted.toString('hex')}`
}

function decrypt(text, secret) {
  const [encodedIV, encryptedData] = text.split('.')
  const iv = Buffer.from(encodedIV, 'hex');
  const encryptedText = Buffer.from(encryptedData, 'hex');
  const decipher = crypto.createDecipheriv(algorithm, Buffer.from(secret, 'hex'), iv);
  let decrypted = decipher.update(encryptedText);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return decrypted.toString();
}

function randomKey() {
  return crypto.randomBytes(32).toString('hex')
}

module.exports = {
  encrypt,
  decrypt,
  randomKey,
}