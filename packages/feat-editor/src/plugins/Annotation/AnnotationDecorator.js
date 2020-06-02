import { CompositeDecorator } from '@feat/draft-js';

import getEntityTypeStrategy from '../../utils/getEntityTypeStrategy';
import Annotation from './components/Annotation';

import {
  ANNOTATION_ADD,
  ANNOTATION_DELETE,
  ANNOTATION_STYLE,
} from './constants';

class AnnotationDecorator extends CompositeDecorator {
  constructor() {
    super([
      {
        strategy: getEntityTypeStrategy(ANNOTATION_DELETE),
        component: Annotation,
      },
      {
        strategy: getEntityTypeStrategy(ANNOTATION_ADD),
        component: Annotation,
      },
      {
        strategy: getEntityTypeStrategy(ANNOTATION_STYLE),
        component: Annotation,
      },
    ]);
  }
}

export default AnnotationDecorator;
