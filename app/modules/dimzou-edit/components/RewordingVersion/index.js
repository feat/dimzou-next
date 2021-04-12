import React from 'react';
import PropTypes from 'prop-types';
import ButtonBase from '@feat/feat-ui/lib/button/ButtonBase';
import Icon from '../Icon';
import './style.scss';

function RewordingVersion(props) {
  return (
    <div className="dz-RewordingVersion">
      <ButtonBase
        // isActive={props.isActive}
        onClick={props.onClick}
        className="margin_r_5 size_xs"
      >
        <Icon name="reword" />
      </ButtonBase>
      <span className="dz-RewordingVersion__num">{props.version}</span>
    </div>
  );
}

RewordingVersion.propTypes = {
  // isActive: PropTypes.bool,
  onClick: PropTypes.func,
  version: PropTypes.number,
};

export default RewordingVersion;
