import React from 'react';
import PropTypes from 'prop-types';

import { withRouter } from 'next/router'

import request from '@/utils/request';
import SplashView from '@/components/SplashView';

class InvitationPage extends React.Component {
  // state = {
  //   loading: true,
  // };

  componentDidMount() {
    const { code } = this.props.router.query;
    request({
      url: `/api/dimzou/bundle/verify-invitation/${code}/`,
      method: 'GET',
    })
      .then(({ data }) => {
        if (data.entityType === 'dimzou_bundle') {
          this.props.router.replace({
            pathname: '/dimzou-edit',
            query: {
              bundleId: data.entityId,
              invitation: code,
            },
          }, `/draft/${data.entityId}?invitation=${code}`)
        }

        // let redirectUrl;
        // if (data.entityType === 'dimzou_bundle') {
        //   redirectUrl = `/draft/${data.entityId}?invitation=${code}`;
        // } else {
        //   redirectUrl = `/${data.entityType}/${
        //     data.entityId
        //   }?invitation=${code}`;
        // }
        // this.setState({
        //   loading: false,
        //   redirectUrl,
        // });
      })
      .catch((err) => {
        if (err.response) {
          this.setState({
            // loading: false,
            error: {
              message: err.response.data.message,
            },
          });
        }
      });
  }

  render() {
    if (this.state.error) {
      return <div>{this.state.error.message}</div>;
    }
    return <SplashView />;
    // return <Redirect to={this.state.redirectUrl} />;
  }
}

InvitationPage.propTypes = {
  router: PropTypes.object,
}


export default withRouter(InvitationPage);
