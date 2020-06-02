import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { EditorState, convertToRaw, convertFromRaw } from '@feat/draft-js';
import { stateToHTML } from 'draft-js-export-html';
import { stateFromHTML } from 'draft-js-import-html';

import BaseEditor from './components/Editor';
import handleBeforeCut from './plugins/Annotation/handlers/handleBeforeCut';
import handleBeforeInput from './plugins/Annotation/handlers/handleBeforeInput';
import handleKeyCommand from './plugins/Annotation/handlers/handleKeyCommand';
import handlePastedText from './plugins/Annotation/handlers/handlePastedText';
import handleReturn from
  './plugins/Annotation/handlers/handleReturn';
import handleToggleBlockType from
  './plugins/Annotation/handlers/handleToggleBlockType';
import handleToggleInlineStyle from
  './plugins/Annotation/handlers/handleToggleInlineStyle';

import MultiDecorator from './libs/MultiDecorator';
import PrismDecorator from './plugins/PrismDecorator';
import AnnotationDecorator from './plugins/Annotation/AnnotationDecorator';

import stateFromHTMLConfig from './plugins/Annotation/helpers/stateFromHTMLConfig';
import stateToHTMLConfig from './plugins/Annotation/helpers/stateToHTMLConfig';

export const Editor = ({ userInfo, ...props }) => (
  <BaseEditor
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

Editor.propTypes = {
  userInfo: PropTypes.shape({
    userId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    username: PropTypes.string,
  }).isRequired,
};

export const defaultDecorator = new MultiDecorator([
  new PrismDecorator(),
  new AnnotationDecorator(),
]);

export const contentStateToHTML = (content, options = stateToHTMLConfig) => stateToHTML(content, options);

export const contentStateFromHTML = (html, options = stateFromHTMLConfig) => stateFromHTML(html, options);

export const contentStateToRaw = convertToRaw;

export const createEmpty = (decorator = defaultDecorator) => EditorState.createEmpty(decorator);

export const createWithContent = (content, decorator = defaultDecorator) =>
  EditorState.createWithContent(content, decorator);

export const createFromRawData = (raw, decorator = defaultDecorator) =>
  EditorState.createWithContent(convertFromRaw(raw), decorator);

