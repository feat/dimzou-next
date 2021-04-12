import InlineFilterForm from './index';

export default {
  title: 'Components/InlineFilterForm',
  component: InlineFilterForm,
  argTypes: {
    onSubmit: { action: 'onSubmit' },
  },
  decorators: [
    (Story) => (
      <div style={{ width: 400, margin: 20 }}>
        <Story />
      </div>
    ),
  ],
};

export const Example = (args) => <InlineFilterForm {...args} />;
