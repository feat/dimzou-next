// DOCS: https://github.com/sstur/draft-js-utils/tree/master/packages/draft-js-export-html
import kebabCase from 'lodash/kebabCase';
// import escape from 'lodash/escape';

import { BLOCK_TYPE } from '../constants';

const blockRenderers = {
  // [BLOCK_TYPE.CODE_BLOCK]: (block) => {
  //   const data = block.getData();
  //   const syntax = data.get('syntax') || 'javascript';
  //   return `<pre><code data-language="${syntax}">${escape(block.getText())}</code></pre>`;
  // },
};

const blockStyleFn = (block) => {
  const data = block.getData().toJS();
  const output = {};
  if (block.getType() === BLOCK_TYPE.CODE_BLOCK) {
    data.language = data.language || 'javascript';
    delete data.syntax;
  }
  Object.keys(data).forEach((key) => {
    output[`data-${kebabCase(key)}`] = data[key];
  });
  return {
    attributes: output,
  };
};

const inlineStyles = {
  LIGHT: {
    attributes: { class: 't-light' },
  },
};

export default {
  inlineStyles,
  inlineStylesFn: undefined,
  blockRenderers,
  defaultBlockTag: undefined,
  blockStyleFn,
  entityStyleFn: undefined,
};
