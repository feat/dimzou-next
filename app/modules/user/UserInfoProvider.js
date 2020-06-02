import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';

import { createStructuredSelector } from 'reselect'
import { asyncFetchUserInfo } from './actions';
import { selectRequestState, selectUserInfo } from './selectors';

export const UserInfo = React.createContext();

class UserInfoContext extends React.PureComponent {
  componentDidMount() {
    const { request } = this.props;
    if (!request.fetchedAt && !request.isFetching) {
      this.props.fetchUserInfo({ userId: this.props.userId });
    }
  }

  render() {
    const { request, userInfo } = this.props;
    return (
      <UserInfo.Provider
        value={{
          request, data: userInfo,
        }}>
        {this.props.children}
      </UserInfo.Provider>
    )
  }
}

UserInfoContext.propTypes = {
  userId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  request: PropTypes.object,
  userInfo: PropTypes.object,
  fetchUserInfo: PropTypes.func,
  children: PropTypes.any,
};

const mapStateToProps = createStructuredSelector({
  request: selectRequestState,
  userInfo: selectUserInfo,
})
const mapDispatchToProps = {
  fetchUserInfo: asyncFetchUserInfo,
};

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(
  withConnect,
)(UserInfoContext);
