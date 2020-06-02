import { stateFromHTML } from 'draft-js-import-html';

import defaultConfig from '../config/stateFromHTMLConfig';

export default function (html, options = defaultConfig) {
  return stateFromHTML(html, options);
}
