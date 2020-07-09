import uniq from 'lodash/uniq';
import uniqBy from 'lodash/uniqBy';
import update from 'immutability-helper';

import {
  REWORDING_STATUS_PENDING,
  REWORDING_STATUS_REJECTED,
  IS_SELECTED_FLAG,
  IS_NOT_SELECTED_FLAG,
  ACTION_COMMIT_REWORDING,
  ACTION_SUBMIT_REWORDING,
  ACTION_ELECT_REWORDING,
  ACTION_REJECT_REWORDING,
  ACTION_UPDATE_REWORDING,
  ACTION_SUBMIT_BLOCK,
  ACTION_COMMIT_BLOCK,
  ACTION_ELECT_BLOCK,
  ACTION_REJECT_BLOCK,
  ACTION_REMOVE_BLOCK,
} from '../constants';

// eslint-disable-next-line
function _commitRewording(rewordings, rewording) {
  const updated = rewordings.map((item) => {
    if (item.is_selected === IS_SELECTED_FLAG) {
      return {
        ...item,
        is_selected: IS_NOT_SELECTED_FLAG,
      };
    }
    if (item.status === REWORDING_STATUS_PENDING) {
      return {
        ...item,
        status: REWORDING_STATUS_REJECTED,
      };
    }
    return item;
  });
  updated.push(rewording);
  return updated;
}

function commitRewording(dimzou, payload, meta) {
  let updated;
  let key;
  switch (payload.structure) {
    case 'title':
      key = 'title';
      updated = {
        ...dimzou.title,
        rewordings: _commitRewording(
          dimzou.title.rewordings,
          payload.rewording,
        ),
      };
      break;
    case 'summary':
      key = 'summary';
      updated = {
        ...dimzou.summary,
        rewordings: _commitRewording(
          dimzou.summary.rewordings,
          payload.rewording,
        ),
      };
      break;
    case 'cover':
      key = 'cover';
      updated = {
        ...dimzou.cover,
        rewordings: _commitRewording(
          dimzou.cover.rewordings,
          payload.rewording,
        ),
      };
      break;
    case 'content':
      key = 'content';
      updated = dimzou.content.map((block) => {
        const rewordingProcessed =
          block.id === payload.block_id
            ? {
              ...block,
              rewordings: _commitRewording(
                block.rewordings,
                payload.rewording,
              ),
            }
            : block;
        if (meta.block && meta.block[block.id]) {
          return {
            ...rewordingProcessed,
            ...meta.block[block.id],
          };
        }
        return rewordingProcessed;
      });
      break;
    default:
      logging.warn('Unknown structure: ', payload.structure);
      return dimzou;
  }
  const updatedDimzou = {
    ...dimzou,
    [key]: updated,
  };
  // if (payload.newCollaborator) {
  //   updatedDimzou.collaborators = [
  //     ...dimzou.collaborators,
  //     payload.newCollaborator,
  //   ];
  // }

  return updatedDimzou;
}

// eslint-disable-next-line
function _submitRewording(rewordings, rewording) {
  return uniq([...rewordings, rewording]);
}

function submitRewording(dimzou, payload, meta) {
  let updated;
  let key;
  switch (payload.structure) {
    case 'title':
      key = 'title';
      updated = {
        ...dimzou.title,
        rewordings: _submitRewording(
          dimzou.title.rewordings,
          payload.rewording,
        ),
      };
      break;
    case 'cover':
      key = 'cover';
      updated = {
        ...dimzou.cover,
        rewordings: _submitRewording(
          dimzou.cover.rewordings,
          payload.rewording,
        ),
      };
      break;
    case 'summary':
      key = 'summary';
      updated = {
        ...dimzou.summary,
        rewordings: _submitRewording(
          dimzou.summary.rewordings,
          payload.rewording,
        ),
      };
      break;
    case 'content':
      key = 'content';
      updated = dimzou.content.map((block) => {
        const rewordingProcessed =
          block.id === payload.block_id
            ? {
              ...block,
              rewordings: _submitRewording(
                block.rewordings,
                payload.rewording,
              ),
            }
            : block;
        if (meta.block && meta.block[block.id]) {
          return {
            ...rewordingProcessed,
            ...meta.block[block.id],
          };
        }
        return rewordingProcessed;
      });
      break;
    default:
      logging.warn('Unknown structure: ', payload.structure);
      return dimzou;
  }
  const updatedDimzou = {
    ...dimzou,
    [key]: updated,
  };

  return updatedDimzou;
}

// eslint-disable-next-line
function _rejectRewording(rewordings, rewording) {
  const updated = rewordings.map((item) => {
    if (item.id === rewording.id) {
      return rewording;
    }
    return item;
  });
  return updated;
}

function rejectRewording(dimzou, payload) {
  let updated;
  let key;
  switch (payload.structure) {
    case 'title':
      key = 'title';
      updated = {
        ...dimzou.title,
        rewordings: _rejectRewording(
          dimzou.title.rewordings,
          payload.rewording,
        ),
      };
      break;
    case 'summary':
      key = 'summary';
      updated = {
        ...dimzou.summary,
        rewordings: _rejectRewording(
          dimzou.summary.rewordings,
          payload.rewording,
        ),
      };
      break;
    case 'cover':
      key = 'cover';
      updated = {
        ...dimzou.cover,
        rewordings: _rejectRewording(
          dimzou.cover.rewordings,
          payload.rewording,
        ),
      };
      break;
    case 'content':
      key = 'content';
      updated = dimzou.content.map(
        (block) =>
          block.id === payload.block_id
            ? {
              ...block,
              rewordings: _rejectRewording(
                block.rewordings,
                payload.rewording,
              ),
            }
            : block,
      );
      break;
    default:
      logging.warn('Unknown structure: ', payload.structure);
      return dimzou;
  }
  const updatedDimzou = {
    ...dimzou,
    [key]: updated,
  };
  // if (payload.newCollaborator) {
  //   updatedDimzou.collaborators = [
  //     ...dimzou.collaborators,
  //     payload.newCollaborator,
  //   ];
  // }

  return updatedDimzou;
}

// eslint-disable-next-line
function _electRewording(rewordings, rewording) {
  const updated = rewordings.map((item) => {
    if (item.id === rewording.id) {
      return rewording;
    }
    if (item.is_selected === IS_SELECTED_FLAG) {
      return {
        ...item,
        is_selected: IS_NOT_SELECTED_FLAG,
      };
    }
    if (item.status === REWORDING_STATUS_PENDING) {
      return {
        ...item,
        status: REWORDING_STATUS_REJECTED,
      };
    }
    return item;
  });
  return updated;
}

// eslint-disable-next-line
function electRewording(dimzou, payload) {
  let updated;
  let key;
  switch (payload.structure) {
    case 'title':
      key = 'title';
      updated = {
        ...dimzou.title,
        rewordings: _electRewording(dimzou.title.rewordings, payload.rewording),
      };
      break;
    case 'summary':
      key = 'summary';
      updated = {
        ...dimzou.summary,
        rewordings: _electRewording(
          dimzou.summary.rewordings,
          payload.rewording,
        ),
      };
      break;
    case 'cover':
      key = 'cover';
      updated = {
        ...dimzou.cover,
        rewordings: _electRewording(dimzou.cover.rewordings, payload.rewording),
      };
      break;
    case 'content':
      key = 'content';
      updated = dimzou.content.map(
        (block) =>
          block.id === payload.block_id
            ? {
              ...block,
              rewordings: _electRewording(
                block.rewordings,
                payload.rewording,
              ),
            }
            : block,
      );
      break;
    default:
      logging.warn('Unknown structure: ', payload.structure);
      return dimzou;
  }
  const updatedDimzou = {
    ...dimzou,
    [key]: updated,
  };
  // if (payload.newCollaborator) {
  //   updatedDimzou.collaborators = [
  //     ...dimzou.collaborators,
  //     payload.newCollaborator,
  //   ];
  // }

  return updatedDimzou;
}

// eslint-disable-next-line
function _updateRewording(rewordings, rewording) {
  return rewordings.map((r) => {
    if (r.id === rewording.id) {
      return rewording;
    }
    return r;
  });
}

// { structure, blockId, rewording }
function updateRewording(dimzou, payload) {
  let updated;
  let key;
  switch (payload.structure) {
    case 'title':
      key = 'title';
      updated = {
        ...dimzou.title,
        rewordings: _updateRewording(
          dimzou.title.rewordings,
          payload.rewording,
        ),
      };
      break;
    case 'summary':
      key = 'summary';
      updated = {
        ...dimzou.summary,
        rewordings: _updateRewording(
          dimzou.summary.rewordings,
          payload.rewording,
        ),
      };
      break;
    case 'cover':
      key = 'cover';
      updated = {
        ...dimzou.cover,
        rewordings: _updateRewording(
          dimzou.cover.rewordings,
          payload.rewording,
        ),
      };
      break;
    case 'content':
      key = 'content';
      updated = dimzou.content.map(
        (block) =>
          block.id === payload.blockId
            ? {
              ...block,
              rewordings: _updateRewording(
                block.rewordings,
                payload.rewording,
              ),
            }
            : block,
      );
      break;
    default:
      logging.warn('Unknown structure: ', payload.structure);
      return dimzou;
  }
  const updatedDimzou = {
    ...dimzou,
    [key]: updated,
  };
  // if (payload.newCollaborator) {
  //   updatedDimzou.collaborators = [
  //     ...dimzou.collaborators,
  //     payload.newCollaborator,
  //   ];
  // }

  return updatedDimzou;
}

/**
 *
 * @param {object} dimzou [Dimzou Data]
 * @param {object} payload [payload]
 * @param {object} meta [meta info]
 */
function insertBlock(dimzou, payload, meta) {
  const { content } = dimzou;
  const { block: newBlock, last_block_id: lastBlockId } = payload;
  const { sort_map: sortMap } = meta;
  const originBlockIndex = content.findIndex((b) => b.id === newBlock.id);
  if (originBlockIndex > -1) {
    // mergeBlock;
    const originBlock = content[originBlockIndex];
    const updatedBlock = {
      ...originBlock,
      ...newBlock,
      rewordings: uniq([...originBlock.rewordings, newBlock.touched_rewording]),
    };
    delete updatedBlock.touched_rewording;
    return {
      ...dimzou,
      content: [
        ...content.slice(0, originBlockIndex),
        updatedBlock,
        ...content.slice(originBlockIndex + 1),
      ].map((b) => ({
        ...b,
        sort: sortMap[b.id],
      })),
    };
  }
  const lastBlockIndex = content.findIndex((b) => b.id === lastBlockId);
  const constructedBlock = {
    ...newBlock,
    rewordings: [newBlock.touched_rewording],
  };
  delete constructedBlock.touched_rewording;
  const updatedDimzou = {
    ...dimzou,
    content: [
      ...content.slice(0, lastBlockIndex + 1),
      constructedBlock,
      ...content.slice(lastBlockIndex + 1),
    ].map((b) => ({
      ...b,
      sort: sortMap[b.id],
    })),
  };
  // if (payload.newCollaborator) {
  //   updatedDimzou.collaborators = [
  //     ...dimzou.collaborators,
  //     payload.newCollaborator,
  //   ];
  // }
  return updatedDimzou;
}

function commitBlock(dimzou, payload, meta) {
  const { content } = dimzou;
  const { blocks, last_block_id: lastBlockId } = payload;
  const { sort_map: sortMap } = meta;
  const originBlockIndex = content.findIndex((b) => b.id === blocks[0].id);
  const lastBlockIndex = content.findIndex((b) => b.id === lastBlockId);

  const constructedBlocks = blocks.map((block, index) => {
    let updatedBlock;
    if (index === 0 && originBlockIndex > -1) {
      const originBlock = content[originBlockIndex];
      updatedBlock = {
        ...originBlock,
        ...block,
        rewordings: [
          ...originBlock.rewordings.map(
            (r) =>
              r.status === REWORDING_STATUS_PENDING
                ? { ...r, status: REWORDING_STATUS_REJECTED }
                : r,
          ),
          block.touched_rewording,
        ],
      };
    } else {
      updatedBlock = {
        ...block,
        rewordings: [block.touched_rewording],
      };
    }
    delete updatedBlock.touched_rewording;
    return updatedBlock;
  });

  return {
    ...dimzou,
    content: [
      ...content.slice(0, lastBlockIndex + 1),
      ...constructedBlocks,
      ...content.slice(
        lastBlockIndex + (originBlockIndex > -1 ? 2 : 1), // slice out origin block;
      ),
    ].map((b) => ({
      ...b,
      sort: sortMap[b.id],
    })),
  };
}

function electBlock(dimzou, payload, meta) {
  const { content } = dimzou;
  const { blocks, rewording_id: rewordingId } = payload;
  const { sort_map: sortMap } = meta;
  const originBlockIndex = content.findIndex((b) => b.id === payload.block_id);
  if (originBlockIndex === -1) {
    logging.warn('originBlock not founded');
    return dimzou;
  }
  const originBlock = content[originBlockIndex];
  const constructedBlocks = blocks.map((block, index) => {
    let updatedBlock;
    if (index === 0) {
      updatedBlock = {
        ...originBlock,
        ...block,
        rewordings: originBlock.rewordings.map((r) => {
          if (r.id === rewordingId) {
            return block.touched_rewording;
          }
          if (r.is_selected === IS_SELECTED_FLAG) {
            return {
              ...r,
              is_selected: IS_NOT_SELECTED_FLAG,
            };
          }
          if (r.status === REWORDING_STATUS_PENDING) {
            return {
              ...r,
              status: REWORDING_STATUS_REJECTED,
            };
          }
          return r;
        }),
      };
    } else {
      updatedBlock = {
        ...block,
        rewordings: [block.touched_rewording],
      };
    }
    delete updatedBlock.touched_rewording;
    return updatedBlock;
  });

  return {
    ...dimzou,
    content: [
      ...content.slice(0, originBlockIndex),
      ...constructedBlocks,
      ...content.slice(originBlockIndex + 1),
    ].map((b) => ({
      ...b,
      sort: sortMap[b.id],
    })),
  };
}

function rejectBlock(dimzou, payload) {
  const { content } = dimzou;
  const { block_id: blockId, rewording_id: rewordingId } = payload;
  const originBlockIndex = content.findIndex((b) => b.id === blockId);
  if (originBlockIndex === -1) {
    logging.warn('originBlock not founded');
    return dimzou;
  }
  const originBlock = content[originBlockIndex];
  const updatedRewordings = originBlock.rewordings.map((r) => {
    if (r.id === rewordingId) {
      return payload.block.touched_rewording;
    }
    return r;
  });
  const updatedBlock = {
    ...originBlock,
    ...payload.block,
    rewordings: updatedRewordings,
  };
  delete updatedBlock.touched_rewording;
  return {
    ...dimzou,
    content: [
      ...content.slice(0, originBlockIndex),
      updatedBlock,
      ...content.slice(originBlockIndex + 1),
    ],
  };
}

function removeBlock(dimzou, payload) {
  const { content } = dimzou;
  const originBlockIndex = content.findIndex((b) => b.id === payload.block_id);
  const originBlock = content[originBlockIndex];
  const updatedBlock = {
    ...originBlock,
    ...payload.block,
  };
  return {
    ...dimzou,
    content: [
      ...content.slice(0, originBlockIndex),
      updatedBlock,
      ...content.slice(originBlockIndex + 1),
    ],
  };
}

function patchLike(dimzou) {
  return dimzou;
}

export function dimzouTransformer(dimzou, patch) {
  let newDimzou = dimzou;
  switch (patch.method) {
    case ACTION_SUBMIT_REWORDING:
      newDimzou = submitRewording(dimzou, patch.payload, patch.meta);
      break;
    case ACTION_COMMIT_REWORDING:
      newDimzou = commitRewording(dimzou, patch.payload, patch.meta);
      break;
    case ACTION_REJECT_REWORDING:
      newDimzou = rejectRewording(dimzou, patch.payload, patch.meta);
      break;
    case ACTION_ELECT_REWORDING:
      newDimzou = electRewording(dimzou, patch.payload, patch.meta);
      break;
    case ACTION_UPDATE_REWORDING:
      newDimzou = updateRewording(dimzou, patch.payload, patch.meta);
      break;
    case ACTION_SUBMIT_BLOCK:
      newDimzou = insertBlock(dimzou, patch.payload, patch.meta);
      break;
    case ACTION_COMMIT_BLOCK:
      newDimzou = commitBlock(dimzou, patch.payload, patch.meta);
      break;
    case ACTION_ELECT_BLOCK:
      newDimzou = electBlock(dimzou, patch.payload, patch.meta);
      break;
    case ACTION_REJECT_BLOCK:
      newDimzou = rejectBlock(dimzou, patch.payload, patch.meta);
      break;
    case ACTION_REMOVE_BLOCK:
      newDimzou = removeBlock(dimzou, patch.payload, patch.meta);
      break;
    default:
  }

  if (
    (patch.payload && patch.payload.rewording_like) ||
    patch.payload.rewording_likes
  ) {
    return patchLike(newDimzou, patch);
  }

  return newDimzou;
}

function submitContent(node, patch, structure) {
  switch (structure) {
    case 'content':
      return update(node, {
        content: (list) => {
          const patchPivotId = patch[0].id;
          const pivotIndex = list.findIndex((n) => n.id === patchPivotId);
          const merged = uniqBy(
            [
              ...list.slice(0, pivotIndex),
              ...patch,
              ...list.slice(pivotIndex + 1),
            ],
            (r) => r.id,
          );
          if (patch.length > 1) {
            return merged.map(
              (item, i) =>
                i > pivotIndex
                  ? {
                    ...item,
                    sort: i + 1,
                  }
                  : item,
            );
          }
          return merged;
        },
      });
    case 'summary':
      return {
        ...node,
        summary: patch[0],
      };
    case 'title':
      return {
        ...node,
        title: patch[0],
      };
    case 'cover':
      return {
        ...node,
        cover: patch[0],
      };
    default:
      logging.warn('Not Handled Structure', structure);
      return node;
  }
}

function insertContent(node, patch) {
  const isArray = patch instanceof Array;
  const offset = isArray ? patch.length : 1;
  const sliceIndex = isArray ? patch[0].sort : patch.sort;
  return {
    ...node,
    content: uniqBy(
      [
        ...node.content.slice(0, sliceIndex - 1),
        ...(isArray ? patch : [patch]),
        ...node.content.slice(sliceIndex - 1).map((item) => {
          // eslint-disable-next-line
          item.sort += offset;
          return item;
        }),
      ],
      (r) => r.id,
    ),
  };
}

function removeContentBlock(node, info) {
  const removeIndex = node.content.findIndex(
    (block) => block.id === info.blockId,
  );
  if (removeIndex === -1) {
    return node;
  }
  // const block = node.content[removeIndex];
  return {
    ...node,
    node_paragraphs_count: node.node_paragraphs_count - 1,
    content: [
      ...node.content.slice(0, removeIndex),
      ...node.content.slice(removeIndex + 1).map((item) => ({
        ...item,
        sort: item.sort - 1,
      })),
    ],
  };
}

function tailingInsertContent(node, patch) {
  return {
    ...node,
    content: uniqBy([...node.content, ...patch], (r) => r.id),
  };
}

function reorderContent(node, patch) {
  const { content } = node;
  const updated = [...content];
  const [block] = updated.splice(patch.oldSort - 1, 1);
  updated.splice(patch.newSort - 1, 0, block);
  return {
    ...node,
    content: updated.map((item, index) => {
      const nextSort = index + 1;
      if (nextSort === item.sort) {
        return item;
      }
      return {
        ...item,
        sort: nextSort,
      };
    }),
  };
}

export function patchDimzouNode(node, patch, method, structure) {
  switch (method) {
    case 'submit-content':
      return submitContent(node, patch, structure);
    case 'insert-content':
      return insertContent(node, patch);
    case 'remove-content':
      return removeContentBlock(node, patch);
    case 'tailing-insert':
      return tailingInsertContent(node, patch);
    case 'reorder':
      return reorderContent(node, patch);
    case 'update-rewording':
      return updateRewording(node, patch);
    default:
      return node;
  }
}
