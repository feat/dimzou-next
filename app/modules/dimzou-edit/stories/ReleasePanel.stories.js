import { useState, useMemo } from 'react';
import { action } from '@storybook/addon-actions';
import Button from '@feat/feat-ui/lib/button';
import listToTree from '@/utils/listToTree';
import ReleasePanel from '../components/ReleasePanel';
import ApplyScenesPanel from '../components/ApplyScenesPanel';
import CategoryPanel from '../components/CategoryPanel/Compo';
import CardPreviewPanel from '../components/CardPreviewPanel';
import ReleasingPanel from '../components/ReleasePanel/ReleasingPanel';
import ReleaseSuccessPanel from '../components/ReleasePanel/ReleaseSuccessPanel';
import ReleaseErrorPanel from '../components/ReleasePanel/ReleaseErrorPanel';

export default {
  title: 'Dimzou/Release/Panel',
  decorators: [],
};

const onFileUpload = (file) => {
  const reader = new FileReader();
  return new Promise((resolve) => {
    reader.onload = () => {
      const url = reader.result;
      resolve({ url });
    };
    reader.readAsDataURL(file);
  });
};

const categories = [
  { id: 1, slug: 'category-1', name: '分类一' },
  { id: 2, slug: 'category-2', name: '分类二' },
  { id: 3, slug: 'category-3', name: '分类三' },
  { id: 4, slug: 'category-4', name: '分类四' },
  { id: 5, parent_id: 1, slug: 'sub-1', name: '分类五' },
  { id: 6, parent_id: 1, slug: 'sub-2', name: '分类六' },
  { id: 7, parent_id: 2, slug: 'sub-3', name: '分类七' },
  { id: 8, parent_id: 5, slug: 'leaf-1', name: '叶子分类一' },
  { id: 9, parent_id: 5, slug: 'leaf-1', name: '叶子分类二' },
];

export const Category = () => {
  const [cats, setCats] = useState(categories);
  const category = categories[7];
  const tree = useMemo(
    () =>
      listToTree(cats, {
        idKey: 'id',
        parentKey: 'parent_id',
      }),
    [cats],
  );
  return (
    <CategoryPanel
      tree={tree}
      category={category}
      onCancel={action('onCancel')}
      onSubmit={action('onConfirm')}
      createCategory={(data) => {
        action('createCategory')(data);
        const newCategory = {
          id: cats.length + 1,
          name: data.name,
          parent_id: data.parentId,
          slug: data.name,
        };
        setCats([...cats, newCategory]);
        return Promise.resolve(newCategory);
      }}
    />
  );
};

export const ApplyScenes = () => {
  const [data, setData] = useState([]);
  return (
    <ApplyScenesPanel
      applyScenes={data}
      onCancel={action('onCancel')}
      onSubmit={(data) => {
        action('onSubmit')(data);
        setData(data);
      }}
      required
      onTerminate={action('onTerminate')}
    />
  );
};

export const CardPreview = () => (
  <CardPreviewPanel
    baseInfo={{
      title: '从前有座山。山上有个庙。',
      body:
        '从前有座山。山上有个庙。庙里有个和尚讲古仔。从前有座山。山上有个庙。庙里有个和尚讲古仔。',
      cover:
        'https://pic2.feat.com/media/5716936515116/dimzou/reword/300/20190918_EA267EB_cover_000084.jpg',
      author: {
        uid: 3,
        username: 'kongkx',
        expertise: 'message',
      },
    }}
    onCancel={action('onCancel')}
    onSubmit={action('onSubmit')}
    onTerminate={action('onTerminate')}
    onFileUpload={onFileUpload}
  />
);

export const CardPreviewWithNoCover = () => (
  <CardPreviewPanel
    baseInfo={{
      title: '从前有座山。山上有个庙。',
      body:
        '从前有座山。山上有个庙。庙里有个和尚讲古仔。从前有座山。山上有个庙。庙里有个和尚讲古仔。',
      cover: '',
      author: {
        uid: 3,
        username: 'kongkx',
        expertise: 'message',
      },
    }}
    onCancel={action('onCancel')}
    onSubmit={action('onSubmit')}
    onTerminate={action('onTerminate')}
    onFileUpload={onFileUpload}
  />
);

export const Releasing = () => <ReleasingPanel message="数据验证中" />;

export const ReleaseSuccess = () => (
  <ReleaseSuccessPanel
    autoCloseCountdown={5}
    onClose={() => {
      alert('onClose trigger');
    }}
  />
);

export const ReleaseError = () => (
  <ReleaseErrorPanel
    onTerminate={action('onTerminate')}
    content={
      <div style={{ margin: 24, padding: 12 }}>Some custom error info</div>
    }
  />
);

const data = {
  title: '从前有座山。山上有个庙。',
  summary:
    '从前有座山。山上有个庙。庙里有个和尚讲古仔。从前有座山。山上有个庙。庙里有个和尚讲古仔。',
  author: {
    uid: 3,
    username: 'kongkx',
    expertise: 'message',
  },
  category: undefined,
  applyScenes: undefined,
};

export const SuccessPath = () => {
  const [showPanel, setShowPanel] = useState(false);
  return (
    <div style={{ height: '200vh' }}>
      <Button
        onClick={() => {
          setShowPanel(true);
        }}
      >
        Release
      </Button>
      {showPanel && (
        <ReleasePanel
          target={data}
          onSubmit={(info) => {
            action('onSubmit')(info);
            return new Promise((resolve) => {
              setTimeout(resolve, 1000);
            });
          }}
          onCancel={() => {
            setShowPanel(false);
          }}
          onFileUpload={onFileUpload}
        />
      )}
    </div>
  );
};

export const ErrorPath = () => {
  const [showPanel, setShowPanel] = useState(false);
  return (
    <div style={{ height: '200vh' }}>
      <Button
        onClick={() => {
          setShowPanel(true);
        }}
      >
        Release
      </Button>
      {showPanel && (
        <ReleasePanel
          target={data}
          onSubmit={(info) => {
            action('onSubmit')(info);
            return new Promise((resolve, reject) => {
              setTimeout(() => {
                reject(new Error('information message'));
              }, 1000);
            });
          }}
          onCancel={() => {
            setShowPanel(false);
          }}
          onFileUpload={onFileUpload}
        />
      )}
    </div>
  );
};
