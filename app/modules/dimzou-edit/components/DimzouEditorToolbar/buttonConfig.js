import React from 'react';
// import { BLOCK_TYPE } from "@feat/feat-editor";

import { BLOCK_TYPE, INLINE_STYLE } from '@feat/feat-editor/lib/constants';

import regionBlockIcon from '../../assets/icon-region-block.svg';
import subTitleIcon from '../../assets/icon-subtitle.svg';
import orderListIcon from '../../assets/icon-order-list.svg';
import unorderListIcon from '../../assets/icon-unorder-list.svg';
import boldIcon from '../../assets/icon-bold.svg';
import lightIcon from '../../assets/icon-light.svg';
import codeIcon from '../../assets/icon-code.svg';
import italicIcon from '../../assets/icon-italic.svg';
import blockquoteIcon from '../../assets/icon-blockquote.svg';

export const H1 = {
  label: 'H1',
  style: BLOCK_TYPE.H1,
};

export const H2 = {
  label: 'Subtitle',
  style: BLOCK_TYPE.H2,
  // icon: <SvgIcon icon="text-subtitle" />,
  icon: <span className='ft-SvgIcon' dangerouslySetInnerHTML={{ __html: subTitleIcon }} />,
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
  // icon: <SvgIcon icon="order-list" />,
  icon: <span className='ft-SvgIcon' dangerouslySetInnerHTML={{ __html: orderListIcon }} />,
};

export const UL = {
  label: 'Unordered List',
  style: BLOCK_TYPE.UNORDERED_LIST_ITEM,
  icon: <span className='ft-SvgIcon' dangerouslySetInnerHTML={{ __html: unorderListIcon }} />,
};

export const BLOCKQUOTE = {
  label: 'Blockquote',
  style: BLOCK_TYPE.BLOCKQUOTE,
  // icon: <SvgIcon icon="blockquote" />,
  icon: <span className='ft-SvgIcon' dangerouslySetInnerHTML={{ __html: blockquoteIcon }} />,
};

export const CODE_BLOCK = {
  label: 'code',
  style: BLOCK_TYPE.CODE_BLOCK,
  icon: <span className='ft-SvgIcon' dangerouslySetInnerHTML={{ __html: regionBlockIcon }} />,
};

export const BOLD = {
  label: 'B',
  style: INLINE_STYLE.BOLD,
  icon: <span className='ft-SvgIcon' dangerouslySetInnerHTML={{ __html: boldIcon }} />,
};

// export const UNDERLINE = {
//   label: 'U',
//   style: INLINE_STYLE.UNDERLINE,
//   icon: <SvgIcon icon="text-underline" />,
// };

export const ITALIC = {
  label: 'I',
  style: INLINE_STYLE.ITALIC,
  icon: <span className='ft-SvgIcon' dangerouslySetInnerHTML={{ __html: italicIcon }} />,
};

export const CODE = {
  label: 'C',
  style: INLINE_STYLE.CODE,
  icon: <span className='ft-SvgIcon' dangerouslySetInnerHTML={{ __html: codeIcon }} />,
}

export const LIGHT = {
  label: 'L',
  style: INLINE_STYLE.LIGHT,
  icon: <span className='ft-SvgIcon' dangerouslySetInnerHTML={{ __html: lightIcon }} />,
}
