import { EditorState } from '@feat/draft-js';

import defaultDecorators from '../model/defaultDecorators';

export default function (decorator = defaultDecorators) {
  return EditorState.createEmpty(decorator);
}
