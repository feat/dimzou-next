import BlockErrorHint from './index';
export default {
  title: 'Components/BlockErrorHint',
  component: BlockErrorHint,
  decorators: [],
  argTypes: {
    error: {
      control: null,
    },
    onRetry: {
      action: 'onRetry',
    },
  },
};
export const Preview = (args) => <BlockErrorHint {...args} />;
Preview.args = {
  error: new Error('Demo Error Message'),
};
