import React from 'react';
import { List, Record } from 'immutable';

const KEY_SEPARATOR = '-';
const PREFIX = 'line';

function defaultFilter(block) {
  return block.getType() === 'code-block';
}

function defaultRender(props) {
  return (
    <span
      data-line-num={props.num}
    >
      {props.children}
    </span>
  );
}

const CodeLineOptions = Record({
  filter: defaultFilter,
  render: defaultRender,
});

function CodeLineDecorator(options) {
  this.options = CodeLineOptions(options || {});
  this.lineData = {};
}

CodeLineDecorator.prototype.getDecorations = function (block, contentState) {  // eslint-disable-line
  let lineNum = 1;

  const filter = this.options.get('filter');

  const blockKey = block.getKey();
  const blockText = block.getText();
  const decorations = Array(blockText.length).fill(null);

  if (!filter(block)) {
    return List(decorations);
  }

  for (let i = 0; i < blockText.length; i += 1) {
    if (blockText[i] === '\n') {
      const key = `${blockKey}${KEY_SEPARATOR}${PREFIX}${lineNum}`;
      decorations[i] = key;
      const data = {
        num: lineNum,
        lineBreak: true,
      };
      if (i === blockText.length - 1) {
        data.isReturnEnd = true;
      }
      this.lineData[key] = data;
      lineNum += 1;
    }
  }

  return List(decorations);
};

CodeLineDecorator.prototype.getComponentForKey = function (key) {
  return this.options.get('render');
};

CodeLineDecorator.prototype.getPropsForKey = function (key) {
  const data = this.lineData[key];
  return data;
};

export default CodeLineDecorator;
