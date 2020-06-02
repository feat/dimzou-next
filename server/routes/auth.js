const express = require('express');
const qs = require('qs');
const router = express.Router();
const app = require('../next');
const api = require('../services/api');
const debug = require('../services/debug');
const cache = require('../services/cache');
const cipher = require('../services/cipher');
const setTokenCookies = require('../utils/token-cookies');

const isNotAuthenticated = require('../middlewares/isNotAuthenticated');

const getTokenCode = (access_token) => {
  const code = cipher.randomKey();
  cache.put(code, { access_token });
  return code;
}

router.use('/login', isNotAuthenticated);
router.use('/register', isNotAuthenticated);

/* GET home page. */
router.get('/login', (req, res) =>
  app.render(req, res, '/auth/login', req.query),
);

router.post('/login', async (req, res) => {
  try {
    const data = {
      client_id: process.env.FEAT_CLIENT_ID,
      client_secret: process.env.FEAT_CLIENT_SECRET,
      grant_type: 'password',
      username: req.body.username,
      password: req.body.password,
      device_id: `web:${req.body.fingerprint}`,
    };
    const form = qs.stringify(data);
    const keys = ['x-language-locale', 'x-forwarded-for', 'x-real-ip'];
    const headers = {
      'Content-Type': 'application/x-www-form-urlencoded',
    };
    keys.forEach((key) => {
      if (req.headers[key]) {
        headers[key] = req.headers[key]
      }
    })
    const apiRes = await api.post('/api/o/token/', form, {
      headers,
    });

    const apiResBody = apiRes.data;
    req.session.apiToken = apiResBody;
    debug.auth(apiResBody);

    setTokenCookies(res, apiResBody.access_token);
    const resData = {};
    return res.json({
      message: 'Login successfully',
      data: resData,
    });
  } catch (err) {
    if (err.response) {
      return res.status(err.response.status).send({
        code: err.response.data.error,
        message: err.response.data.error_description,
      });
    }
    debug.auth(err);
    return res.status(500).send({
      code: 'INTERNAL_ERROR',
      error: true,
    });
  }
});

router.get('/register', (req, res) =>
  app.render(req, res, '/auth/register', req.query),
);

router.get('/account-recovery', (req, res) =>
  app.render(req, res, '/auth/account-recovery', req.query),
);

router.post('/logout', (req, res) => {
  const resData = {};
  req.session.destroy((err) => {
    if (err) {
      debug.auth(err);
      res.json({
        success: false,
      })
    } else {
      res.json({
        success: true,
        message: 'Logout successfully',
        data: resData,
      });
    }
  });
});

const isValidClient = async (clientId) => process.env.OPENWRITER_CLIENT_ID === clientId;

router.get('/authorize', async (req, res) => {
  const clientId = req.query.client_id;
  const redirectUrl = req.query.redirect_url;
  const isValid = await isValidClient(clientId);
  if (!isValid) {
    return res.json({ 
      code: 'INVALID_CLIENT_ID',
      message: 'Please check your client_id',
    })
  }
  if (!req.user) {
    return res.redirect(`/auth/login?${qs.stringify({ redirect: redirectUrl })}`);
  }
  // encode and redirect
  const code = getTokenCode(req.session.apiToken.access_token);
  const url = `${process.env.OPENWRITER_SSO_ENDPOINT}?${qs.stringify({ 
    code, 
    action: 'login',
    redirect_url: redirectUrl,
  })}`;
  return res.redirect(url);
});

router.post('/access_token', async (req, res) => {
  const { code, client_token } = req.body;
  if (client_token !== process.env.OPENWRITER_CLIENT_TOKEN) {
    return res.json({
      code: 'INVALID_CLIENT_TOKEN',
    }).status(403);
  }
  const cacheData = await cache.get(code);
  if (cacheData) {
    cache.forget(code);
    return res.json({
      data: cacheData,
    })
  }
  return res.json({
    code: 'NO_RELATED_TOKEN_FOUND',
  }).status(404);
})

// router.get('*', (req, res) => {
//   const path = `${req.baseUrl}/login`;
//   // TODO: query string join
//   res.redirect(path);
// });

module.exports = router;
