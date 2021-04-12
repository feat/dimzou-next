import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { createStructuredSelector } from 'reselect';
import { configureScope } from '@sentry/browser';

import { selectCurrentUser } from '../selectors';

import { CurrentUser } from '../context';

export function withCurrentUser(Compo) {
  function WrapperComponent(props) {
    return (
      <CurrentUser.Consumer>
        {(state) => <Compo {...props} currentUser={state} />}
      </CurrentUser.Consumer>
    );
  }
  WrapperComponent.displayName = `withCurrentUser(${Compo.displayName ||
    Compo.name})`;
  return WrapperComponent;
}
export class CurrentUserProvider extends React.PureComponent {
  constructor(props) {
    super(props);
    if (typeof window === 'undefined') {
      configureScope((scope) => {
        scope.setUser({
          userId: props.user.uid,
        });
      });
    }
  }

  render() {
    return (
      <CurrentUser.Provider value={this.props.user}>
        {this.props.children}
      </CurrentUser.Provider>
    );
  }
}
CurrentUserProvider.propTypes = {
  user: PropTypes.object,
  children: PropTypes.node,
};
const mapStateToProps = createStructuredSelector({
  user: selectCurrentUser,
});
export default connect(mapStateToProps)(CurrentUserProvider);
