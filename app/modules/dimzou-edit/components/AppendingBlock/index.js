import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { selectAppendingState } from '../../selectors';
import EditorBlock from './EditorBlock';
import UploadBlock from './UploadBlock';

function AppendingBlock(props) {
  const { type } = props;
  switch (type) {
    case 'editor':
      return <EditorBlock {...props} />;
    case 'upload':
      return <UploadBlock {...props} />;
    default:
      return <div>Unknown Append Block {type}</div>;
  }
}

AppendingBlock.propTypes = {
  dispatch: PropTypes.func,
  type: PropTypes.string,
};

export default connect(selectAppendingState)(AppendingBlock);
