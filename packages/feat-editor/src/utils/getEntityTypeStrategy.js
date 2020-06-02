export default function getTypeStrategy(type) {
  return function (contentBlock, callback, contentState) {
    contentBlock.findEntityRanges((character) => {
      const entityKey = character.getEntity();
      if (!entityKey) return false;
      return contentState.getEntity(entityKey).getType() === type;
    }, callback);
  };
}
