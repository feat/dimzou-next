import ActionButton from './index';

export default {
  title: 'Components/ActionButton',
  component: ActionButton,
  argTypes: {
    onClick: { action: 'onClick' },
    disabled: { control: 'boolean' },
  },
};

export const Preview = (args) => <ActionButton {...args} />;
Preview.args = {
  type: 'ok',
};
