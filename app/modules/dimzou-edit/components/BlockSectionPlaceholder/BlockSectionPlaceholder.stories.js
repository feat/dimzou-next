import BlockSectionPlaceholder from './index';
import '../ContentBlockRender/style.scss';

export default {
  title: 'Dimzou/BlockSectionPlaceholder',
  component: BlockSectionPlaceholder,
  decorators: [
    (Story) => (
      <div style={{ width: 760, margin: 20, paddingLeft: 56 }}>
        <Story />
      </div>
    ),
  ],
};

export const Preview = () => <BlockSectionPlaceholder />;
