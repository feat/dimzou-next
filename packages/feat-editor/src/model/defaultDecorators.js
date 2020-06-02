import { CompositeDecorator } from '@feat/draft-js';

import { ENTITY_TYPE } from '../constants';

import MultiDecorator from '../libs/MultiDecorator';
// import PrismDecorator from '../plugins/PrismDecorator';
import CodeLineDecorator from '../plugins/CodeLineDecorator';
import ImageUploader from '../components/ImageUploader';

import getEntityTypeStrategy from '../utils/getEntityTypeStrategy';

import Image from '../components/Image';
import Video from '../components/Video';
import Audio from '../components/Audio';

const defaultDecorators = new MultiDecorator([
  // new PrismDecorator({ defaultSyntax: 'javascript' }),
  new CodeLineDecorator(),
  new CompositeDecorator([
    {
      strategy: getEntityTypeStrategy(ENTITY_TYPE.IMAGE),
      component: Image,
    },
    {
      strategy: getEntityTypeStrategy(ENTITY_TYPE.VIDEO),
      component: Video,
    },
    {
      strategy: getEntityTypeStrategy(ENTITY_TYPE.AUDIO),
      component: Audio,
    },
    {
      strategy: getEntityTypeStrategy(ENTITY_TYPE.IMAGE_UPLOADER),
      component: ImageUploader,
    },
  ]),
]);

export default defaultDecorators;
