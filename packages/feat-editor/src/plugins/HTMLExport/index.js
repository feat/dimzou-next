import { stateToHTML } from 'draft-js-export-html';
import { ENTITY_TYPE } from '../../constants';
import config from '../../config/stateToHTMLConfig';

function getOptions(uploadManager) {
  const entityStyleFn = (entity) => {
    const entityType = entity.getType();
    const entityData = entity.getData();
    if (entityType === ENTITY_TYPE.IMAGE_UPLOADER) {
      const resourceData = uploadManager.getTask(entityData.key).data;
      if (!resourceData) {
        return {
          element: 'span',
          attributes: {
            'data-type': 'placeholder',
            'data-resource-key': entityData.key,
          },
        };
      }
      return {
        element: 'img',
        attributes: resourceData,
      };
    }
  };
  return {
    blockRenderers: config.blockRenderers,
    blockStyleFn: config.blockStyleFn,
    entityStyleFn,
  };
}

export default function (content, uploadManager) {
  const options = getOptions(uploadManager);
  return stateToHTML(content, options);
}
