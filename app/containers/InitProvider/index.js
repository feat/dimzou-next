import React from 'react';
import PropTypes from 'prop-types';
import { ReactReduxContext } from 'react-redux';
import { configureScope } from '@sentry/browser';
// import dynamic from 'next/dynamic'
import { selectCurrentUserId } from '@/modules/auth/selectors';
import ApiError from '@/errors/ApiError';

import { routinePromiseWatcherSaga } from 'redux-saga-routines';
// const DynamicParty = dynamic(
//   () => import('@/modules/party/containers'),
//   { ssr: false }
// )

class InitProvider extends React.PureComponent {
  state = {
    isServer: typeof window === 'undefined',
  };

  async componentWillMount() {
    if (!this.state.isServer) {
      const { store } = this.context;
      // const currentUser = selectCurrentUser(store.getState())
      store.runSaga(routinePromiseWatcherSaga);
      const saga = await import('@/saga');
      store.runSaga(saga.default);
      configureScope((scope) => {
        scope.setUser({
          userId: selectCurrentUserId(store.getState()),
        });
      });
    }
  }

  static getDerivedStateFromError(error) {
    if (!(error instanceof ApiError)) {
      return { appError: error };
    }
    return {};
  }

  componentDidCatch(error, info) {
    if (!(error instanceof ApiError)) {
      logging.error(error, info);
    }
  }

  render() {
    if (this.state.appError) {
      return (
        <div>
          <h1>Something went wrong</h1>
          <p>Message: {this.state.appError.message}</p>
        </div>
      );
    }
    return React.Children.only(this.props.children);
  }
}

InitProvider.propTypes = {
  children: PropTypes.node,
};

InitProvider.contextType = ReactReduxContext;

export default InitProvider;
