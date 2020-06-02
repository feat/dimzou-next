import camelCase from 'lodash/camelCase';

export default function blockStyleFn(block) {
  const blockType = block.getType();
  if (blockType === 'ordered-list-item' || blockType === 'unordered-list-item') {
    return undefined;
  }
  return `public-DraftStyleDefault-${camelCase(blockType)}`;
}
