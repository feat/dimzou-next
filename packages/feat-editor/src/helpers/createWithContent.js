import { EditorState } from '@feat/draft-js';
import defaultDecorators from '../model/defaultDecorators';

export default function createWithContent(content, decorator = defaultDecorators) {
  return EditorState.createWithContent(content, decorator);
}
