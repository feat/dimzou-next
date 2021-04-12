import { useState, useMemo } from 'react';
import Modal from '@feat/feat-ui/lib/modal';
import { action } from '@storybook/addon-actions';
import listToTree from '@/utils/listToTree';
import CategorySelectModal from '../components/CategorySelectModal';
export default {
  title: 'category/CategorySelectModal',
  component: CategorySelectModal,
  decorators: [],
};

const categories = [
  {
    id: 1,
    name: '分类一',
    slug: 'category-1',
  },
  {
    id: 2,
    name: '分类1-1',
    slug: 'category-1-1',
    parent_id: 1,
  },
  {
    id: 3,
    name: '分类1-1-1',
    slug: 'category-1-1-1',
    parent_id: 2,
  },
];

export const Preview = () => {
  const [data, setData] = useState(categories);
  const tree = useMemo(
    () =>
      listToTree(data, {
        idKey: 'id',
        parentKey: 'parent_id',
      }),
    [data],
  );
  return (
    <Modal isOpen>
      <CategorySelectModal
        tree={tree}
        createCategory={(...args) => {
          action('createCategory')(...args);
          const info = args[0];
          const key = `new-${Date.now()}`;
          const newCategory = {
            id: key,
            slug: key,
            name: info.name,
            parent_id: info.parentId,
          };
          setData([...data, newCategory]);
          return Promise.resolve(newCategory);
        }}
        onConfirm={action('onConfirm')}
      />
    </Modal>
  );
};
