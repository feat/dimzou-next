import { EditorState, convertFromRaw } from '@feat/draft-js';
import defaultDecorators from '../model/defaultDecorators';

export default function createFromRaw(data, decorator = defaultDecorators) {
  return EditorState.createWithContent(convertFromRaw(data), decorator);
}
