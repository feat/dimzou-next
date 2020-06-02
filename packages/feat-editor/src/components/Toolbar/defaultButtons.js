import {
  INLINE_STYLE,
  BLOCK_TYPE,
} from '../../constants';

export default [
  { icon: 'h2', type: 'block', value: BLOCK_TYPE.H2 },
  { icon: 'h3', type: 'block', value: BLOCK_TYPE.H3 },
  { icon: 'text', type: 'block', value: BLOCK_TYPE.UNSTYLED },
  { icon: 'ol', type: 'block', value: BLOCK_TYPE.ORDERED_LIST_ITEM },
  { icon: 'ul', type: 'block', value: BLOCK_TYPE.UNORDERED_LIST_ITEM },
  { icon: 'blockquote', type: 'block', value: BLOCK_TYPE.BLOCKQUOTE },
  { icon: 'cb', type: 'block', value: BLOCK_TYPE.CODE_BLOCK },
  // { icon: 'fx', type: 'block', value: BLOCK_TYPE.ATOMIC },
  // { icon: 'img', type: 'block', value: BLOCK_TYPE.ATOMIC },
  // { type: 'placeholder' },
  { icon: 'bold', type: 'inline', value: INLINE_STYLE.BOLD },
  { icon: 'italic', type: 'inline', value: INLINE_STYLE.ITALIC },
  { icon: 'underline', type: 'inline', value: INLINE_STYLE.UNDERLINE },
  { icon: 'code', type: 'inline', value: INLINE_STYLE.CODE },
  { icon: 'light', type: 'inline', value: INLINE_STYLE.LIGHT },
];
