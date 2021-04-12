import React from 'react';
import { ReactReduxContext } from 'react-redux';
import getSagaInjectors from '@/utils/sagaInjectors';
import getReducerInjectors from '@/utils/reducerInjectors';
import saga from '../saga';
import reducer from '../reducer';

// eslint-disable-next-line import/no-mutable-exports

import { REDUCER_KEY } from '../config';

class LikeServiceProvider extends React.PureComponent {
  constructor(props, context) {
    super(props);
    this.reducerInjector = getReducerInjectors(context.store);
    this.sageInjector = getSagaInjectors(context.store);

    this.reducerInjector.injectReducer(REDUCER_KEY, reducer);
    this.sageInjector.injectSaga(REDUCER_KEY, { saga });
  }

  componentWillUnmount() {
    this.sageInjector.ejectSaga(REDUCER_KEY);
  }

  render() {
    return this.props.children;
  }
}

LikeServiceProvider.contextType = ReactReduxContext;

export default LikeServiceProvider;
