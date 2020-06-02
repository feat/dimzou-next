import React from 'react';
import PropTypes from 'prop-types';
import Editor from '@feat/feat-editor/lib/components/Editor';
import handleBeforeCut from '@feat/feat-editor/lib/plugins/Annotation/handlers/handleBeforeCut';
import handleBeforeInput from '@feat/feat-editor/lib/plugins/Annotation/handlers/handleBeforeInput';
import handleKeyCommand from '@feat/feat-editor/lib/plugins/Annotation/handlers/handleKeyCommand';
import handlePastedText from '@feat/feat-editor/lib/plugins/Annotation/handlers/handlePastedText';
import handleReturn from
  '@feat/feat-editor/lib/plugins/Annotation/handlers/handleReturn';
import handleToggleBlockType from
  '@feat/feat-editor/lib/plugins/Annotation/handlers/handleToggleBlockType';
import handleToggleInlineStyle from
  '@feat/feat-editor/lib/plugins/Annotation/handlers/handleToggleInlineStyle';

const AuditEditor = ({ userInfo, ...props }) => (
  <Editor
    {...props}
    handleBeforeCut={(...args) => handleBeforeCut(...args, userInfo)}
    handleBeforeInput={(...args) => handleBeforeInput(...args, userInfo)}
    handlePastedText={(...args) => handlePastedText(...args, userInfo)}
    handleKeyCommand={(...args) => handleKeyCommand(...args, userInfo)}
    handleReturn={(...args) => handleReturn(...args, userInfo)}
    handleToggleBlockType={(...args) => handleToggleBlockType(...args, userInfo)}
    handleToggleInlineStyle={(...args) => handleToggleInlineStyle(...args, userInfo)}
  />
);

AuditEditor.propTypes = {
  userInfo: PropTypes.shape({
    userId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    username: PropTypes.string,
  }).isRequired,
};

export default AuditEditor;
