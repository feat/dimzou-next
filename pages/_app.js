import React from 'react';
import { Provider } from 'react-redux';
import App from 'next/app';
import getConfig from 'next/config';
import withRedux from 'next-redux-wrapper';

import '@/styles/main.scss';
// import HTML5Backend from 'react-dnd-html5-backend'
// import { DndProvider } from 'react-dnd'
import { normalize } from 'normalizr';
import { addLocaleData } from 'react-intl';
import NProgress from 'nprogress';
import Router from 'next/router';

import get from 'lodash/get';

import { user as userSchema, category as categorySchema } from '@/schema';

import { configureStore } from '@/store';
import LanguageProvider from '@/modules/language/containers/LanguageProvider';
import { withDragDropContext } from '@/services/dnd';
import DeviceInfoProvider from '@/modules/device-info';

import InitProvider from '@/containers/InitProvider';

import { fetchUserCategories } from '@/modules/category/actions';

import { setCurrentUser } from '@/modules/auth/actions';
import { hasAuthedUser } from '@/modules/auth/selectors';
import { setLocale, fetchTranslations } from '@/modules/language/actions';
import SubscriptionProvider from '@/modules/subscription/SubscriptionProvider';

import { setLanguageLocale } from '@/utils/request';

import '@/services/logging';

NProgress.configure({ showSpinner: false });

Router.events.on('routeChangeStart', (url) => {
  logging.info(`Loading: ${url}`);
  NProgress.start();
});
Router.events.on('routeChangeComplete', () => NProgress.done());
Router.events.on('routeChangeError', () => NProgress.done());

const makeStore = (initialState, { req }) => {
  const store = configureStore(initialState);
  // server initialize
  if (req) {
    if (req.user) {
      const normalized = normalize(req.user, userSchema);
      store.dispatch(
        setCurrentUser({
          user: normalized.result,
          entities: normalized.entities,
          meta: req.appContext.userMeta,
        }),
      );
    }
    if (req.appContext) {
      if (req.appContext.categories) {
        const normalized = normalize(req.appContext.categories, [
          categorySchema,
        ]);
        store.dispatch(
          fetchUserCategories.success({
            list: normalized.result,
            entities: normalized.entities,
          }),
        );
      }
      const transData = {};
      transData.translations = req.appContext.publicTranslations;
      if (req.appContext.userTranslations) {
        transData.userTranslations = req.appContext.userTranslations;
      }
      transData.locale = req.locale;
      transData.date = Date.now();
      store.dispatch(fetchTranslations.success(transData));
    }
    // TODO: locale label
    store.dispatch(
      setLocale({
        locale: req.locale,
        localeLabel: req.localeLabel,
        localeRegion: req.localeRegion,
      }),
    );
  }

  // initialize language locale
  const locale = get(store.getState(), 'language.locale');
  if (locale) {
    setLanguageLocale(locale);
  }

  return store;
};

// Add Locale Data
if (typeof window !== 'undefined' && window.ReactIntlLocaleData) {
  Object.keys(window.ReactIntlLocaleData).forEach((lang) => {
    addLocaleData(window.ReactIntlLocaleData[lang]);
  });
}

const { publicRuntimeConfig } = getConfig();

// initialize sentry
if (typeof window === 'object' && publicRuntimeConfig.sentryDsn) {
  import('@sentry/browser').then((Sentry) => {
    Sentry.init({
      dsn: publicRuntimeConfig.sentryDsn,
      release: process.env.RELEASE_TAG,
    });
    window.addEventListener('error', (evt) => {
      Sentry.captureException(evt.error);
    });
  });
}

class MyApp extends App {
  static async getInitialProps({ Component, ctx }) {
    let pageProps = {};
    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx);
    }

    return { pageProps };
  }

  render() {
    const { Component, pageProps, store } = this.props;
    const state = store.getState();
    const locale = get(state, 'language.locale');
    const authed = hasAuthedUser(state);
    return (
      <Provider store={store}>
        <InitProvider locale={locale}>
          <DeviceInfoProvider>
            <LanguageProvider>
              <SubscriptionProvider hasAuthedUser={authed}>
                  <>
                    <Component {...pageProps} />
                  </>
              </SubscriptionProvider>
            </LanguageProvider>
          </DeviceInfoProvider>
        </InitProvider>
      </Provider>
    );
  }
}

export default withDragDropContext(withRedux(makeStore)(MyApp));
