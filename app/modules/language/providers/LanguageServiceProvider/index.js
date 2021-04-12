import React from 'react';
import { ReactReduxContext } from 'react-redux';
import getInjectors from '@/utils/sagaInjectors';
import { REDUCER_KEY } from '../../config';
import saga from '../../saga';

class LanguageServiceProvider extends React.PureComponent {
  constructor(props, context) {
    super(props);
    this.injectors = getInjectors(context.store);

    this.injectors.injectSaga(REDUCER_KEY, { saga });
  }

  componentWillUnmount() {
    this.injectors.ejectSaga(REDUCER_KEY);
  }

  render() {
    return this.props.children;
  }
}

LanguageServiceProvider.contextType = ReactReduxContext;

export default LanguageServiceProvider;
