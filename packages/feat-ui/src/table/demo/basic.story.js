import React from 'react';
import PropTypes from 'prop-types';

import Table from '@feat/feat-ui/lib/table';

const data = [];
for (let i = 0; i < 10; i++) {
  data.push({
    key: i,
    a: `a${i}`,
    b: `b${i}`,
    c: `c${i}`,
  });
}
const overlay = (
  <ul style={{ width: 400, backgroundColor: 'skyblue' }}>
    <li>a</li>
    <li>b</li>
    <li>c</li>
  </ul>
);

export default class Example extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
    };
    this.filters = [];
  }

  handleVisibleChange = (visible) => {
    this.setState({ visible });
  };

  handleSelect = (selected) => {
    this.filters.push(selected);
  };

  confirmFilter() {
    console.log(this.filters.join(','));
    this.setState({
      visible: false,
    });
  }

  render() {
    const columns = [
      {
        title: <div>title1</div>,
        key: 'a',
        dataIndex: 'a',
        width: 100,
      },
      { title: 'title2', key: 'b', dataIndex: 'b', width: 100 },
      { title: 'title3', key: 'c', dataIndex: 'c', width: 200 },
    ];

    return (
      <Table
        columns={columns}
        data={data}
        size="sm"
        rowKey={(record) => record.key}
        loading
      />
    );
  }
}
