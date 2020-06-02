const dev = process.env.NODE_ENV !== 'production'
const next = require('next')

const app = next({ dev })

module.exports = app
