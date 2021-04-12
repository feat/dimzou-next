import { useState } from 'react';
import { action } from '@storybook/addon-actions';
import { CardI } from '../index';
import FieldTextEditable from '../FieldTextEditable';
export default {
  title: 'Dimzou/Release/CardWidget',
  decorators: [
    (Story) => (
      <div style={{ padding: 20, background: '#f3f3f3' }}>
        <Story />
      </div>
    ),
  ],
};

const author = {
  uid: 1,
  username: 'kongkx',
  expertise: 'front-end developer',
};

export const FieldEdit = () => {
  const [title, setTitle] = useState('');
  return (
    <div style={{ width: 200, background: 'white' }}>
      <FieldTextEditable
        value={title}
        onChange={(value) => {
          setTitle(value);
        }}
      />
    </div>
  );
};

export const I = () => {
  const [data, setData] = useState({
    title: '从前有座山。山上有个庙。',
    body:
      '摘要：从前有座山。山上有个庙。庙里有个和尚讲古仔。从前有座山。山上有个庙。庙里有个和尚讲古仔。',
    cover: undefined,
  });

  return (
    <div style={{ width: 187.5 }}>
      <CardI
        title={data.title}
        body={data.body}
        cover={data.cover}
        author={author}
        onChange={(info) => {
          action('onChange')(info);
          const newData = {
            ...data,
            [info.field]: info.value,
          };
          setData(newData);
        }}
        uploadCover={(file) => {
          const reader = new FileReader();
          reader.onload = () => {
            const url = reader.result;
            setData({
              ...data,
              cover: url,
            });
          };
          reader.readAsDataURL(file);
        }}
      />
    </div>
  );
};
