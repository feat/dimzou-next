import {
  createWithContent,
  createFromRawData,
  contentStateFromHTML,
  contentStateToHTML,
} from '@feat/feat-editor';

import { ENTITY_TYPE, BLOCK_TYPE } from '@feat/feat-editor/lib/constants';
import uploadManager from '@feat/feat-editor/lib/plugins/FileUpload';
import HTMLExport from '@feat/feat-editor/lib/plugins/HTMLExport';
import { EditorState, Modifier, SelectionState } from '@feat/draft-js';
import DraftPasteProcessor from '@feat/draft-js/lib/DraftPasteProcessor';
import BlockMapBuilder from '@feat/draft-js/lib/BlockMapBuilder';
import DefaultDraftBlockRenderMap from '@feat/draft-js/lib/DefaultDraftBlockRenderMap';

export const createEmptyTitle = () =>
  createFromRawData({
    blocks: [{ type: 'header-one', text: '' }],
    entityMap: {},
  });

export const createEmptyContent = () =>
  createFromRawData({
    blocks: [{ type: 'unstyled', text: '' }],
    entityMap: {},
  });

export const createEmptyWithFocus = () => {
  const editorState = createEmptyContent();
  return EditorState.moveFocusToEnd(editorState);
};

export const createFromHTML = (html) =>
  createWithContent(contentStateFromHTML(html));

export const createFromHTMLWithFocus = (html) =>
  EditorState.moveFocusToEnd(createFromHTML(html));

export const handleKeyCommand = (editorState, onChange, command) => {
  // block first block type change;
  if (command === 'backspace') {
    const content = editorState.getCurrentContent();
    // const selection = editorState.getSelection();

    if (
      content.getBlockMap().size === 1 &&
      content.getFirstBlock().getText().length === 0
    ) {
      return 'handled';
    }
  }
  return 'not-handled';
};

export const preventTitleBlockChange = (editorState, onChange, command) => {
  if (command === 'backspace') {
    const content = editorState.getCurrentContent();
    // const selection = editorState.getSelection();

    if (
      content.getBlockMap().size === 1 &&
      content.getFirstBlock().getText().length === 0
    ) {
      return 'handled';
    }
  }
  return 'not-handled';
};

export const beforeToggleBlockType = (editorState) => {
  const currentContent = editorState.getCurrentContent();
  const selection = editorState.getSelection();
  const currentBlock = currentContent.getBlockForKey(selection.getStartKey());
  if (currentBlock.getType() === 'header-one') {
    return false;
  }
  return true;
};

export const makeFocus = (editorState) =>
  EditorState.moveFocusToEnd(editorState);
export const hasFocus = (editorState) =>
  editorState.getSelection().getHasFocus();

export const hasText = (editorState) =>
  editorState.getCurrentContent().hasText();

export const getOutput = (editorState) => {
  const contentState = editorState.getCurrentContent();
  const html = HTMLExport(contentState, uploadManager);
  const blockMap = contentState.getBlockMap();
  const text = blockMap
    .map((contentBlock) => contentBlock.getText())
    .toArray()
    .join('\n');
  return {
    text,
    html,
  };
};

export const getText = (editorState) => {
  const contentState = editorState.getCurrentContent();
  const blockMap = contentState.getBlockMap();
  return blockMap
    .map((contentBlock) => contentBlock.getText())
    .toArray()
    .join('\n');
};

export const getHTML = (editorState) =>
  contentStateToHTML(editorState.getCurrentContent());

export const splitHtmlContent = (html) => {
  const dom = document.createElement('div');
  dom.innerHTML = html;
  const childrenCount = dom.children.length;
  if (childrenCount.length === 0) {
    return {
      title: '',
      content: '',
    };
  }
  const title = dom.removeChild(dom.children[0]).outerHTML;
  const content = dom.innerHTML;
  return {
    title,
    content,
  };
};

export const getEntities = (editorState, entityType = null) => {
  const content = editorState.getCurrentContent();
  const entities = [];
  content.getBlocksAsArray().forEach((block) => {
    let selectedEntity = null;
    block.findEntityRanges(
      (character) => {
        if (character.getEntity() !== null) {
          const entity = content.getEntity(character.getEntity());
          if (!entityType || (entityType && entity.getType() === entityType)) {
            selectedEntity = {
              entityKey: character.getEntity(),
              blockKey: block.getKey(),
              entity: content.getEntity(character.getEntity()),
            };
            return true;
          }
        }
        return false;
      },
      (start, end) => {
        entities.push({ ...selectedEntity, start, end });
      },
    );
  });
  return entities;
};

export const getImageList = (editorState) => {
  const imageEntities = getEntities(editorState, ENTITY_TYPE.IMAGE);
  const imageUploaderEntities = getEntities(
    editorState,
    ENTITY_TYPE.IMAGE_UPLOADER,
  );
  const ids = [];

  const uploadResolved = imageUploaderEntities.every((record) => {
    const { key } = record.entity.getData();
    const task = uploadManager.getTask(key);
    if (task.data) {
      ids.push(task.data['data-id']);
      return true;
    }
    return false;
  });

  if (!uploadResolved) {
    return false;
  }

  return [
    ...imageEntities.map((record) => record.entity.getData()['data-id']),
    ...ids,
  ];
};

function getImageRoot(node) {
  const parent = node.parentNode;
  if (parent.childNodes.length > 1) {
    return node;
  }
  return getImageRoot(parent);
}

// config: { clearInlineStyle }
export const clearHtml = (html, config = {}) => {
  const dom = document.createElement('div');
  dom.innerHTML = html;

  // clear anchor;
  const anchors = dom.querySelectorAll('a');
  Array.prototype.forEach.call(anchors, (anchor) => {
    const span = document.createElement('span');
    span.innerHTML = anchor.innerHTML;
    anchor.replaceWith(span);
  });

  // clear image;
  const images = dom.querySelectorAll('img');
  Array.prototype.forEach.call(images, (image) => {
    const node = getImageRoot(image);
    // is inline image
    if (image === node && image.alt) {
      const textNode = document.createTextNode(image.alt);
      node.replaceWith(textNode);
    } else {
      node.parentNode.removeChild(node);
    }
  });

  // clear title tags
  const headers = dom.querySelectorAll('h1,h2,h3,h4,h5,h6');
  Array.prototype.forEach.call(headers, (header) => {
    // textContent for jsDom test.
    // eslint-disable-next-line
    header.innerHTML = header.innerText || header.textContent;
  });

  if (config.clearInlineStyle) {
    const spans = dom.querySelectorAll('span');
    Array.prototype.forEach.call(spans, (el) => {
      // eslint-disable-next-line
      el.style.fontStyle = 'normal';
      // eslint-disable-next-line
      el.style.fontWeight = 'normal';
    });
    const inlines = dom.querySelectorAll('em,strong,code');
    Array.prototype.forEach.call(inlines, (el) => {
      const span = document.createElement('span');
      span.innerHTML = el.innerHTML;
      el.replaceWith(span);
    });
  }

  const codeLines = dom.querySelectorAll(':scope > .line');
  if (codeLines.length) {
    let wrap = document.createElement('pre');
    const shadow = document.createElement('div');
    while (dom.firstElementChild) {
      const child = dom.firstElementChild;
      if (child.classList.contains('line')) {
        wrap.appendChild(child);
      } else {
        if (wrap.children.length) {
          shadow.appendChild(wrap);
          wrap = document.createElement('pre');
        }
        shadow.appendChild(child);
      }
    }
    if (wrap.children.length) {
      shadow.appendChild(wrap);
    }
    return shadow.innerHTML;
  }

  const childSpans = dom.querySelectorAll(':scope > span');
  if (childSpans.length) {
    let wrap = document.createElement('div');
    const shadow = document.createElement('div');
    while (dom.firstElementChild) {
      const child = dom.firstElementChild;
      if (child.tagName === 'SPAN') {
        child.innerHTML = child.innerText.split('\n').join('<br />');
        if (config.blockQuote) {
          child.style.fontStyle = '';
        }
        wrap.appendChild(child);
      } else {
        if (wrap.children.length) {
          shadow.appendChild(wrap);
          wrap = document.createElement('div');
        }
        shadow.appendChild(child);
      }
    }
    if (wrap.children.length) {
      shadow.appendChild(wrap);
    }
    return shadow.innerHTML;
  }

  return dom.innerHTML;
};

export const handlePastedText = (editorState, onChange, text, html) => {
  if (html) {
    const contentState = editorState.getCurrentContent();
    const selection = editorState.getSelection();
    const currentBlock = contentState.getBlockForKey(selection.getStartKey());
    const htmlFragment = DraftPasteProcessor.processHTML(
      clearHtml(html, {
        blockQuote: currentBlock.getType() === BLOCK_TYPE.BLOCKQUOTE,
        codeBlock: currentBlock.getType() === BLOCK_TYPE.CODE_BLOCK,
      }),
      DefaultDraftBlockRenderMap,
    );
    if (htmlFragment) {
      const { contentBlocks, entityMap } = htmlFragment;
      if (contentBlocks) {
        const htmlMap = BlockMapBuilder.createFromArray(contentBlocks);
        const textInsertd = Modifier.replaceWithFragment(
          editorState.getCurrentContent(),
          editorState.getSelection(),
          htmlMap,
        );
        const newEditorState = EditorState.push(
          editorState,
          textInsertd.set('entityMap', entityMap),
          'insert-fragment',
        );

        onChange(newEditorState);
        return 'handled';
      }
    }
  }
  return 'not-handled';
};

export const clearContent = (editorState) => {
  let contentState = editorState.getCurrentContent();
  const firstBlock = contentState.getFirstBlock();
  const lastBlock = contentState.getLastBlock();

  const allSelected = new SelectionState({
    anchorKey: firstBlock.getKey(),
    anchorOffset: 0,
    focusKey: lastBlock.getKey(),
    focusOffset: lastBlock.getLength(),
    hasFocus: true,
  });
  contentState = Modifier.removeRange(contentState, allSelected, 'backward');
  const reset = EditorState.push(editorState, contentState, 'remove-range');
  return EditorState.forceSelection(reset, contentState.getSelectionAfter());
};
