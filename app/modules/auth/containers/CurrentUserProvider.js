import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { createStructuredSelector } from 'reselect';

import { selectCurrentUser } from '../selectors';

export const CurrentUserInfo = React.createContext();

export function withCurrentUser(Compo) {
  function WrapperComponent(props) {
    return (
      <CurrentUserInfo.Consumer>
        {(state) => <Compo {...props} user={state} />}
      </CurrentUserInfo.Consumer>
    );
  }
  return WrapperComponent;
}
export class CurrentUserProvider extends React.PureComponent {
  render() {
    return (
      <CurrentUserInfo.Provider value={this.props.user}>
        {this.props.children}
      </CurrentUserInfo.Provider>
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
