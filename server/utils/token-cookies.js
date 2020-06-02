const jwtDecode = require('jwt-decode')

module.exports = function setTokenRelatedCookie(res, token) {
  const payload = jwtDecode(token);
  const isAdAdmin =
      payload.permissions.indexOf('advertising.manage-ads') !== -1;
  res.cookie('is_ad_admin', isAdAdmin);
}