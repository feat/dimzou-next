import DimzouIcon, { names } from './index';
export default {
  title: 'Icons/DimzouIcon',
  component: DimzouIcon,
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
        }}
        key={name}
      >
        <div className="padding_24">
          <DimzouIcon
            name={name}
            style={{ width: args.previewSize, height: args.previewSize }}
          />
        </div>
        {/* <div className="t-center">
          <span style={{ fontSize: 12 }}>{name}</span>
        </div> */}
      </div>
    ))}
  </div>
);

All.args = {
  previewSize: 64,
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
    <DimzouIcon
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
