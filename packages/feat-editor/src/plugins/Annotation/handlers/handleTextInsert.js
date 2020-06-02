import { Modifier, EditorState } from '@feat/draft-js';

import {
  isInsideASingleBlock,
  isInsideEntityType,
  isCoveringDeleteAnnotation,
  applyDeleteAnnotation,
} from '../AnnotationUtils';

import getEntitiesInRange from '../../../utils/getEntitiesInSelection';
import getEntityBeforeRange from '../../../utils/getEntityBeforeSelection';
import getEntityAfterRange from '../../../utils/getEntityAfterSelection';

import { ANNOTATION_ADD, ANNOTATION_DELETE } from '../constants';

import { HANDLED } from '../../../constants';
import getEntityRangeInBlock from '../../../utils/getEntityRangeInBlock';

const rightTextMap = {
  '“': '”',
  '‘': '’',
};

export default function handleTextInsert(editorState, onChange, text) {
  let contentState = editorState.getCurrentContent();
  let selection = editorState.getSelection();
  const currentInlineStyle = editorState.getCurrentInlineStyle();

  if (!isInsideASingleBlock(selection)) {
    return HANDLED;
  }

  const currentBlock = contentState.getBlockForKey(selection.getStartKey());
  let targetRange,
    newState,
    rightText,
    shouldReplaceText;

  const inRangeEntities = getEntitiesInRange(contentState, selection);
  const beforeRangeEntity = getEntityBeforeRange(contentState, selection);
  const afterRangeEntity = getEntityAfterRange(contentState, selection);
  let operateEntityKey;
  // TODO applyAddAnnotation()
  if (inRangeEntities.length === 1 && isInsideEntityType(contentState, selection, ANNOTATION_ADD)) {
    operateEntityKey = inRangeEntities[0];
    contentState = Modifier.removeRange(contentState, selection);
    selection = contentState.getSelectionAfter();
  } else if (selection.isCollapsed()) {
    if (
      beforeRangeEntity &&
      contentState.getEntity(beforeRangeEntity).getType() === ANNOTATION_ADD
    ) {
      operateEntityKey = beforeRangeEntity;
    } else if (
      afterRangeEntity &&
      contentState.getEntity(afterRangeEntity).getType() === ANNOTATION_ADD
    ) {
      operateEntityKey = afterRangeEntity;
    } else if (isInsideEntityType(contentState, selection, ANNOTATION_DELETE)) {
      return HANDLED;
    } else {
      contentState = contentState.createEntity(ANNOTATION_ADD, 'MUTABLE');
      operateEntityKey = contentState.getLastCreatedEntityKey();
    }
  } else if (
    !selection.isCollapsed() &&
    isCoveringDeleteAnnotation(contentState, selection, inRangeEntities)
  ) {
    contentState = applyDeleteAnnotation(contentState, selection);
    selection = selection.merge({
      anchorOffset: selection.getEndOffset(),
      focusOffset: selection.getEndOffset(),
      isBackward: false,
    });
    contentState = contentState.createEntity(ANNOTATION_ADD, 'MUTABLE');
    operateEntityKey = contentState.getLastCreatedEntityKey();
  } else {
    return HANDLED;
  }

  if (text === '“' || text === '‘') {
    rightText = rightTextMap[text];
    const entityRange = getEntityRangeInBlock(currentBlock, operateEntityKey);
    const enitytTextBefore = entityRange
      ? currentBlock.getText().slice(entityRange[0], selection.getStartOffset())
      : '';
    const entityTextAfter = entityRange
      ? currentBlock.getText().slice(selection.getStartOffset(), entityRange[1])
      : '';
    const beforeLeftQuoteCount = enitytTextBefore.split(text).length - 1;
    const beforeRightQuoteCount = enitytTextBefore.split(rightText).length - 1;
    const beforeDelta = beforeLeftQuoteCount - beforeRightQuoteCount;
    const afterLeftQuoteCount = entityTextAfter.split(text).length - 1;
    const afterRightQuoteCount = entityTextAfter.split(rightText).length - 1;
    const afterDelta = afterRightQuoteCount - afterLeftQuoteCount;
    if (beforeDelta > afterDelta) {
      shouldReplaceText = true;
    }
  }

  // contentState = contentState.mergeEntityData(operateEntityKey, { time: Date.now() });
  contentState = Modifier.insertText(
    contentState,
    selection,
    shouldReplaceText ? rightText : text,
    currentInlineStyle,
    operateEntityKey,
  );
  newState = EditorState.push(editorState, contentState);
  onChange(newState);
  return HANDLED;
}
