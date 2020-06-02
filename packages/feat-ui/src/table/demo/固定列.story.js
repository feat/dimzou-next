import React from "react";
import ReactDOM from "react-dom";
import Table from "rc-table";

const columns = [
  { title: "title1", dataIndex: "a", key: "a", width: 100, fixed: "left" },
  { title: "title2", dataIndex: "b", key: "b", width: 100, fixed: "left" },
  { title: "title3", dataIndex: "c", key: "c" },
  { title: "title4", dataIndex: "b", key: "d" },
  { title: "title5", dataIndex: "b", key: "e" },
  { title: "title6", dataIndex: "b", key: "f" },
  { title: <div>title7<br /><br /><br />Hello world!</div>, dataIndex: "b", key: "g" },
  { title: "title8", dataIndex: "b", key: "h" },
  { title: "title9", dataIndex: "b", key: "i" },
  { title: "title10", dataIndex: "b", key: "j" },
  { title: "title11", dataIndex: "b", key: "k" },
  { title: "title12", dataIndex: "b", key: "l", width: 100, fixed: "right" },
];

const data = Array.from({ length: 9 }, (nill, index) => ({
  a: "123", b: "xxxxxxxx", d: 3, key: index,
}));

const Example = () => (
  <div style={{ width: 800 }}>
    <h2>Fixed columns</h2>
    <Table
      columns={columns}
      expandedRowRender={(record) => record.title}
      expandIconAsCell
      scroll={{ x: 1200 }}
      data={data}
    />
  </div>
);

export default Example;
