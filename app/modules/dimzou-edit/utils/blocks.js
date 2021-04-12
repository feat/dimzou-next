// import uuidv1 from 'uuid/v1';

import {
  BLOCK_CONTENT_TYPE_TEXT,
  BLOCK_CONTENT_TYPE_CODE_BLOCK,
  BLOCK_CONTENT_TYPE_MEDIA,
  EDIT_MODE_TRANSLATION,
  EDIT_MODE_ORIGIN,
} from '../constants';

// export function generateParaId() {
//   return `${uuidv1()}-0`;
// }

export function constructAppendParaId(paragraphId) {
  if (!paragraphId) {
    return undefined;
  }
  const compos = paragraphId.split('-');
  compos[compos.length - 1] = 1;
  return compos.join('-');
}

export function getLastBlock(dimzou) {
  const lastBlock = dimzou.content[dimzou.content.length - 1];
  return lastBlock;
}

// export function getInsertBlockKey(dimzou) {
//   const lastBlock = getLastBlock(dimzou);
//   return lastBlock
//     ? constructAppendParaId(lastBlock.paragraphId)
//     : generateParaId();
// }

export function matchCodeBlockInfo(htmlContent) {
  const codeBlockReg = /^<pre(?:.*)?>.*?<code(?: data-origin=".*")? data-language="(.*)">((?:(?:\n?).*)*)\n?<\/code><\/pre>$/;
  const result = codeBlockReg.exec(htmlContent);
  if (result) {
    // const code = result[2]
    //   .replace(/&gt;/g, '>')
    //   .replace(/&lt;/g, '<')
    //   .replace(/&amp;/g, '&')
    //   .replace(/&quot;/g, '"');

    return {
      language: result[1],
      code: result[2],
      content: `<pre><code class="language-${result[1]}">${
        result[2]
      }</code></pre>`,
    };
  }
  return null;
}

export function matchMediaInfo(htmlContent) {
  const mediaBlockReg = /^<(?:p|figure)(?: data-origin=".*?")?>.*?<(img|audio|video) src="(.*?)"(?:.*)?\/?>.*?<\/(?:p|figure)>$/;
  const result = mediaBlockReg.exec(htmlContent);
  if (result) {
    return {
      mediaType: result[1],
      src: result[2],
    };
  }
  return null;
}

export function getBlockContentType(htmlContent) {
  let blockInfo;
  blockInfo = matchCodeBlockInfo(htmlContent);
  if (blockInfo) {
    return {
      type: BLOCK_CONTENT_TYPE_CODE_BLOCK,
      meta: blockInfo,
    };
  }
  blockInfo = matchMediaInfo(htmlContent);
  if (blockInfo) {
    return {
      type: BLOCK_CONTENT_TYPE_MEDIA,
      meta: blockInfo,
    };
  }
  return { type: BLOCK_CONTENT_TYPE_TEXT };
}

export function getContentFeatures(mode) {
  switch (mode) {
    case EDIT_MODE_TRANSLATION:
      return {
        canAppendContent: false,
      };
    case EDIT_MODE_ORIGIN:
      return {
        canAppendContent: true,
      };
    default:
      return {};
  }
}
