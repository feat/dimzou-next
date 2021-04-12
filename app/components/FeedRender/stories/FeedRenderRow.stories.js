import {
  RowI,
  RowII,
  RowIII,
  RowIV,
  RowV,
  RowVI,
  RowVII,
  RowVIII,
  RowIX,
  RowX,
  RowXI,
  RowXII,
  RowXIII,
} from '../Row';
import FeedTemplateProvider from '../Provider';

export default {
  title: 'Components/FeedRender/Row',
  decorators: [
    (Story) => (
      <div style={{ margin: 40, width: 800 }}>
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
const item = {
  title: '从前有座山。山上有个庙。庙里有个和尚讲古仔。他说：从前有座山',
  body:
    '摘要：从前有座山。山上有个庙。庙里有个和尚讲古仔。他说：从前有座山。山上有个庙。庙里有个和尚讲古仔',
  cover:
    'https://pic2.feat.com/media/5716936515116/dimzou/reword/300/20190918_EA267EB_cover_000084.jpg',
  author,
};
const items = new Array(7).fill(item);

export const I = () => (
  <FeedTemplateProvider>
    <RowI data={items} />
  </FeedTemplateProvider>
);

export const II = () => (
  <FeedTemplateProvider>
    <RowII data={items} />
  </FeedTemplateProvider>
);

export const III = () => (
  <FeedTemplateProvider>
    <RowIII data={items} />
  </FeedTemplateProvider>
);

export const IV = () => (
  <FeedTemplateProvider>
    <RowIV data={items} />
  </FeedTemplateProvider>
);

export const V = () => (
  <FeedTemplateProvider>
    <RowV data={items} />
  </FeedTemplateProvider>
);

export const VI = () => (
  <FeedTemplateProvider>
    <RowVI data={items} />
  </FeedTemplateProvider>
);
export const VII = () => (
  <FeedTemplateProvider>
    <RowVII data={items} />
  </FeedTemplateProvider>
);

export const VIII = () => (
  <FeedTemplateProvider>
    <RowVIII data={items} />
  </FeedTemplateProvider>
);

export const IX = () => (
  <FeedTemplateProvider>
    <RowIX data={items} />
  </FeedTemplateProvider>
);

export const X = () => (
  <FeedTemplateProvider>
    <RowX data={items} />
  </FeedTemplateProvider>
);

export const XI = () => (
  <FeedTemplateProvider>
    <RowXI data={items} />
  </FeedTemplateProvider>
);
export const XII = () => (
  <FeedTemplateProvider>
    <RowXII data={items} />
  </FeedTemplateProvider>
);
export const XIII = () => (
  <FeedTemplateProvider>
    <RowXIII data={items} />
  </FeedTemplateProvider>
);
