import React from 'react';
import PropTypes from 'prop-types';
import Button from '@feat/feat-ui/lib/button';
import TranslatableMessage from '@/modules/language/containers/TranslatableMessage';
import cMessage from '@/messages/common';
import './style.scss';

function BlockErrorHint(props) {
  const { error, onRetry, style } = props;
  return (
    <div style={style} className="BlockErrorHint">
      {error.message}
      {onRetry && (
        <Button onClick={onRetry}>
          <TranslatableMessage message={cMessage.retry} />
        </Button>
      )}
    </div>
  );
}

BlockErrorHint.propTypes = {
  error: PropTypes.object,
  onRetry: PropTypes.func,
  style: PropTypes.object,
};

export default BlockErrorHint;
