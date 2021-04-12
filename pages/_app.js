import React from 'react';
import { Provider } from 'react-redux';
import { compose } from 'redux';
import App from 'next/app';

import withRedux from 'next-redux-wrapper';

import '@/styles/main.scss';

import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

import { normalize } from 'normalizr';
import NProgress from 'nprogress';
import Router from 'next/router';

import get from 'lodash/get';

import { user as userSchema, category as categorySchema } from '@/schema';
import { configureStore } from '@/store';

import message from '@feat/feat-ui/lib/message';
import LanguageProvider from '@/modules/language/containers/LanguageProvider';
import DeviceInfoProvider from '@/modules/device-info';

import ErrorBoundary from '@/components/ErrorBoundary';
import AppDndService from '@/services/dnd/AppDndService';

import LanguageServiceProvider from '@/modules/language/providers/LanguageServiceProvider';
import LikeServiceProvider from '@/modules/like/providers/LikeServiceProvider';
import CommentServiceProvider from '@/modules/comment/providers/CommentServiceProvider';

import CurrentUserProvider from '@/modules/auth/providers/CurrentUserProvider';

import { fetchUserCategories } from '@/modules/category/actions';

import { setCurrentUser } from '@/modules/auth/actions';
import { hasAuthedUser } from '@/modules/auth/selectors';
import { setLocale, fetchTranslations } from '@/modules/language/actions';

import request from '@/utils/request';
import withApiClient from '../next/withApiClient';

import '@/services/logging';

message.config({
  top: 70,
});

NProgress.configure({ showSpinner: false });

Router.events.on('routeChangeStart', (url) => {
  logging.info(`Loading: ${url}`);
  NProgress.start();
});
Router.events.on('routeChangeComplete', () => NProgress.done());
Router.events.on('routeChangeError', () => NProgress.done());

const makeStore = (initialState, { req, api }) => {
  let store;
  if (typeof window === 'object') {
    store = configureStore(initialState, {
      request,
    });
  } else {
    store = configureStore(initialState, {
      request: api,
    });
  }

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

  // initialize language locale for ssr
  const locale = get(store.getState(), 'language.locale');
  if (locale) {
    request.defaults.headers.common['X-Language-Locale'] = locale;
  }

  return store;
};

// 根据配置一层一层渲染 Provider
function makeServiceWrapper(services = []) {
  function Wrapper(props) {
    return [...services].reverse().reduce((children, service) => {
      if (Array.isArray(service)) {
        return React.createElement(service[0], service[1], children);
      }
      return React.createElement(service, undefined, children);
    }, props.children);
  }
  return Wrapper;
}
class MyApp extends React.Component {
  constructor(props) {
    super(props);
    logging.debug('app construct');
    this.services = [
      DeviceInfoProvider,
      AppDndService,
      LanguageServiceProvider,
      CurrentUserProvider,
      LikeServiceProvider,
      CommentServiceProvider,
      LanguageProvider,
    ];

    this.Wrapper = makeServiceWrapper(this.services);
  }

  static async getInitialProps(appContext) {
    const appProps = await App.getInitialProps(appContext);
    const hasAuthed = hasAuthedUser(appContext.ctx.store.getState());
    return {
      ...appProps,
      hasAuthed,
    };
  }

  render() {
    const { Component, pageProps, store } = this.props;
    const { Wrapper } = this;
    return (
      <Provider store={store}>
        <ErrorBoundary>
          <DndProvider backend={HTML5Backend}>
            <Wrapper>
              <Component {...pageProps} />
            </Wrapper>
          </DndProvider>
        </ErrorBoundary>
      </Provider>
    );
  }
}

export default compose(
  withApiClient,
  withRedux(makeStore),
)(MyApp);
