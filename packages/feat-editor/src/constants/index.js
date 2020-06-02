export const NAMESPACE = 'FeatEditor';

export const HANDLED = 'handled';
export const NOT_HANDLED = 'not-handled';

export const BLOCK_TYPE = {
  UNSTYLED: 'unstyled',
  PARAGRAPH: 'unstyled',
  ORDERED_LIST_ITEM: 'ordered-list-item',
  UNORDERED_LIST_ITEM: 'unordered-list-item',
  H1: 'header-one',
  H2: 'header-two',
  H3: 'header-three',
  H4: 'header-four',
  H5: 'header-five',
  H6: 'header-six',
  CODE_BLOCK: 'code-block',
  BLOCKQUOTE: 'blockquote',
  PULLQUOTE: 'pullquote',
  ATOMIC: 'atomic',
  BLOCKQUOTE_CAPTION: 'block-quote-caption',
  CAPTION: 'caption',
  GALLERY: 'gallery',
  TODO: 'todo',
  IMAGE: 'atomic:image',
  BREAK: 'atomic:break',
};

export const INLINE_STYLE = {
  BOLD: 'BOLD',
  CODE: 'CODE',
  ITALIC: 'ITALIC',
  STRIKETHROUGH: 'STRIKETHROUGH',
  UNDERLINE: 'UNDERLINE',
  LIGHT: 'LIGHT',
};

export const ENTITY_TYPE = {
  IMAGE: 'IMAGE',
  IMAGE_UPLOADER: 'IMAGE_UPLOADER',
  LINK: 'LINK',
};
