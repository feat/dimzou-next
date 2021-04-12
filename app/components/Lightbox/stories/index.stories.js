import { useState } from 'react';
import Lightbox from '../index';
import image1 from './1.jpg';
import image2 from './2.jpg';
import image3 from './3.jpg';
import image4 from './4.jpg';
export default {
  title: 'Components/Lightbox',
  component: Lightbox,
  decorators: [],
  parameters: {
    docs: {
      description: {
        component: `根据网站设计需要，通过默认属性的方式，设置了 overlay 的 z-index。 

react-image-lightbox [文档](https://frontend-collective.github.io/react-image-lightbox/)`,
      },
    },
    source: {
      type: 'code',
    },
  },
};

const Preview = () => {
  const images = [image1, image2, image3, image4];
  const [index, setIndex] = useState(0);
  const [open, setOpen] = useState(false);
  const count = images.length;
  const prevIndex = (index - 1 + count) % count;
  const nextIndex = (index + 1) % count;
  return (
    <>
      <button
        type="button"
        className="ft-Button"
        onClick={() => {
          setOpen(true);
        }}
      >
        Open
      </button>
      {open && (
        <Lightbox
          mainSrc={images[index]}
          prevSrc={images[prevIndex]}
          nextSrc={images[nextIndex]}
          onMovePrevRequest={() => setIndex(prevIndex)}
          onMoveNextRequest={() => setIndex(nextIndex)}
          onCloseRequest={() => setOpen(false)}
        />
      )}
    </>
  );
};

export const CustomSource = Preview.bind({});

CustomSource.parameters = {
  docs: {
    source: {
      code: `
<Lightbox
    mainSrc={images[index]}
    prevSrc={images[prevIndex]}
    nextSrc={images[nextIndex]}
    onMovePrevRequest={() => setIndex(prevIndex)}
    onMoveNextRequest={() => setIndex(nextIndex)}
    onCloseRequest={() => setOpen(false)}
/>
          `,
    },
  },
};
