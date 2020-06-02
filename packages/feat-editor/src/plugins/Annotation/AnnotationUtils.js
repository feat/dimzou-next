import { List, OrderedSet } from 'immutable';
import { Modifier } from '@feat/draft-js';
import modifyBlockForContentState from '@feat/draft-js/lib/modifyBlockForContentState';

import { ANNOTATION_DELETE, ANNOTATION_STYLE, ANNOTATION_ADD } from './constants';

import { BLOCK_TYPE } from '../../constants';

import getEntitiesInSelection from '../../utils/getEntitiesInSelection';
import getEntityBeforeSelection from '../../utils/getEntityBeforeSelection';
import getEntityAfterSelection from '../../utils/getEntityAfterSelection';
import getEntityRangeInBlock from '../../utils/getEntityRangeInBlock';

const encodeStyleList = (styleList) => {
  const elements = styleList.reduce((a, b) => {
    const last = a[a.length - 1];
    const code = JSON.stringify(b);
    if (last && last[0] === code) {
      last[1] += 1;
    } else {
      a.push([code, 1]);
    }
    return a;
  }, []);
  return elements.map(([code, count]) => `${code}:${count}`).join(';');
};

// '["BOLD","ITALIC"]:3;["BOLD"]:1';
const decodeStyleList = encodedString => encodedString.split(';').map((item) => {
  const [code, count] = item.split(':');
  const arr = new Array(parseInt(count, 10));
  const style = OrderedSet(JSON.parse(code));
  arr.fill(style);
  return arr;
}).reduce((a, b) => a.concat(List(b)), List());

export const isInsideASingleBlock = targetRange =>
  targetRange.getStartKey() === targetRange.getEndKey();

export function isCoveringDeleteAnnotation(contentState, targetRange, entities) {
  const currentBlock = contentState.getBlockForKey(targetRange.getStartKey());
  return entities.every((key) => {
    const range = getEntityRangeInBlock(currentBlock, key);
    return targetRange.getStartOffset() <= range[0] && targetRange.getEndOffset() >= range[1];
  });
}

export const isInsideEntityType = (contentState, targetRange, entityType) => {
  const contentBlock = contentState.getBlockForKey(targetRange.getStartKey());
  if (targetRange.isCollapsed()) {
    const beforeRangeEntity = getEntityBeforeSelection(contentState, targetRange);
    const afterRangeEntity = getEntityAfterSelection(contentState, targetRange);
    // TODO edge case handle;
    return (
      beforeRangeEntity &&
      afterRangeEntity &&
      beforeRangeEntity === afterRangeEntity &&
      contentState.getEntity(afterRangeEntity).getType() === entityType
    );
  }
  const entitiesInRange = getEntitiesInSelection(contentState, targetRange);
  if (entitiesInRange.length !== 1) {
    return false;
  }
  if (contentState.getEntity(entitiesInRange[0]).getType() !== entityType) {
    return false;
  }
  const entityRange = getEntityRangeInBlock(contentBlock, entitiesInRange[0]);
  return (
    targetRange.getStartOffset() >= entityRange[0] && targetRange.getEndOffset() <= entityRange[1]
  );
};

export const isAllDeleteAnnotation = (contentState, entityKeys) =>
  entityKeys.every(key => contentState.getEntity(key).getType() === ANNOTATION_DELETE);

export const applyDeleteAnnotation = (contentState, targetRange) => {
  let operateEntityKey;
  let cleanedText = '';
  let removeRange;
  let newContentState;

  const currentBlock = contentState.getBlockForKey(targetRange.getStartKey());
  const inRangeEntities = getEntitiesInSelection(contentState, targetRange);

  const SHOULD_ACTUAL_DELETE = '__ACTUAL_DELETE__';
  const MARK_AS_DELETE = '__MARK_AS_DELETE__';
  const charList = currentBlock.getCharacterList();
  const blockText = currentBlock.getText();
  const targetChars = charList.slice(targetRange.getStartOffset(), targetRange.getEndOffset());

  const inRangeDeleteEntity = inRangeEntities.find((key) => {
    const entity = contentState.getEntity(key);
    return entity && entity.get('type') === ANNOTATION_DELETE;
  });

  const marked = targetChars.map((char) => {
    const entityKey = char.get('entity');
    if (
      entityKey &&
      contentState.getEntity(entityKey) &&
      contentState.getEntity(entityKey).get('type') === ANNOTATION_ADD
    ) {
      return char.set('entity', SHOULD_ACTUAL_DELETE);
    }
    return char.set('entity', MARK_AS_DELETE);
  });

  const markedCharList = charList
    .slice(0, targetRange.getStartOffset())
    .concat(marked)
    .concat(charList.slice(targetRange.getEndOffset()));

  const removedCharList = markedCharList.filter((char, index) => {
    if (char.get('entity') !== SHOULD_ACTUAL_DELETE) {
      cleanedText += blockText[index];
      return true;
    }
    return false;
  });

  const annotationAddCleanedBlock = currentBlock
    .set('characterList', removedCharList)
    .set('text', cleanedText);
  annotationAddCleanedBlock.findEntityRanges(
    char => char.get('entity') === MARK_AS_DELETE,
    (start, end) => {
      removeRange = [start, end];
    },
  );

  newContentState = contentState.set(
    'blockMap',
    contentState.getBlockMap().set(currentBlock.get('key'), annotationAddCleanedBlock),
  );
  if (!removeRange) {
    newContentState.set(
      'selectionAfter',
      targetRange.merge({
        anchorOffset: targetRange.getStartOffset(),
        focusOffset: targetRange.getStartOffset(),
        isBackward: false,
      }),
    );
    return newContentState;
  }

  operateEntityKey = inRangeDeleteEntity;
  const beforeRangeEntity =
    removeRange[0] > 0 && annotationAddCleanedBlock.getEntityAt(removeRange[0] - 1);
  const afterRangeEntity = annotationAddCleanedBlock.getEntityAt(removeRange[1]);
  if (
    beforeRangeEntity &&
    newContentState.getEntity(beforeRangeEntity).get('type') === ANNOTATION_DELETE
  ) {
    operateEntityKey = operateEntityKey || beforeRangeEntity;
    const beforeRangeEntityRange = getEntityRangeInBlock(currentBlock, beforeRangeEntity);
    removeRange = [beforeRangeEntityRange[0], removeRange[1]];
  }
  if (
    afterRangeEntity &&
    newContentState.getEntity(afterRangeEntity).get('type') === ANNOTATION_DELETE
  ) {
    operateEntityKey = operateEntityKey || afterRangeEntity;
    const afterRangeEntityRange = getEntityRangeInBlock(currentBlock, afterRangeEntity);
    removeRange = [removeRange[0], afterRangeEntityRange[1]];
  }
  if (!operateEntityKey) {
    newContentState = newContentState.createEntity(ANNOTATION_DELETE, 'IMMUTABLE');
    operateEntityKey = newContentState.getLastCreatedEntityKey();
  } else {
    newContentState = newContentState.mergeEntityData(operateEntityKey, {
      time: Date.now(),
    });
  }
  newContentState = Modifier.applyEntity(
    newContentState,
    targetRange.merge({
      anchorOffset: removeRange[0],
      focusOffset: removeRange[1],
      isBackward: false,
    }),
    operateEntityKey,
  );
  return newContentState;
};

export const isAllStyleAnnotation = (contentState, inRangeEntities) =>
  inRangeEntities.every(key => contentState.getEntity(key).getType() === ANNOTATION_STYLE);

export const applyStyleAnnotation = (contentState, targetRange) => {
  const currentBlock = contentState.getBlockForKey(targetRange.getStartKey());
  const inRangeEntities = getEntitiesInSelection(contentState, targetRange);
  const beforeRangeEntity = getEntityBeforeSelection(contentState, targetRange);
  const afterRangeEntity = getEntityAfterSelection(contentState, targetRange);

  let operateEntityKey;
  let maxRange;

  if (inRangeEntities.length) {
    if (isAllStyleAnnotation(contentState, inRangeEntities)) {
      operateEntityKey = inRangeEntities[0];
      const ranges = [];
      inRangeEntities.forEach((key) => {
        ranges.push(getEntityRangeInBlock(currentBlock, key));
      });
      maxRange = ranges.reduce((a, b) => [Math.min(a[0], b[0]), Math.max(a[1], b[1])], [
        targetRange.getStartOffset(),
        targetRange.getEndOffset(),
      ]);
    } else {
      return contentState;
    }

    targetRange = targetRange.merge({
      anchorOffset: maxRange[0],
      focusOffset: maxRange[1],
      isBackward: false,
    });
  }

  // try to merge entity
  //
  if (afterRangeEntity && contentState.getEntity(afterRangeEntity).getType() === ANNOTATION_DELETE) {
    operateEntityKey = afterRangeEntity;
    const afterRangeEntityRange = getEntityRangeInBlock(currentBlock, afterRangeEntity);
    targetRange = targetRange.merge({
      anchorOffset: Math.min(targetRange.getStartOffset(), afterRangeEntityRange[0]),
      focusOffset: Math.max(targetRange.getEndOffset(), afterRangeEntityRange[1]),
      isBackward: false,
    });
  }
  if (beforeRangeEntity && contentState.getEntity(beforeRangeEntity).getType() === ANNOTATION_DELETE) {
    operateEntityKey = beforeRangeEntity;
    const beforeRangeEntityRange = getEntityRangeInBlock(currentBlock, beforeRangeEntity);
    targetRange = targetRange.merge({
      anchorOffset: Math.min(targetRange.getStartOffset(), beforeRangeEntityRange[0]),
      focusOffset: Math.max(targetRange.getEndOffset(), beforeRangeEntityRange[1]),
      isBackward: false,
    });
  }
  let inRangeCharsStyle;
  if (!operateEntityKey) {
    inRangeCharsStyle = currentBlock
      .getCharacterList()
      .toKeyedSeq()
      .skipUntil((c, i) => i === targetRange.getStartOffset())
      .takeUntil((c, i) => i === targetRange.getEndOffset())
      .map(c => c.getStyle())
      .toList();
    contentState = contentState.createEntity(ANNOTATION_STYLE, 'IMMUTABLE', {
      initStyle: encodeStyleList(inRangeCharsStyle),
    });
    operateEntityKey = contentState.getLastCreatedEntityKey();
  } else {
    // get inRangeCharsStyle;
    let entityOffset = 0;
    inRangeCharsStyle = currentBlock
      .getCharacterList()
      .toKeyedSeq()
      .skipUntil((c, i) => i === targetRange.getStartOffset())
      .takeUntil((c, i) => i === targetRange.getEndOffset())
      .map((c) => {
        const entityKey = c.getEntity();
        const entity = entityKey && contentState.getEntity(entityKey);
        if (entity) {
          const styleList = decodeStyleList(entity.getData().initStyle);
          return styleList.get(entityOffset++);
        }
        entityOffset = 0;
        return c.getStyle();
      })
      .toList();

    contentState = contentState.mergeEntityData(operateEntityKey, {
      initStyle: inRangeCharsStyle,
    });
  }

  contentState = Modifier.applyEntity(contentState, targetRange, operateEntityKey);
  return contentState;
};

export const updateStyleAnnotation = (contentState, targetRange) => {
  // console.log('updateStyleAnnotation');
  const currentBlock = contentState.getBlockForKey(targetRange.getStartKey());
  const entityMap = contentState.getEntityMap();
  const rangeStart = targetRange.getStartOffset();
  const rangeEnd = targetRange.getEndOffset();
  const entityKey = currentBlock.getEntityAt(rangeStart);
  let inRangeCharsStyle;
  if (entityKey) {
    // getMap and diff;
    inRangeCharsStyle = currentBlock
      .getCharacterList()
      .toKeyedSeq()
      .filter(c => c.getEntity() == entityKey)
      .map(c => c.getStyle())
      .toList();
    const encoded = encodeStyleList(inRangeCharsStyle);
    const originCharsStyle = contentState.getEntity(entityKey).getData().initStyle;
    if (encoded === originCharsStyle) {
      // console.log('clear style annotation');
      const entityRange = getEntityRangeInBlock(currentBlock, entityKey);
      return Modifier.applyEntity(
        contentState,
        targetRange.merge({
          anchorOffset: entityRange[0],
          focusOffset: entityRange[1],
          isBackward: false,
        }),
        null,
      );
    }
    return contentState;
  }
  return contentState;
};

export const toggleBlockType = (contentState, selection, blockType) => {
  const startKey = selection.getStartKey();
  let endKey = selection.getEndKey();
  let target = selection;

  // Triple-click can lead to a selection that includes offset 0 of the
  // following block. The `SelectionState` for this case is accurate, but
  // we should avoid toggling block type for the trailing block because it
  // is a confusing interaction.
  if (startKey !== endKey && selection.getEndOffset() === 0) {
    const blockBefore = contentState.getBlockBefore(endKey);
    endKey = blockBefore.getKey();
    target = target.merge({
      anchorKey: startKey,
      anchorOffset: selection.getStartOffset(),
      focusKey: endKey,
      focusOffset: blockBefore.getLength(),
      isBackward: false,
    });
  }

  const blockMap = contentState.getBlockMap();
  const inRangeBlocks = blockMap
    .skipWhile((_, k) => k !== startKey)
    .reverse()
    .skipWhile((_, k) => k !== endKey);

  const hasAtomicBlock = inRangeBlocks
    .some(v => v.getType() === BLOCK_TYPE.ATOMIC);

  if (hasAtomicBlock) {
    return contentState;
  }

  const newContentState = modifyBlockForContentState(contentState, target, (block) => {
    const typeToSet = block.getType() === blockType ? BLOCK_TYPE.PARAGRAPH : blockType;
    const blockData = {};

    blockData.newBlockType = typeToSet;

    if (!block.getData().get('originBlockType')) {
      blockData.originBlockType = block.getType();
    }
    return block.merge({
      type: typeToSet,
      depth: 0,
      data: block.getData().merge(blockData),
    });
  });
  return newContentState;
};
