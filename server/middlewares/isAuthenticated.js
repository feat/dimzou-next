const { stringify } = require('querystring')

module.exports = async (req, res, next) => {
  if (!req.user || !req.user.uid) {
    res.redirect(`/auth/login?${stringify({
      redirect: req.originalUrl,
    })}`)
    return 
  }
  next()
}