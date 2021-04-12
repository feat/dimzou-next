import LikeButton from './index';

export default {
  title: 'Components/LikeButton',
  component: LikeButton,
  argTypes: { onClick: { action: 'onClick' } },
};

export const Preview = (args) => <LikeButton {...args} />;
