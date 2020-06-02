import React from "react";
import { Row, Col } from "@feat/feat-ui/lib/grid";
import Placeholder from "@feat/feat-ui/lib/placeholder";
import Sticky from "@feat/feat-ui/lib/sticky";

import "./basic.story.scss";

/** 贴纸的使用 */
class Example extends React.Component {
  state = {
    render: false,
  };

  componentDidMount() {
    // 等样式加载完成后进行渲染，样式影响位置计算。
    setTimeout(() => {
      this.setState({ render: true });
    }, 1000);
  }

  render() {
    if (!this.state.render) {
      return <div>Loading...</div>;
    }
    return (
      <div>
        <div className="header" id="header" />
        <div className="main">
          <div className="wrap" id="wrap">
            <div className="sidebar">
              <div className="sidebarMain">Main Compo</div>
              <Sticky top="#header" bottomBoundary="#wrap" stickyToPageBottom>
                <div className="docker">Docker</div>
              </Sticky>
            </div>
            <div className="content" />
          </div>
        </div>
        <div className="footer" />
      </div>
    );
  }
}

export default Example;
