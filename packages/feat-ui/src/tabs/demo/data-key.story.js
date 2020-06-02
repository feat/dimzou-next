import React from 'react';
import PropTypes from 'prop-types';
import Tabs from '@feat/feat-ui/lib/tabs';
const TabPane = Tabs.TabPane;

/**  使用 dataKey */
export default class Comp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeKey: 100,
    };
  }

  handleChange = (activeKey) => {
    console.log(activeKey);
    this.setState({ activeKey });
  };

  render() {
    return (
      <div>
        <Tabs
          onChange={this.handleChange}
          activeKey={this.state.activeKey}
          type="normal"
        >
          <TabPane key="apple" dataKey={100} tab="apple">
            i eat apple
          </TabPane>
          <TabPane key="peach" dataKey={200} tab="peach">
            i eat peach
          </TabPane>
          <TabPane key="banana" dataKey={300} tab="banana">
            i eat banana
          </TabPane>
        </Tabs>
      </div>
    );
  }
}
