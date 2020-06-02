import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import IconButton from '@feat/feat-ui/lib/button/IconButton';
import { formatMessage } from '@/services/intl';
import mMessages from '@/messages/menu';

import { asyncLogout } from '../../actions';

function LogoutButton({ className, onClick }) {
  return (
    <IconButton
      className={className}
      onClick={onClick}
      svgIcon="logout"
      size="md"
    />
  );
}

LogoutButton.propTypes = {
  className: PropTypes.string,
  onClick: PropTypes.func.isRequired,
};

const mapDispatchToProps = (dispatch) => ({
  onClick: () => dispatch(asyncLogout()).then(() => {
    window.location.reload();
  }).catch((err) => {
    logging.error(err);
  }),
});

export default connect(
  null,
  mapDispatchToProps,
)(LogoutButton);

export const LogoutBlock = connect(
  null,
  mapDispatchToProps,
)(({ className, onClick, style, children }) => (
  <button 
    type="button" 
    className={className} 
    onClick={onClick}
    style={style}
  >
    {children || 
    formatMessage(mMessages.logout)
    }
  </button>
));
