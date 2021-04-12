import SocialIcon, { names } from './index';
export default {
  title: 'Icons/SocialIcon',
  component: SocialIcon,
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

export const All = (args) => (
  <div>
    {names.map((name) => (
      <div
        style={{
          float: 'left',
          border: '1px solid #333',
          background: '#ddd',
          padding: 20,
        }}
        key={name}
      >
        <SocialIcon
          name={name}
          style={{ width: args.previewSize, height: args.previewSize }}
        />
      </div>
    ))}
  </div>
);

All.args = {
  previewSize: 60,
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
    <SocialIcon
      name={args.name}
      className={args.className}
      style={{ width: args.previewSize, height: args.previewSize }}
    />
  </div>
);

Preview.args = {
  name: names[0],
  previewSize: 60,
};
