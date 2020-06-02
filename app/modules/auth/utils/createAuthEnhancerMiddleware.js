import Router from 'next/router'
import { authRequired, authRedirect } from '../actions';
import { hasAuthedUser, selectNextAction } from '../selectors';

const AUTH_REDIRECT_CACHE_KEY = 'auth_trigger_location';

export default function createAuthEnhancerMiddleware(getActions) {
  let authRedirected = false;
  return ({ getState, dispatch }) => (next) => (action) => {
    const state = getState();
    const actions = getActions();
    if (actions[action.type] && !hasAuthedUser(state)) {
      // eslint-disable-next-line no-param-reassign
      action.meta = action.meta || {};
      const path = window.location.href.replace(window.location.origin, '');
      // eslint-disable-next-line no-param-reassign
      action.meta.pageState = {
        historyLength: window.history.length,
        path,
        pageYOffset: window.pageYOffset,
        pageXOffset: window.pageXOffset,
      };
      // cache action info
      dispatch(authRequired(action));
      // cache redirect path
      sessionStorage.setItem(AUTH_REDIRECT_CACHE_KEY, path);
      Router.push('/auth/login');
      return undefined;
      // return next(push('/auth/login'));
    }
    if (!authRedirected && action.type === authRedirect.toString()) {
      // only handle one redirect
      authRedirected = true;
      const nextAction = selectNextAction(state);
      const sessionRedirect = sessionStorage.getItem(AUTH_REDIRECT_CACHE_KEY);
      if (nextAction) {
        logging.debug('action redirect');
        const { pageState } = nextAction.meta;
        const index = pageState.historyLength - window.history.length;
        window.history.go(index);
        return undefined;
        // return next(go(index));
      }
      if (sessionRedirect) {
        logging.debug('session redirect');
        sessionStorage.removeItem(AUTH_REDIRECT_CACHE_KEY);
        Router.replace(sessionRedirect); // TODO: cache next router info
        return undefined;
        // return next(replace(sessionRedirect));
      }
      Router.replace(action.payload); 
      return undefined;
      // return next(replace(action.payload));
    }
    return next(action);
  };
}
