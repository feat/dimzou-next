import { EditorState } from 'draft-js';
import { Map } from 'immutable';

export default function updateDataOfBlock(editorState, block, newData) {
  const content = editorState.getCurrentContent();
  const newBlock = block.merge({
    data: block.getData().merge(newData),
  });
  const newContent = content.merge({
    blockMap: content.getBlockMap().set(block.getKey(), newBlock),
  });
  return EditorState.push(editorState, newContent, 'change-block-data');
}
