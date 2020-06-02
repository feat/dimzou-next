import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Modal from '@feat/feat-ui/lib/modal';
import { selectIsAuthModalOpened } from '../../selectors';
import { closeAuthModal } from '../../actions';

class AuthModal extends React.PureComponent {
  handleClose = () => {
    this.props.closeAuthModal();
  };

  render() {
    return (
      <Modal
        isOpen={this.props.isOpened}
        maskClosable
        onClose={this.handleClose}
      >
        <div>TODO Panel</div>
      </Modal>
    );
  }
}

AuthModal.propTypes = {
  isOpened: PropTypes.bool,
  closeAuthModal: PropTypes.func,
};

const mapStateToProps = (state) => ({
  isOpened: selectIsAuthModalOpened(state),
});

export default connect(
  mapStateToProps,
  { closeAuthModal },
)(AuthModal);
