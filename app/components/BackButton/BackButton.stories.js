import BackButton from './index';

export default {
  title: 'Components/BackButton',
  component: BackButton,
  argTypes: {
    // onClick: { action: 'onClick' },
  },
};

export const Preview = (args) => <BackButton {...args} />;
Preview.args = {};
