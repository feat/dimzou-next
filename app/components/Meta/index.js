import createTemplate from '@feat/feat-ui/lib/util/createTemplate';

import './style.scss';

const Meta = createTemplate({
  Compo: 'span',
  namespace: 't',
  baseName: 'Meta',
  displayName: 'Meta',
});

export default Meta;

export const MetaSeparator = createTemplate({
  Compo: 'span',
  namespace: 't',
  baseName: 'MetaSeparator',
  displayName: 'MetaSeparator',
});
