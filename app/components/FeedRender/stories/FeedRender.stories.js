import { action } from '@storybook/addon-actions';
import React, { useState, useMemo, useRef } from 'react';
import Button from '@feat/feat-ui/lib/button';
import { provider } from '../helpers';
import FeedTemplateProvider from '../Provider';

export default {
  title: 'Components/FeedRender/Render',
  // decorators: [
  //   (Story) => (
  //     <div style={{ margin: 40, width: 1000 }}>
  //       <Story />
  //     </div>
  //   ),
  // ],
};

const author = {
  id: 3,
  username: '陈大文',
  location: '石桥镇',
  expertise: '解决日常生活难题',
  avatar:
    'https://pic3.feat.com/media/md/5316850817039/avatar/5316850817039_64x64.JPEG',
};
const item = {
  title: '从前有座山。山上有个庙。庙里有个和尚讲古仔。他说：从前有座山',
  body:
    '摘要：从前有座山。山上有个庙。庙里有个和尚讲古仔。他说：从前有座山。山上有个庙。庙里有个和尚讲古仔',
  cover:
    'https://pic2.feat.com/media/5716936515116/dimzou/reword/300/20190918_EA267EB_cover_000084.jpg',
  author,
};

const genItems = () => {
  const items = new Array(7).fill(item);
  return items;
};

export const Render = () => {
  const [items, setItems] = useState(genItems());
  const lastTemplates = useRef([]);
  const onItemClick = action('onItemClick');
  const templates = useMemo(
    () => {
      const t = provider.getTemplates(7, lastTemplates.current);
      lastTemplates.current = t;
      return t;
    },
    [items],
  );
  const rows = [];
  for (let i = 0, j = 0; i < templates.length; i += 1) {
    const T = provider.getTemplate(templates[i]);
    rows.push(
      <T
        data={items.slice(j, j + T.count)}
        key={i}
        onItemClick={onItemClick}
      />,
    );
    j += T.count;
  }

  return (
    <FeedTemplateProvider>
      {rows}
      <Button
        style={{
          position: 'fixed',
          right: 40,
          bottom: 40,
        }}
        type="default"
        onClick={() => {
          const newItems = genItems();
          setItems([...items, ...newItems]);
        }}
      >
        More
      </Button>
    </FeedTemplateProvider>
  );
};
