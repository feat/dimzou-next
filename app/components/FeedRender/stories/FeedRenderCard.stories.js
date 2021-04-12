import React from 'react';
import {
  DimzouFeedCardI,
  DimzouFeedCardII,
  DimzouFeedCardIII,
  DimzouFeedCardIV,
  DimzouFeedCardV,
  DimzouFeedCardVI,
  DimzouFeedCardVII,
  DimzouFeedCardVIII,
  DimzouFeedCardIX,
  DimzouFeedCardX,
  DimzouFeedCardXI,
  DimzouFeedCardXII,
} from '../Card';

export default {
  title: 'Components/FeedRender/Card',
  decorators: [
    (Story) => (
      <div
        style={{
          backgroundColor: '#f3f3f3',
          padding: 40,
          display: 'flex',
          flexWrap: 'wrap',
        }}
      >
        <Story />
      </div>
    ),
  ],
};

const author = {
  id: 3,
  username: '陈大文',
  location: '石桥镇',
  expertise: '解决日常生活难题',
  avatar:
    'https://pic3.feat.com/media/md/5316850817039/avatar/5316850817039_64x64.JPEG',
};

export const I = () => (
  <>
    <div style={{ width: 187.5, margin: 40 }}>
      <DimzouFeedCardI
        data={{
          title: '从前有座山。山上有个庙。',
          body: '摘要：从前有座山。山上有个庙。庙里有个和尚讲古仔。',
          cover:
            'https://pic2.feat.com/media/8816860601096/dimzou/reword/300/20190904_DA93E9B_pic_2_B.jpg',
          author,
        }}
      />
    </div>
    <div style={{ width: 187.5, margin: 40 }}>
      <DimzouFeedCardI />
    </div>
    <div style={{ width: 187.5, margin: 40 }}>
      <DimzouFeedCardI
        data={{
          title: '从前有座山。山上有个庙。',
          body: '摘要：从前有座山。山上有个庙。庙里有个和尚讲古仔。',
          cover:
            'https://pic2.feat.com/media/8816860601096/dimzou/reword/300/20190904_DA93E9B_pic_2_B.jpg',
          author,
          isDraft: true,
        }}
      />
    </div>
    <div style={{ width: 187.5, margin: 40 }}>
      <DimzouFeedCardI
        data={{
          title: '从前有座山。山上有个庙。',
          body: '摘要：从前有座山。山上有个庙。庙里有个和尚讲古仔。',
          cover:
            'https://pic2.feat.com/media/8816860601096/dimzou/reword/300/20190904_DA93E9B_pic_2_B.jpg',
          author,
          isDraft: true,
          isTranslation: true,
        }}
      />
    </div>
  </>
);

export const II = () => (
  <>
    <div style={{ width: 250, margin: 40 }}>
      <DimzouFeedCardII
        data={{
          title: '从前有座山。山上有个庙。庙里有个和尚讲古仔。',
          body: '摘要：从前有座山。山上有个庙。庙里有个和尚讲古仔。',
          cover:
            'https://pic2.feat.com/media/8816860601096/dimzou/reword/300/20190904_DA93E9B_pic_2_B.jpg',
          author,
        }}
      />
    </div>
    <div style={{ width: 250, margin: 40 }}>
      <DimzouFeedCardII />
    </div>
    <div style={{ width: 250, margin: 40 }}>
      <DimzouFeedCardII
        data={{
          title: '从前有座山。山上有个庙。庙里有个和尚讲古仔。',
          body: '摘要：从前有座山。山上有个庙。庙里有个和尚讲古仔。',
          cover:
            'https://pic2.feat.com/media/8816860601096/dimzou/reword/300/20190904_DA93E9B_pic_2_B.jpg',
          author,
          isDraft: true,
        }}
      />
    </div>
    <div style={{ width: 250, margin: 40 }}>
      <DimzouFeedCardII
        data={{
          title: '从前有座山。山上有个庙。庙里有个和尚讲古仔。',
          body: '摘要：从前有座山。山上有个庙。庙里有个和尚讲古仔。',
          cover:
            'https://pic2.feat.com/media/8816860601096/dimzou/reword/300/20190904_DA93E9B_pic_2_B.jpg',
          author,
          isDraft: true,
          isTranslation: true,
        }}
      />
    </div>
  </>
);

export const III = () => (
  <>
    <div style={{ width: 250, margin: 40 }}>
      <DimzouFeedCardIII
        data={{
          title: '从前有座山。山上有个庙, 从前有座山。山上有个庙',
          body: '从前有座山。山上有个庙。庙里有个和尚讲古仔。',
          cover:
            'https://pic2.feat.com/media/8816860601096/dimzou/reword/300/20190904_DA93E9B_pic_2_B.jpg',
          author,
        }}
      />
    </div>
    <div style={{ width: 250, margin: 40 }}>
      <DimzouFeedCardIII />
    </div>
  </>
);

export const IV = () => (
  <>
    <div style={{ width: 250, margin: 40 }}>
      <DimzouFeedCardIV
        data={{
          title: '从前有座山。山上有个庙',
          body: '从前有座山。山上有个庙。庙里有个和尚讲古仔。',
          cover:
            'https://pic2.feat.com/media/8816860601096/dimzou/reword/300/20190904_DA93E9B_pic_2_B.jpg',
          author,
        }}
      />
    </div>
    <div style={{ width: 250, margin: 40 }}>
      <DimzouFeedCardIV />
    </div>
    <div style={{ width: 250, margin: 40 }}>
      <DimzouFeedCardIV showAvatar={false} />
    </div>
  </>
);

export const V = () => (
  <>
    <div style={{ width: 375, margin: 40 }}>
      <DimzouFeedCardV
        data={{
          title: '从前有座山。山上有个庙。庙里有个和尚讲古仔。',
          body:
            '从前有座山。山上有个庙。庙里有个和尚讲古仔。讲咩古仔呢？从前有座山。山上有个庙。庙里有个和尚讲古仔。讲咩古仔呢？',
          cover:
            'https://pic2.feat.com/media/8816860601096/dimzou/reword/300/20190904_DA93E9B_pic_2_B.jpg',
          author,
        }}
      />
    </div>
    <div style={{ width: 375, margin: 40 }}>
      <DimzouFeedCardV />
    </div>
  </>
);

export const VI = () => (
  <>
    <div style={{ width: 375, margin: 40 }}>
      <DimzouFeedCardVI
        data={{
          title: '从前有座山。山上有个庙。庙里有个和尚讲古仔。',
          body:
            '从前有座山。山上有个庙。庙里有个和尚讲古仔。讲咩古仔呢？从前有座山。山上有个庙。庙里有个和尚讲古仔。',
          cover:
            'https://pic2.feat.com/media/8816860601096/dimzou/reword/300/20190904_DA93E9B_pic_2_B.jpg',
          author,
        }}
      />
    </div>
    <div style={{ width: 375, margin: 40 }}>
      <DimzouFeedCardVI />
    </div>
  </>
);

export const VII = () => (
  <>
    <div style={{ width: 375, margin: 40 }}>
      <DimzouFeedCardVII
        data={{
          title: '从前有座山。山上有个庙。',
          body:
            '摘要：从前有座山。山上有个庙。庙里有个和尚讲古仔。讲咩古仔呢？？他说啊，从前有座山。山上有个庙。',
          cover:
            'https://pic2.feat.com/media/8816860601096/dimzou/reword/300/20190904_DA93E9B_pic_2_B.jpg',
          author,
        }}
      />
    </div>
    <div style={{ width: 375, margin: 40 }}>
      <DimzouFeedCardVII />
    </div>
  </>
);

export const VIII = () => (
  <>
    <div style={{ width: 375, margin: 40 }}>
      <DimzouFeedCardVIII
        data={{
          title: '从前有座山。山上有个庙。',
          body:
            '摘要：从前有座山。山上有个庙。庙里有个和尚讲古仔。讲咩古仔呢？？他说啊，从前有座山。山上有个庙。',
          cover:
            'https://pic2.feat.com/media/8816860601096/dimzou/reword/300/20190904_DA93E9B_pic_2_B.jpg',
          author,
        }}
      />
    </div>
    <div style={{ width: 375, margin: 40 }}>
      <DimzouFeedCardVIII />
    </div>
  </>
);

export const IX = () => (
  <>
    <div style={{ width: 500, margin: 40 }}>
      <DimzouFeedCardIX
        data={{
          title: '从前有座山。山上有个庙。庙里有个和尚讲古仔。',
          body:
            '摘要：从前有座山。山上有个庙。庙里有个和尚讲古仔。讲咩古仔呢？？他说啊，从前有座山。山上有个庙。庙里有个和尚讲古仔。从前有座山。山上有个庙。庙里有个和尚讲古仔。讲咩古仔呢？',
          cover:
            'https://pic2.feat.com/media/8816860601096/dimzou/reword/300/20190904_DA93E9B_pic_2_B.jpg',
          author,
        }}
      />
    </div>
    <div style={{ width: 500, margin: 40 }}>
      <DimzouFeedCardIX />
    </div>
  </>
);

export const X = () => (
  <>
    <div style={{ width: 750, margin: 40 }}>
      <DimzouFeedCardX
        data={{
          title: '从前有座山。山上有个庙。庙里有个和尚讲古仔。',
          body:
            '摘要：从前有座山。山上有个庙。庙里有个和尚讲古仔。讲咩古仔呢？？他说啊，从前有座山。山上有个庙。庙里有个和尚讲古仔。从前有座山。',
          cover:
            'https://pic2.feat.com/media/8816860601096/dimzou/reword/300/20190904_DA93E9B_pic_2_B.jpg',
          author,
        }}
      />
    </div>
    <div style={{ width: 750, margin: 40 }}>
      <DimzouFeedCardX />
    </div>
  </>
);

export const XI = () => (
  <>
    <div style={{ width: 750, margin: 40 }}>
      <DimzouFeedCardXI
        data={{
          title: '从前有座山。山上有个庙。庙里有个和尚讲古仔。',
          body:
            '摘要：从前有座山。山上有个庙。庙里有个和尚讲古仔。讲咩古仔呢？？他说啊，从前有座山。山上有个庙。庙里有个和尚讲古仔。从前有座山。',
          cover:
            'https://pic2.feat.com/media/8816860601096/dimzou/reword/300/20190904_DA93E9B_pic_2_B.jpg',
          author,
        }}
      />
    </div>
    <div style={{ width: 750, margin: 40 }}>
      <DimzouFeedCardXI />
    </div>
  </>
);

export const XII = () => (
  <>
    <div style={{ width: 750, margin: 40 }}>
      <DimzouFeedCardXII
        data={{
          title: '从前有座山。山上有个庙。庙里有个和尚讲古仔。',
          body:
            '摘要：从前有座山。山上有个庙。庙里有个和尚讲古仔。讲咩古仔呢？？他说啊，从前有座山。山上有个庙。庙里有个和尚讲古仔。从前有座山。',
          cover:
            'https://pic2.feat.com/media/8816860601096/dimzou/reword/300/20190904_DA93E9B_pic_2_B.jpg',
          author,
        }}
      />
    </div>
    <div style={{ width: 750, margin: 40 }}>
      <DimzouFeedCardXII />
    </div>
  </>
);
