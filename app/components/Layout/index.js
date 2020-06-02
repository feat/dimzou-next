import createTemplate from '@feat/feat-ui/lib/util/createTemplate';

import './style.scss';

const Layout = createTemplate({
  Compo: 'div',
  namespace: '',
  baseName: 'MainLayout',
  displayName: 'Layout',
  customProps: ['modifier'],
  state: ({ baseName, modifier, children }) => {
    const classes = {};
    if (modifier) {
      classes[`${baseName}_${modifier}`] = true;
    }
    if (
      children.some &&
      children.some(
        (child) =>
          child.type.displayName &&
          child.type.displayName.indexOf('Sidebar') > -1,
      )
    ) {
      classes['has-sidebar'] = true;
    }
    return classes;
  },
});

Layout.Sidebar = createTemplate({
  Compo: 'aside',
  namespace: '',
  baseName: 'MainLayout__sidebar',
  displayName: 'Sidebar',
  customProps: ['modifier'],
  state: ({ baseName, modifier }) => modifier && `${baseName}_${modifier}`,
});

Layout.Main = createTemplate({
  Compo: 'main',
  namespace: '',
  baseName: 'MainLayout__main',
  displayName: 'Main',
  customProps: ['modifier'],
  state: ({ baseName, modifier }) => modifier && `${baseName}_${modifier}`,
});

Layout.Header = createTemplate({
  Compo: 'div',
  namespace: '',
  baseName: 'MainLayout__header',
  displayName: 'Header',
  customProps: ['modifier'],
  state: ({ baseName, modifier }) => modifier && `${baseName}_${modifier}`,
});

Layout.Title = createTemplate({
  Compo: 'div',
  namespace: '',
  baseName: 'MainLayout__title',
  displayName: 'Title',
  customProps: ['modifier'],
  state: ({ baseName, modifier }) => modifier && `${baseName}_${modifier}`,
});

export default Layout;
