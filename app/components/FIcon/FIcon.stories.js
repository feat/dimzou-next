import FIcon from './index';
export default {
  title: 'Icons/FIcon',
  component: FIcon,
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
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#ddd',
      width: args.previewSize,
      height: args.previewSize,
    }}
  >
    <FIcon
      className={args.className}
      style={{ width: args.previewSize, height: args.previewSize }}
    />
  </div>
);

Preview.args = {
  previewSize: 60,
};
