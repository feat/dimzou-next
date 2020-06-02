import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { connect } from 'react-redux';

import Button from '@feat/feat-ui/lib/button';

import { openLanguageSelect } from '../../actions';
import { selectLanguageSelectTrigger } from '../../selectors';

function LanguageSelectTrigger(props) {
  const { className, style, region, label, onClick, isOpen } = props;
  return (
    <Button
      type="primaryOutline"
      className={classNames(className, {
        'is-active': isOpen,
      })}
      style={style}
      onClick={onClick}
    >
      {region || label}
    </Button>
  );
}

LanguageSelectTrigger.propTypes = {
  className: PropTypes.string,
  style: PropTypes.object,
  onClick: PropTypes.func,
  isOpen: PropTypes.bool,
  region: PropTypes.string,
  label: PropTypes.string,
};

export default connect(
  selectLanguageSelectTrigger,
  {
    onClick: () => openLanguageSelect(),
  },
)(LanguageSelectTrigger);
