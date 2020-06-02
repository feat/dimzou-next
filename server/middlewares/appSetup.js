module.exports = async (req, res, next) => {
  req.getApiHeaders = () => {
    if (!req._apiHeaders) {
      const headers = {};
      if (req.locale) {
        headers['X-Language-Locale'] = req.locale;
      }
      if (req.cookies.x_fake_ip) {
        headers['X-FakeIP'] = req.cookies.x_fake_ip;
      }
      if (req.session.apiToken) {
        headers.Authorization = `Bearer ${req.session.apiToken.access_token}`
      } 
      req._apiHeaders = headers;
    }
    return req._apiHeaders;
  }
  next();
}