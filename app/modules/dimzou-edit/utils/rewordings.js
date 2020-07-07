import { BLOCK_TYPE, ENTITY_TYPE } from '@feat/feat-editor/lib/constants';

import {
  REWORDING_STATUS_PENDING,
  REWORDING_STATUS_ACCEPTED,
  REWORDING_STATUS_REJECTED,
  IS_SELECTED_FLAG,
  NODE_STRUCTURE_TITLE,
  NODE_STRUCTURE_SUMMARY,
  NODE_STRUCTURE_CONTENT,
  NODE_STRUCTURE_COVER,
  REWORDING_WIDGET_TEXT_EDITOR,
  REWORDING_WIDGET_IMAGE,
  REWORDING_STATUS_DELETED,
  REWORDING_WIDGET_CODE_BLOCK,
} from '../constants';

import { createFromRawData, getHTML } from '../components/DimzouEditor';

export const isCurrentRecord = (record) =>
  record.is_selected === IS_SELECTED_FLAG;

export const isPendingRecord = (record) =>
  record.status === REWORDING_STATUS_PENDING;

export const isAcceptedRecord = (record) =>
  record.status === REWORDING_STATUS_ACCEPTED;

export const isRejectedRecord = (record) =>
  record.status === REWORDING_STATUS_REJECTED;

export const isDeleted = (record) => record.status === REWORDING_STATUS_DELETED;

export const isHistoricalRecord = (record) =>
  isAcceptedRecord(record) && record.is_selected !== IS_SELECTED_FLAG;

export function getCurrentVersion(records) {
  return records ? records.find((record) => isCurrentRecord(record)) : null;
}

export function getCandidateVersions(records) {
  return records ? records.filter((record) => isPendingRecord(record)) : [];
}

export function getHistoricVersions(records) {
  return records ? records.filter((record) => isHistoricalRecord(record)) : [];
}

export function getRejectVersion(records) {
  return records ? records.filter((record) => isRejectedRecord(record)) : [];
}

export function noInteration(record) {
  return !record.version_lock;
}

export function hasLockedRewording(records) {
  return records.some((r) => r.version_lock);
}

export function classifyRewordings(records) {
  let currentVersion;
  const candidateVersions = [];
  const historicVersions = [];
  const rejectedVersions = [];
  let hasLockedVersion = false;

  if (records && records.length) {
    records.forEach((record) => {
      if (record.version_lock) {
        hasLockedVersion = true;
      }
      if (isCurrentRecord(record)) {
        currentVersion = record;
      } else if (isPendingRecord(record)) {
        candidateVersions.push(record);
      } else if (isHistoricalRecord(record) || isDeleted(record)) {
        historicVersions.push(record);
      } else if (isRejectedRecord(record)) {
        rejectedVersions.push(record);
      }
    });
  }

  // const currentVersion = getCurrentVersion(records);
  // const candidateVersions = getCandidateVersions(records, currentVersion);
  // const historicVersions = getHistoricVersions(records, currentVersion);
  // const rejectedVersions = getRejectVersion(records, currentVersion);
  return {
    currentVersion,
    candidateVersions,
    historicVersions,
    rejectedVersions,
    hasLockedVersion,
  };
}

export function getUserPendingRewording(records, userId) {
  return records.find(
    (record) =>
      record.status === REWORDING_STATUS_PENDING && record.user_id === userId,
  );
}

export function fixCreatedRewording(rewording, user) {
  return {
    ...rewording,
    user,
  };
}

export function createMediaRewording(attachment) {
  // TODO check attachment type and create different rawdata;
  const rawData = {
    blocks: [
      {
        type: BLOCK_TYPE.ATOMIC,
        text: ' ',
        depth: 0,
        entityRanges: [
          {
            offset: 0,
            length: 1,
            key: 1,
          },
        ],
      },
    ],
    entityMap: {
      1: {
        type: ENTITY_TYPE.IMAGE,
        mutability: 'IMMUTABLE',
        data: {
          src: attachment.link,
          'data-id': attachment.id,
          'data-mime-type': attachment.mime_type,
        },
      },
    },
  };
  const htmlContent = getHTML(createFromRawData(rawData).getCurrentContent());
  return {
    htmlContent,
    content: rawData,
  };
}

export const getRewordType = (structure) => {
  switch (structure) {
    case 'title':
      return NODE_STRUCTURE_TITLE;
    case 'summary':
      return NODE_STRUCTURE_SUMMARY;
    case 'content':
      return NODE_STRUCTURE_CONTENT;
    case 'cover':
      return NODE_STRUCTURE_COVER;
    default:
      logging.warn('Unknown Structure', structure);
      return undefined;
  }
};

export const isCodeBlock = (rewording) => {
  if (rewording.content_meta) {
    return (
      rewording.content_meta.blocks &&
      rewording.content_meta.blocks.length === 1 &&
      rewording.content_meta.blocks[0].type === 'code-block'
    );
  }
  return /^<pre data-language="(.*)?">/.test(rewording.html_content);
};

export const getLanguage = (rewording) => {
  if (rewording.content_meta) {
    return rewording.content_meta.blocks[0].data.language;
  }
  const match = /^<pre data-language="(.*)?">/.exec(rewording.html_content);
  return match[1];
};

export function extractWidgetInfo(rewording) {
  if (rewording.img) {
    return {
      type: REWORDING_WIDGET_IMAGE,
      src: rewording.img,
    };
  }
  const imageMatch = /<figure(?:.*)?><img(?:.*)?src="(.*)?"(?:.*)><\/figure>/.exec(
    rewording.html_content,
  );
  if (imageMatch && imageMatch[1]) {
    return {
      type: REWORDING_WIDGET_IMAGE,
      src: imageMatch[1],
    };
  }

  if (isCodeBlock(rewording)) {
    return {
      type: REWORDING_WIDGET_CODE_BLOCK,
      html_content: rewording.html_content,
      content: rewording.content,
      language: getLanguage(rewording),
    };
  }

  return {
    type: REWORDING_WIDGET_TEXT_EDITOR,
    html_content: rewording.html_content,
  };
}
