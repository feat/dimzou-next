import Immutable from 'immutable';
import { EditorState, SelectionState, Modifier } from '@feat/draft-js';
import resetBlockWithType from '../../utils/resetBlockWithType';
import getCurrentBlock from '../../utils/getCurrentBlock';

const changeCurrentInlineStyle = (editorState, matchArr, style) => {
  const currentContent = editorState.getCurrentContent();
  const selection = editorState.getSelection();
  const key = selection.getStartKey();
  const { index } = matchArr;
  const blockMap = currentContent.getBlockMap();
  const block = blockMap.get(key);
  const currentInlineStyle = block.getInlineStyleAt(index).merge();
  const newStyle = currentInlineStyle.merge([style]);
  const focusOffset = index + matchArr[0].length;
  const wordSelection = SelectionState.createEmpty(key).merge({
    anchorOffset: index + matchArr[0].indexOf(matchArr[1]),
    focusOffset,
  });
  let newContentState = Modifier.replaceText(
    currentContent,
    wordSelection,
    matchArr[2],
    newStyle,
  );
  newContentState = Modifier.insertText(
    newContentState,
    newContentState.getSelectionAfter(),
    matchArr[4],
  );
  const newEditorState = EditorState.push(
    editorState,
    newContentState,
    'change-inline-style',
  );
  return EditorState.forceSelection(newEditorState, newContentState.getSelectionAfter());
};

const headerBlocks = [
  null,
  'header-one',
  'header-two',
  'header-three',
  'header-four',
  'header-five',
  'header-six',
];

// const inlineMatchers = {
//   BOLD: /(?:^|\s|\n|[^A-z0-9_*~`])(\*{2}|_{2})((?!\1).*?)(\1)($|\s|\n|[^A-z0-9_*~`])/g,
//   ITALIC: /(?:^|\s|\n|[^A-z0-9_*~`])(\*{1}|_{1})((?!\1).*?)(\1)($|\s|\n|[^A-z0-9_*~`])/g,
//   CODE: /(?:^|\s|\n|[^A-z0-9_*~`])(`)((?!\1).*?)(\1)($|\s|\n|[^A-z0-9_*~`])/g,
//   STRIKETHROUGH: /(?:^|\s|\n|[^A-z0-9_*~`])(~{2})((?!\1).*?)(\1)($|\s|\n|[^A-z0-9_*~`])/g,
// };
const inlineMatchers = {
  BOLD: /(\*{2}|_{2})((?!\1).*?)(\1)$/,
  ITALIC: /(\*{1}|_{1})((?!\1).*?)(\1)$/,
  CODE: /(`)((?!\1)[^`]*?)(\1)$/,
  STRIKETHROUGH: /(~{2})((?!\1)[^~]*?)(\1)$/,
};

const codeBlockReg = /^```((?!`)[\w-]*)?/;

function checkCharacterForState(char, editorState) {
  let newEditorState = handleBlockType(char, editorState);
  if (editorState === newEditorState) {
    newEditorState = handleImage(char, editorState);
  }
  if (editorState === newEditorState) {
    newEditorState = handleLink(char, editorState);
  }
  if (editorState === newEditorState) {
    newEditorState = handleInlineStyle(char, editorState);
  }
  return newEditorState;
}

function handleBeforeInput(char, editorState) {
  if (char.match(/[A-z0-9_*~`]/)) {
    return false;
  }
  const newEditorState = checkCharacterForState(char, editorState);
  if (editorState !== newEditorState) {
    return newEditorState;
  }
  return false;
}

function handleReturn(e, editorState) {
  const currentBlock = getCurrentBlock(editorState);
  const text = currentBlock.getText();
  const matchArr = text.match(codeBlockReg);
  if (matchArr) {
    e.preventDefault();
    return resetBlockWithType(editorState, 'code-block', {
      text: '',
      characterList: Immutable.List(),
      data: { language: matchArr[1] },
    });
  }
  return false;
}

function handleBlockType(char, editorState) {
  const content = editorState.getCurrentContent();
  const selection = editorState.getSelection();
  const currentBlock = content.getBlockForKey(selection.getStartKey());
  const text = currentBlock.getText();
  const position = selection.getAnchorOffset();
  const line = [text.slice(0, position), char, text.slice(position)].join('');
  const blockType = currentBlock.getType();

  let newEditorState;
  let resetSelection;

  for (let i = 1; i <= 6; i += 1) {
    if (line.indexOf(`${_sharps(i)} `) === 0) {
      newEditorState = resetBlockWithType(editorState, headerBlocks[i], {
        text: line.replace(/^#+\s/, ''),
      });
    }
  }
  let matchArr = line.match(/^[*-] (.*)$/);
  if (matchArr) {
    newEditorState = resetBlockWithType(editorState, 'unordered-list-item', { text: matchArr[1] });
  }
  matchArr = line.match(/^[\d]\. (.*)$/);
  if (matchArr) {
    newEditorState = resetBlockWithType(editorState, 'ordered-list-item', { text: matchArr[1] });
  }
  matchArr = line.match(/^> (.*)$/);
  if (matchArr && blockType !== 'blockquote') {
    console.log(matchArr[1]);
    newEditorState = resetBlockWithType(editorState, 'blockquote', { text: matchArr[1] });
  }
  // matchArr = line.match(/^\[([x ])] (.*)$/i);
  // if (matchArr && blockType === 'unordered-list-item') {
  //     return resetBlockWithType(editorState, CHECKABLE_LIST_ITEM, matchArr[2], { checked: matchArr[1] !== ' ' });
  // }

  // reset entity attachment ?
  if (newEditorState) {
    return newEditorState;
    //   const newContent = newEditorState.getCurrentContent();
    //   resetSelection = new SelectionState({
    //     anchorKey: currentBlock.getKey(),
    //     focusKey: currentBlock.getKey(),
    //     anchorOffset: 0,
    //     focusOffset: selection.getFocusOffset(),
    //   });
    //   const unlinkEntity = Modifier.applyEntity(newContent, resetSelection);
    //   const finalEditorState = EditorState.push(editorState, unlinkEntity);
    //   return EditorState.forceSelection(
    //           finalEditorState,
    //           resetSelection.merge({ focusOffset: 0 }),
    //       );
  }
  return editorState;
}

function _sharps(len) {
  let ret = '';
  while (ret.length < len) {
    ret += '#';
  }
  return ret;
}

function handleImage(char, editorState) {
  // TODO
  return editorState;
}

function handleLink(char, editorState) {
  // TODO
  return editorState;
}


function handleInlineStyle(char, editorState) {
  const contentState = editorState.getCurrentContent();
  const selection = editorState.getSelection();
  const insertedState = Modifier.replaceText(contentState, selection, char);
  const afterSelection = contentState.getSelectionAfter();
  const blockKey = afterSelection.getStartKey();
  const currentBlock = insertedState.getBlockForKey(blockKey);
  const text = currentBlock.getText().slice(0, afterSelection.getStartOffset());
  let transformedContentState = insertedState;
  let updated = false;
  Object.keys(inlineMatchers).some((key) => {
    if (currentBlock.getType() === 'code-block' && key === 'CODE') {
      return false;
    }
    const reg = inlineMatchers[key];
    const matchArr = reg.exec(text);
    if (matchArr) {
      if (currentBlock.getType().indexOf('header') === 0 && key === 'BOLD') {
        return true;
      }
      const textLength = matchArr[2].length;
      const startOffset = matchArr.index;
      const textStartOffset = startOffset + matchArr[1].length;
      const textEndOffset = textStartOffset + textLength;
      const endOffset = startOffset + matchArr[0].length;
      const rangeSelection = new SelectionState({
        anchorKey: blockKey,
        anchorOffset: textStartOffset,
        focusKey: blockKey,
        focusOffset: textEndOffset,
      });

      // apply inline style
      transformedContentState = Modifier.applyInlineStyle(transformedContentState, rangeSelection, key);
      // remove tailing chars
      transformedContentState = Modifier.removeRange(transformedContentState, rangeSelection.merge({
        anchorOffset: textEndOffset,
        focusOffset: endOffset,
      }));
      // remove beginning chars
      transformedContentState = Modifier.removeRange(transformedContentState, rangeSelection.merge({
        anchorOffset: startOffset,
        focusOffset: textStartOffset,
      }));
      // fix selection
      const finalSelection = rangeSelection.merge({
        anchorOffset: startOffset + textLength + char.length,
        focusOffset: startOffset + textLength + char.length,
        hasFocus: true,
      });
      transformedContentState = transformedContentState.merge({
        selectionBefore: selection,
        selectionAfter: finalSelection,
      });
      updated = true;
      return true;
    }
    return false;
  });
  if (updated) {
    return EditorState.push(editorState, transformedContentState, 'change-inline-style');
  }
  return editorState;

  // const key = editorState.getSelection().getStartKey();
  // const text = editorState.getCurrentContent().getBlockForKey(key).getText();
  // const line = `${text}${char}`;
  // let newEditorState = editorState;
  // Object.keys(inlineMatchers).some((k) => {
  //   const re = inlineMatchers[k];
  //   let matchArr;
  //   do {
  //     matchArr = re.exec(line);
  //     if (matchArr) {
  //       newEditorState = changeCurrentInlineStyle(newEditorState, matchArr, k);
  //     }
  //   } while (matchArr);
  //   return newEditorState !== editorState;
  // });
  // return newEditorState;
}

export default {
  handleBeforeInput,
  handleReturn,
};
