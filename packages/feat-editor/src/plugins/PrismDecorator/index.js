import React from 'react';
import { List, Record } from 'immutable';
import Prism from 'prismjs';

import occupySlice from './lib/occupySlice';

const KEY_SEPARATOR = '-';

function defaultFilter(block) {
  return block.getType() === 'code-block';
}

function defaultGetSyntax(block) {
  if (block.getData) {
    return block.getData().get('syntax');
  }
  return null;
}

function defaultRender(props) {
  const className = `prism-token token ${props.type}`;
  return (
    <span
      type={props.type}
      className={className}
    >
      {props.children}
    </span>
  );
}

const PrismOptions = Record({
  defaultSyntax: null,
  filter: defaultFilter,
  getSyntax: defaultGetSyntax,
  render: defaultRender,
});

function PrismDecorator(options) {
  this.options = PrismOptions(options || {});
  this.highlighted = {};
}

PrismDecorator.prototype.getDecorations = function (block, contentState) {  // eslint-disable-line
  let
    token,
    tokenId,
    resultId,
    offset = 0;
  const filter = this.options.get('filter');
  const getSyntax = this.options.get('getSyntax');
  const blockKey = block.getKey();
  const blockText = block.getText();
  const decorations = Array(blockText.length).fill(null);

  this.highlighted[blockKey] = {};

  if (!filter(block)) {
    return List(decorations);
  }

  const syntax = getSyntax(block) || this.options.get('defaultSyntax');

  // Allow for no syntax highlighting
  if (syntax == null) {
    return List(decorations);
  }

  // Parse text using Prism
  const grammar = Prism.languages[syntax];
  if (!grammar) {
    return List(decorations);
  }
  const tokens = Prism.tokenize(blockText, grammar);

  for (let i = 0; i < tokens.length; i++) {
    token = tokens[i];

    if (typeof token === 'string') {
      offset += token.length;
    } else {
      tokenId = `tok${offset}`;
      resultId = `${blockKey}-${tokenId}`;

      this.highlighted[blockKey][tokenId] = token;

      occupySlice(decorations, offset, offset + token.length, resultId);
      offset += token.length;
    }
  }

  return List(decorations);
};

PrismDecorator.prototype.getComponentForKey = function (key) {
  return this.options.get('render');
};

PrismDecorator.prototype.getPropsForKey = function (key) {
  const parts = key.split(KEY_SEPARATOR);
  const blockKey = parts[0];
  const tokId = parts[1];
  const token = this.highlighted[blockKey][tokId];

  return {
    type: token.type,
  };
};

export default PrismDecorator;
