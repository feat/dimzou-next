import classNames from 'classnames';
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

Layout.Content = createTemplate({
  Compo: 'div',
  namespace: '',
  baseName: 'MainLayout__content',
  displayName: 'Content',
  customProps: ['modifier'],
});

export const Site = (props) => {
  const { className, children, mode, ...restProps } = props;
  return (
    <div
      className={classNames(className, 'Site', {
        Site_fixedHeader: mode === 'fixed-header',
        Site_staticHeader: mode === 'static-header',
      })}
      {...restProps}
    >
      {children}
    </div>
  );
};

export const SiteHeader = createTemplate({
  Compo: 'div',
  namespace: '',
  baseName: 'Site__header',
  displayName: 'SiteHeader',
  customProps: ['modifier'],
});

export const SiteContent = createTemplate({
  Compo: 'div',
  namespace: '',
  baseName: 'Site__content',
  displayName: 'SiteContent',
  customProps: ['modifier'],
});

export default Layout;
