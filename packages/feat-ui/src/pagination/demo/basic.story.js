import React from "react";
import Pagination from "@feat/feat-ui/lib/pagination";

/** 分页器，基本使用。 */
export default class Example extends React.Component {
  state = { current: 1 }

  onChange = (current) => {
    this.setState({ current });
  }

  render() {
    return (
      <Pagination
        current={this.state.current}
        onChange={this.handleChange}
        total={200}
        pageSize={10}
        showQuickJumper
      />
    );
  }
}
