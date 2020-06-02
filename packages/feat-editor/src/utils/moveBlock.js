import { EditorState } from 'draft-js';

export default function moveBlock(editorState, operateBlockKey, targetBlockKey, position = 'after') {
  const i = position === 'after' ? 1 : 0;
  const content = editorState.getCurrentContent();
  const blockMap = content.getBlockMap();
  let index = 0;
  const operateBlockMap = blockMap.filter((block, key) => key === operateBlockKey);

  const slicedBlockMap = blockMap.filter((block, key) => key !== operateBlockKey);

  slicedBlockMap.find((block, key) => {
    if (key === targetBlockKey) {
      return true;
    }
    index++;
  });

  const newBlockMap = slicedBlockMap.slice(0, index + i).concat(operateBlockMap).concat(slicedBlockMap.slice(index + i));

  const newContent = content.merge({
    blockMap: newBlockMap,
  });

  return EditorState.push(editorState, newContent, 'move-block');
}
