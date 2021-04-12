const express = require('express');
const qs = require('qs');
const router = express.Router();
const axios = require('axios');
const debug = require('../services/debug');

const isNotAuthenticated = require('../middlewares/isNotAuthenticated');

router.use('/login', isNotAuthenticated);

/* GET home page. */
router.get('/login', (req, res) => {
  if (req.query.redirect) {
    req.session.redirect = req.query.redirect;
  }
  const url = `${process.env.FEAT_AUTHORIZATION_URL}?${new URLSearchParams({
    response_type: 'code',
    scope: process.env.FEAT_SCOPE,
    client_id: process.env.FEAT_CLIENT_ID,
    redirect_uri: `${process.env.APP_URL}/auth/callback`,
  })}`;
  return res.redirect(url);
});

router.post('/logout', (req, res) => {
  const resData = {};
  req.session.destroy((err) => {
    if (err) {
      debug.auth(err);
      res.json({
        success: false,
      });
    } else {
      res.json({
        success: true,
        message: 'Logout successfully',
        data: resData,
      });
    }
  });
});

router.get('/callback', async (req, res) => {
  const data = {
    client_id: process.env.FEAT_CLIENT_ID,
    client_secret: process.env.FEAT_CLIENT_SECRET,
    grant_type: 'authorization_code',
    code: req.query.code,
    redirect_uri: `${process.env.APP_URL}/auth/callback`,
  };
  const form = qs.stringify(data);
  const keys = ['x-language-locale', 'x-forwarded-for', 'x-real-ip'];
  const headers = {
    'Content-Type': 'application/x-www-form-urlencoded',
  };
  keys.forEach((key) => {
    if (req.headers[key]) {
      headers[key] = req.headers[key];
    }
  });
  try {
    const apiRes = await axios.post(process.env.FEAT_ACCESS_TOKEN_URL, form, {
      headers,
    });

    const apiResBody = apiRes.data;
    req.session.apiToken = apiResBody;
    // debug.auth(apiResBody);

    return res.redirect(req.session.redirect || '/');
  } catch (err) {
    return res.render('error', {
      error: err,
    });
  }
});

module.exports = router;
