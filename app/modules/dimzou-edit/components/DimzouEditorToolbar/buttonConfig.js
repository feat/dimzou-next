import React from 'react';
// import { BLOCK_TYPE } from "@feat/feat-editor";

import { BLOCK_TYPE, INLINE_STYLE } from '@feat/feat-editor/lib/constants';

import Icon from '../Icon';

export const H1 = {
  label: 'H1',
  style: BLOCK_TYPE.H1,
};

export const H2 = {
  label: 'Subtitle',
  style: BLOCK_TYPE.H2,
  icon: <Icon name="heading" />,
};

export const H3 = {
  label: 'H3',
  style: BLOCK_TYPE.H3,
};

export const H4 = {
  label: 'H4',
  style: BLOCK_TYPE.H4,
};

export const H5 = {
  label: 'H5',
  style: BLOCK_TYPE.H6,
};

export const P = {
  label: 'P',
  style: BLOCK_TYPE.PARAGRAPH,
};

export const OL = {
  label: 'Ordered List',
  style: BLOCK_TYPE.ORDERED_LIST_ITEM,
  icon: <Icon name="orderList" />,
};

export const UL = {
  label: 'Unordered List',
  style: BLOCK_TYPE.UNORDERED_LIST_ITEM,
  icon: <Icon name="unorderList" />,
};

export const BLOCKQUOTE = {
  label: 'Blockquote',
  style: BLOCK_TYPE.BLOCKQUOTE,
  icon: <Icon name="blockquote" />,
};

export const CODE_BLOCK = {
  label: 'code',
  style: BLOCK_TYPE.CODE_BLOCK,
  icon: <Icon name="textBlock" />,
};

export const BOLD = {
  label: 'B',
  style: INLINE_STYLE.BOLD,
  icon: <Icon name="bold" />,
};

// export const UNDERLINE = {
//   label: 'U',
//   style: INLINE_STYLE.UNDERLINE,
//   icon: <Icon name="underline" />,
// };

export const ITALIC = {
  label: 'I',
  style: INLINE_STYLE.ITALIC,
  icon: <Icon name="italic" />,
};

export const CODE = {
  label: 'C',
  style: INLINE_STYLE.CODE,
  icon: <Icon name="code" />,
};

export const LIGHT = {
  label: 'L',
  style: INLINE_STYLE.LIGHT,
  icon: <Icon name="light" />,
};
