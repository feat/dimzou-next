import { stateToHTML } from 'draft-js-export-html';
import defaultConfig from '../config/stateToHTMLConfig';

export default function (content, options = defaultConfig) {
  return stateToHTML(content, options);
}
