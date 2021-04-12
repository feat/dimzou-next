import React from 'react';
import { ReactReduxContext } from 'react-redux';
import getSagaInjectors from '@/utils/sagaInjectors';
import saga from '../saga';

class UserServiceProvider extends React.PureComponent {
  constructor(props, context) {
    super(props);
    this.sageInjector = getSagaInjectors(context.store);

    this.sageInjector.injectSaga('user', { saga });
  }

  componentWillUnmount() {
    this.sageInjector.ejectSaga('user');
  }

  render() {
    return this.props.children;
  }
}

UserServiceProvider.contextType = ReactReduxContext;

export default UserServiceProvider;
