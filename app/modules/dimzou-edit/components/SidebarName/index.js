import React from 'react';
import TranslatableMessage from '@/modules/language/containers/TranslatableMessage';
import './style.scss';
import intlMessages from '../../messages'
const SidebarName = React.forwardRef((props, ref) => (
  <div ref={ref} className="dz-SidebarName">
    <TranslatableMessage message={intlMessages.workshop} />
  </div>
))

export default SidebarName