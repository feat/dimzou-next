import createTemplate from '@feat/feat-ui/lib/util/createTemplate';
import './style.scss';

const NoticeWell = createTemplate({
  Compo: 'div',
  namespace: 'ft',
  baseName: 'NoticeWell',
  displayName: 'NoticeWell',
  customProps: ['modifier'],
  state: ({ baseName, modifier, namespace }) => {
    if (modifier) {
      return `${namespace}-${baseName}_${modifier}`;
    }
    return undefined;
  },
});

export default NoticeWell;
