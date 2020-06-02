const api = require('./api')
const ApiError = require('../errors/ApiError')
function request (config) {
  return api
    .request(config)
    .then((res) => res.data)
    .catch((error) => {
      if (error.response && error.response.data instanceof Object) {
        throw new ApiError(error.response.data)
      }
      throw error
    })
}

module.exports = request
