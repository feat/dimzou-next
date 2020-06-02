import {
  HANDLED,
} from '../../../constants';

export default function handleReturn(editorState) {
  const contentState = editorState.getCurrentContent();
  const selection = editorState.getSelection();
  const currentBlock = contentState.getBlockForKey(selection.getStartKey());

  if (currentBlock.getData().get('isOrigin') && (
    !selection.isCollapsed() || selection.getEndOffset() < currentBlock.getLength()
  )) {
    return HANDLED;
  }
}
