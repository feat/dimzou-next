import CommentIcon from './index';
export default {
  title: 'Icons/CommentIcon',
  component: CommentIcon,
  argTypes: {
    previewSize: {
      control: {
        type: 'range',
        min: 10,
        max: 100,
      },
    },
  },
};

export const Preview = (args) => (
  <div
    style={{
      padding: 8,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#ddd',
      width: args.previewSize,
      height: args.previewSize,
    }}
  >
    <CommentIcon
      className={args.className}
      style={{ width: args.previewSize, height: args.previewSize }}
    />
  </div>
);

Preview.args = {
  previewSize: 60,
};
