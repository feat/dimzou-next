import React from "react";
import PropTypes from "prop-types";
import Tabs from "@feat/feat-ui/lib/tabs";
const TabPane = Tabs.TabPane;

/** 默认选中第一项" */
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
        <Tabs onChange={this.handleChange} activeKey={this.state.activeKey}>
          <TabPane
            key="apple"
            tab="apple"
            tabProps={{
              bgStyle: {
                fill: "#fcea9d",
              },
            }}
          >i eat apple</TabPane>
          <TabPane key="peach" tab="peach">i eat peach</TabPane>
          <TabPane key="banana" tab="banana">i eat banana</TabPane>
        </Tabs>
      </div>
    );
  }
}
