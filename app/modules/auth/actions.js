import { createRoutine } from 'redux-saga-routines';
import { createAction } from 'redux-actions';
import request from '@/utils/request';
import message from '@feat/feat-ui/lib/message';

import storage from '@/utils/storage';
import { formatMessage } from '@/services/intl';
// import {
//   authWithPhoneAndPassword as authWithPhoneAndPasswordRequest,
//   logout as logoutRequest,
//   // registerWithPhone as registerWithPhoneRequest,
// } from '@/client/auth';

import ssoAction from '@/utils/ssoAction';
import intlMessages from './messages';

const NS = 'auth';

// Authentication
export const loginWithPhone = createRoutine(`${NS}/LOGIN_WITH_PHONE`);

export const logout = createRoutine(`${NS}/LOGOUT`);

// export const setToken = createAction(`${NS}/SET_ACCESS_TOKEN`);
export const initUserService = createAction(`${NS}/INIT_USER_SERVICE`);
export const setCurrentUser = createAction(`${NS}/SET_CURRENT_USER`);

export const authRequired = createAction('auth/AUTH_REQUIRED');
export const openAuthModal = createAction('auth/OPEN_AUTH_MODAL');
export const closeAuthModal = createAction('auth/CLOSE_AUTH_MODAL');

export const authRedirect = createAction('auth/REDIRECT');

export const asyncLoginWithPhone = (payload) => async (dispatch) => {
  dispatch(loginWithPhone.request());
  try {
    const e164phone = `+${payload.callingCode}-${payload.phone}`.trim();
    const res = await request({
      url: `${window.location.origin}/auth/login`,
      method: 'POST',
      data: {
        username: e164phone,
        password: payload.password,
        fingerprint: payload.fingerprint,
      },
    });

    logging.debug(res);
    message.success({
      content: formatMessage(intlMessages.loginSuccess),
      duration: 3000,
    });
    if (res.data && res.data.sso) {
      await Promise.all(res.data.sso.map(ssoAction)).catch((err) => {
        logging.warn(err);
      });
    }
    // cache info
    storage.setItem(
      'form.phone-login', // login
      JSON.stringify({
        calling_code: payload.callingCode,
        country: payload.country.iso3,
        phone: payload.phone,
      }),
    );
  } catch (err) {
    dispatch(loginWithPhone.failure(err));
    throw err;
  }
};

export const asyncLogout = () => async (dispatch) => {
  // dispatch(logout.trigger());
  try {
    const res = await request({
      url: `${window.location.origin}/auth/logout`,
      method: 'POST',
    })
    if (res.data && res.data.sso) {
      await Promise.all(res.data.sso.map(ssoAction)).catch((err) => {
        logging.warn(err);
      });
    }
    dispatch(logout.success(res));
  } catch (err) {
    dispatch(logout.failure(err));
    throw err;
  }
};
