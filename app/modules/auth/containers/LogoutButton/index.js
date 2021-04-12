import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { useIntl } from 'react-intl';
import ButtonBase from '@feat/feat-ui/lib/button/ButtonBase';

import { ReactComponent as LogoutIcon } from '@/assets/icons/logout.svg';
import mMessages from '@/messages/menu';

import { asyncLogout } from '../../actions';

function LogoutButton({ className, onClick }) {
  return (
    <ButtonBase className={className} onClick={onClick}>
      <LogoutIcon className="size_md" />
    </ButtonBase>
  );
}

LogoutButton.propTypes = {
  className: PropTypes.string,
  onClick: PropTypes.func.isRequired,
};

const mapDispatchToProps = (dispatch) => ({
  onClick: () =>
    dispatch(asyncLogout())
      .then(() => {
        window.location.reload();
      })
      .catch((err) => {
        logging.error(err);
      }),
});

export default connect(
  null,
  mapDispatchToProps,
)(LogoutButton);

const TextButton = ({ className, onClick, style }) => {
  const { formatMessage } = useIntl();
  return (
    <button type="button" className={className} onClick={onClick} style={style}>
      {formatMessage(mMessages.logout)}
    </button>
  );
};

export const LogoutBlock = connect(
  null,
  mapDispatchToProps,
)(TextButton);
