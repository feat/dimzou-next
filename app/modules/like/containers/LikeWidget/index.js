import React from 'react';
import PropTypes from 'prop-types';
import { compose, bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { selectCurrentUser } from '@/modules/auth/selectors';

import Modal from '@feat/feat-ui/lib/modal';

import { initWidget, createLike, deleteLike } from '../../actions';
import WithDetail from './renders/WithDetail';
import WithCard from './renders/WithCard';
import TextBtn from './renders/TextBtn';

import makeSelectLikeWidget from '../../selectors';
import './style.scss';

class LikeWidget extends React.Component {
  compoMap = {
    withDetail: WithDetail,
    withCard: WithCard,
    textBtn: TextBtn,
  };

  componentDidMount() {
    const {
      widgetState,
      initialData,
      entityType,
      entityId,
      channel,
    } = this.props;
    if (!widgetState || !widgetState.isInitialized) {
      this.props.initWidget({
        entityType,
        entityId,
        initialData,
        channel,
      });
    }
  }

  componentDidUpdate(prevProps) {
    if (
      prevProps.widgetState &&
      this.props.returnLikesCount &&
      prevProps.widgetState.likesCount !== this.props.widgetState.likesCount
    ) {
      this.props.returnLikesCount(this.props.widgetState.likesCount);
    }
  }

  handleClick = () => {
    const {
      widgetState,
      capabilities,
      notAllowedMessage,
      entityType,
      entityId,
      like,
      unlike,
    } = this.props;
    if (!capabilities.canLike) {
      Modal.error({
        title: 'Error',
        content: notAllowedMessage,
      });
      return;
    }
    if (widgetState.userHasLiked) {
      unlike({
        entityType,
        entityId,
      });
    } else {
      like({
        entityType,
        entityId,
      });
    }
  };

  render() {
    const { widgetState = {}, capabilities = {}, type } = this.props;
    const props = {
      isInitialized: widgetState.isInitialized,
      canLike: capabilities.canLike,
      userHasLiked: widgetState.userHasLiked,
      onClick: this.handleClick,
      likesCount: widgetState.likesCount,
    };
    const Compo = this.compoMap[type];
    return <Compo {...props} />;
  }
}

LikeWidget.propTypes = {
  capabilities: PropTypes.shape({
    canLike: PropTypes.bool,
  }).isRequired,
  entityType: PropTypes.any.isRequired,
  entityId: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
    .isRequired,
  channel: PropTypes.string,
  type: PropTypes.oneOf(['withDetail', 'withCard', 'textBtn']),
  widgetState: PropTypes.shape({
    isInitialized: PropTypes.bool,
    likes: PropTypes.array,
    likesCount: PropTypes.number,
    userHasLiked: PropTypes.bool,
  }),
  initWidget: PropTypes.func.isRequired,
  like: PropTypes.func,
  unlike: PropTypes.func,
  initialData: PropTypes.object,
  notAllowedMessage: PropTypes.node,
};

LikeWidget.defaultProps = {
  notAllowedMessage: 'Not Allowed',
  type: 'withCard',
};

const mapStateToProps = createStructuredSelector({
  widgetState: makeSelectLikeWidget(),
  currentUser: selectCurrentUser,
});

const mapDispatchToProps = (dispatch) => ({
  ...bindActionCreators(
    {
      initWidget,
      like: createLike,
      unlike: deleteLike,
    },
    dispatch,
  ),
});

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(withConnect)(LikeWidget);
