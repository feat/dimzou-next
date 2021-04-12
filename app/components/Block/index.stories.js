import Block from './index';
export default {
  title: 'Components/Block',
  component: Block,
  decorators: [],
};
export const Preview = (args) => (
  <div style={{ width: 400 }}>
    <Block {...args}>
      <div>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Itaque
        voluptates nobis delectus aperiam accusamus distinctio quis minus quod
        repellat, ducimus dolorem iure asperiores obcaecati neque deserunt
        tempore voluptatem? Reprehenderit, corporis.
      </div>
    </Block>
  </div>
);
Preview.args = {
  title: '区块标题',
  subHeader: '二级标题',
};
