import { EditorState, Modifier } from 'draft-js';

function handleTab(e, editorState) {
  if (e.shiftKey) {
    return shiftIndent(editorState);
  }
  return indent(editorState);
}

function indent(editorState) {
    // TODO detect indent;
  const content = editorState.getCurrentContent();
  const selection = editorState.getSelection();

  const newContent = Modifier.replaceText(content, selection, '  ');
  return EditorState.push(editorState, newContent, 'indent-code');
}

function shiftIndent(editorState) {
    // get lineBegin Height;
  const content = editorState.getCurrentContent();
  const selection = editorState.getSelection();
  const selectionStart = selection.getStartOffset();
  const selectionEnd = selection.getEndOffset();

  const currentBlock = content.getBlockForKey(selection.getStartKey());
  const blockText = currentBlock.getText();
  const beforeText = blockText.slice(0, selectionStart);
  const afterText = blockText.slice(selectionEnd);

    // lineBegin Index;
  const firstLineIndex = beforeText.lastIndexOf('\n');

    // TODO fix last line bug;
  const lastLineIndex = selectionEnd + afterText.indexOf('\n');
  const targetText = blockText.slice(firstLineIndex, lastLineIndex);

  const textArr = targetText.split('\n');
  const outputArr = textArr.map((lineText) => {
    if (lineText.slice(0, 2) === '  ') {
      return lineText.slice(2);
    }
    return lineText;
  });
  const outputText = outputArr.join('\n');
  const targetSelection = selection.merge({
    anchorOffset: firstLineIndex,
    focusOffset: lastLineIndex,
    isBackward: false,
  });

  const newContent = Modifier.replaceText(content, targetSelection, outputText);

    // TODO fix selection
  return EditorState.push(editorState, newContent, 'shift-indent-code');
}

export default handleTab;
