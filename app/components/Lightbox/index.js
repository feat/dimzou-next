import React from 'react';
import Base from 'react-image-lightbox';
import styleVaribales from '@/styles/variables.module.scss';

const Lightbox = React.forwardRef((props, ref) => (
  <Base {...props} ref={ref} />
));

Lightbox.defaultProps = {
  reactModalStyle: {
    overlay: {
      zIndex: (Number(styleVaribales.fixedHeaderZIndex) || 1200) + 100,
    },
  },
};

export default Lightbox;
