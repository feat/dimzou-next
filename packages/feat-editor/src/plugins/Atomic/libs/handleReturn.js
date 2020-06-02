import addNewBlockAt from '../../../utils/addNewBlockAt';

export default function handleReturn(e, editorState) {
  const selection = editorState.getSelection();
  return addNewBlockAt(
    editorState,
    selection.getStartKey(),
    'after',
    'unstyled',
    undefined,
    'insert-fragment',
  );
}
