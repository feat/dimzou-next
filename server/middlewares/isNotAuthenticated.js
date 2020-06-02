const qs = require('qs');

module.exports = async (req, res, next) => {
  if (req.user && req.user.uid) {
    let redirect;
    if (req.appContext && req.appContext.userMeta && !req.appContext.userMeta.security_question_initialized) {
      // redirect from auth required action
      if (req.query.action) {
        redirect = `/settings?${qs.stringify({
          next: req.query.redirect,
        })}`
      } else {
        redirect = '/settings'
      }
    } else {
      redirect = req.query.redirect || `/profile/${req.user.uid}`
    }
    res.redirect(redirect)
    return 
  }
  next()
}