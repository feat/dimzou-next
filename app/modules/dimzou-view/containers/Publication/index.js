import React from 'react';

import PropTypes from 'prop-types';

import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';

import notification from '@feat/feat-ui/lib/notification';
import SplashView from '@/components/SplashView';

import { asyncInitDimzouView, asyncFetchNodePublication } from '../../actions';
import { selectDimzouViewState } from '../../selectors';
import PageView from '../../components/PageView';

class DimzouPublication extends React.PureComponent {
  componentDidMount() {
    const { request, bundleId, nodeId } = this.props;
    if (!request.initialized && !request.loading) {
      this.props.initDimzouView({ bundleId, nodeId, related: false }).catch((err) => {
        notification.error({
          message: 'Error',
          description: err.message,
        });
      });
    }
  }

  render() {
    const { request } = this.props;
    if (!request.initialized || request.loading) {
      return <SplashView />;
    }
    if (request.error) {
      return <div>{request.error.message}</div>;
    }

    const nodeId = request.nodes[0].id
    const publicationId = request.loaded[nodeId];

    return (
      <PageView style={{ marginBottom: '6rem' }} publicationId={publicationId} />
    );
  }
}

DimzouPublication.propTypes = {
  bundleId: PropTypes.string,
  nodeId: PropTypes.string,
  request: PropTypes.object,
  initDimzouView: PropTypes.func,
};

const mapStateToProps = createStructuredSelector({
  request: selectDimzouViewState,
});
const withConnect = connect(
  mapStateToProps,
  {
    initDimzouView: asyncInitDimzouView,
    fetchNodePublication: asyncFetchNodePublication,
  },
);

export default compose(withConnect)(DimzouPublication);
