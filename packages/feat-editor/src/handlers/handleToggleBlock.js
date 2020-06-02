import { RichUtils, Modifier, SelectionState, EditorState, CharacterMetadata, ContentBlock } from 'draft-js';
import generateRandomKey from 'draft-js/lib/generateRandomKey';
import { OrderedMap, Map } from 'immutable';

import isRangeOfBlockType from '../utils/isRangeOfBlockType';

import {
  BLOCK_TYPE, INLINE_STYLE,
} from '../constants';

export default function handleToggleBlockType(editorState, onChange, blockType) {
  // make unstyled block code block;
  const selection = editorState.getSelection();
  const startKey = selection.getStartKey();
  const endKey = selection.getEndKey();
  let newEditorState;
  if ((
    blockType === BLOCK_TYPE.CODE_BLOCK ||
    blockType === BLOCK_TYPE.BLOCKQUOTE
  )) {
    let contentState = editorState.getCurrentContent();

    if (!isRangeOfBlockType(contentState, selection, blockType)) {
      // set block type
      contentState = Modifier.setBlockType(contentState, selection, blockType);
      let afterSelection;
      if (startKey !== endKey) {
        let lastBlockKey = startKey;
        let nextBlock = contentState.getBlockForKey(startKey);
        let text = nextBlock.getText();
        let charList = nextBlock.getCharacterList();
        do {
          nextBlock = contentState.getBlockAfter(lastBlockKey);
          text += `\n${nextBlock.getText()}`;
          charList = charList.concat([CharacterMetadata.create()]).concat(nextBlock.getCharacterList());
          lastBlockKey = nextBlock.getKey();
        } while (lastBlockKey !== endKey);
        const mergedBlock = contentState.getBlockForKey(startKey).set('characterList', charList).set('text', text);
        const mergeBlockMap = new OrderedMap({
          startKey: mergedBlock,
        });
        const replaceRange = new SelectionState().merge({
          anchorKey: startKey,
          anchorOffset: 0,
          focusKey: endKey,
          focusOffset: nextBlock.getLength(),
        });
        contentState = Modifier.replaceWithFragment(contentState, replaceRange, mergeBlockMap);
        afterSelection = new SelectionState().merge({
          anchorKey: mergedBlock.getKey(),
          focusKey: mergedBlock.getKey(),
          anchorOffset: mergedBlock.getLength(),
          focusOffset: mergedBlock.getLength(),
        });
      }

      newEditorState = EditorState.push(editorState, contentState, 'change-block-type');
      if (afterSelection) {
        newEditorState = EditorState.forceSelection(newEditorState, afterSelection);
      }
    } else {
      const blockMap = contentState.getBlockMap();
      const selectedBlocks = blockMap.toSeq()
        .skipUntil(b => b.getKey() === startKey)
        .takeUntil(b => b.getKey() === endKey)
        .concat(Map({
          [endKey]: blockMap.get(endKey),
        }));
      const splitedBlocks = selectedBlocks.reduce((splited, block) => {
        const lines = block.getText().split('\n');
        const characterList = block.getCharacterList();
        let contacted = splited;
        let initChar = 0;
        for (let i = 0; i < lines.length; i += 1) {
          const lineKey = generateRandomKey();
          const lineBlock = new ContentBlock({
            key: lineKey,
            type: BLOCK_TYPE.UNSTYLED,
            text: lines[i],
            characterList: characterList.slice(initChar, initChar + lines[i].length),
            depth: block.getDepth(),
            data: block.getData(),
          });
          initChar += lines[i].length + 1;
          contacted = contacted.concat(Map({
            [lineKey]: lineBlock,
          }));
        }
        return contacted;
      }, new OrderedMap());

      const beginning = blockMap.takeUntil(b => b.getKey() === startKey);
      const tailing = blockMap.skipUntil(b => b.getKey() === endKey).slice(1);

      // contentState = Modifier.replaceWithFragment(contentState, replaceRange, splitedBlocks);
      const replaced = beginning.concat(splitedBlocks).concat(tailing);
      contentState = contentState.merge({
        blockMap: replaced,
        selectionBefore: selection,
        selectionAfter: selection.merge({
          anchorKey: splitedBlocks.first().getKey(),
          anchorOffset: 0,
          focusKey: splitedBlocks.last().getKey(),
          focusOffset: splitedBlocks.last().getText().length,
        }),
      });

      newEditorState = EditorState.push(editorState, contentState, 'change-block-type');
    }
  } else if (blockType.indexOf('header') === 0) {
    let contentState = editorState.getCurrentContent();
    if (!isRangeOfBlockType(contentState, selection, blockType)) {
      // set all block to block type
      contentState = Modifier.setBlockType(contentState, selection, blockType);
      const startBlock = contentState.getBlockForKey(startKey);
      const endBlock = contentState.getBlockForKey(endKey);
      const range = new SelectionState({
        anchorKey: startBlock.getKey(),
        anchorOffset: 0,
        focusKey: endBlock.getKey(),
        focusOffset: endBlock.getLength(),
      });
      // set inline style
      contentState = Modifier.removeInlineStyle(contentState, range, INLINE_STYLE.BOLD);
      contentState = contentState.merge({
        selectionAfter: selection,
      });
      newEditorState = EditorState.push(editorState, contentState, 'change-block-type');
    } else {
      contentState = Modifier.setBlockType(contentState, selection, 'unstyled');
      newEditorState = EditorState.push(editorState, contentState, 'change-block-type');
    }
  } else {
    newEditorState = RichUtils.toggleBlockType(editorState, blockType);
  }


  if (newEditorState) {
    onChange(newEditorState);
  }
}
