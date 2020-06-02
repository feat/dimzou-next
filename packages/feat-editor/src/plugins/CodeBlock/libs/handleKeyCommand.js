import { EditorState, SelectionState } from "draft-js";

function handleKeyCommand(command, editorState) {
    const content = editorState.getCurrentContent();
    const selection = editorState.getSelection();
    const currentBlock = content.getBlockForKey(selection.getStartKey());

    switch (command) {
        case "select-all":
            const newSelection = new SelectionState({
                anchorKey: currentBlock.getKey(),
                anchorOffset: 0,
                focusKey: currentBlock.getKey(),
                focusOffset: currentBlock.getLength()
            })
            return EditorState.forceSelection(editorState, newSelection, "update-selection");
        default:

    }
    return null;
}

export default handleKeyCommand;
