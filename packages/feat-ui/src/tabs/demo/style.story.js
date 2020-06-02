import React from "react";
import PropTypes from "prop-types";
import Tabs from "@feat/feat-ui/lib/tabs";
const TabPane = Tabs.TabPane;

/** 具有两种风格， 分别为普通和feat。 */
export default class Comp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeKey: "apple",
    };
  }

  handleChange = (activeKey) => {
    console.log(activeKey);
    this.setState({ activeKey });
  }

  render() {
    return (
      <div>
        <Tabs onChange={this.handleChange} activeKey={this.state.activeKey} type="normal">
          <TabPane key="apple" tab="apple">i eat apple</TabPane>
          <TabPane key="peach" tab="peach">i eat peach</TabPane>
          <TabPane key="banana" tab="banana">i eat banana</TabPane>
        </Tabs>
      </div>
    );
  }
}
