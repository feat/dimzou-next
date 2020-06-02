import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';

import notification from '@feat/feat-ui/lib/notification';

import SplashView from '@/components/SplashView';


import WorksView from '../../components/WorksView';
import BookView from '../../components/BookView';

import { DETAIL_VIEW_TYPE_BOOK, DETAIL_VIEW_TYPE_WORK } from '../../constants';
import { asyncInitDimzouView, asyncFetchNodePublication } from '../../actions';
import { selectDimzouViewState } from '../../selectors';

class DimzouView extends React.Component {
  componentDidMount() {
    const { request, bundleId, nodeId } = this.props;
    if (!request.initialized && !request.loading) {
      this.props.initDimzouView({ bundleId, nodeId, related: true }).catch((err) => {
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
    if (request.type === DETAIL_VIEW_TYPE_WORK) {
      return (
        <WorksView
          nodes={request.nodes}
          loaded={request.loaded}
          bundleId={this.props.bundleId}
          nodeId={this.props.nodeId}
        />
      );
    }
    if (request.type === DETAIL_VIEW_TYPE_BOOK) {
      return (
        <BookView
          nodes={request.nodes}
          loaded={request.loaded}
          bundleId={this.props.bundleId}
          nodeId={this.props.nodeId}
          fetchNodePublication={this.props.fetchNodePublication}
        />
      );
    }

    return <div>Invalid Status</div>;
  }
}

DimzouView.propTypes = {
  bundleId: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
  nodeId: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
  request: PropTypes.object,
  initDimzouView: PropTypes.func,
  fetchNodePublication: PropTypes.func,
};

const mapStateToProps = createStructuredSelector({
  request: selectDimzouViewState,
});

const mapDispatchToProps = {
  initDimzouView: asyncInitDimzouView,
  fetchNodePublication: asyncFetchNodePublication,
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);


export default compose(
  withConnect,
)(DimzouView);
