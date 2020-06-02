import React from "react";
import PropTypes from "prop-types";
import LazyLoad from "@feat/feat-ui/lib/lazy-load";
import { RectShape } from "@feat/feat-ui/lib/placeholder";

// TODO this is temporary demo

const HEIGHT = 500;

/** 延迟加载组件的基本使用 */
class FakeImage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
    };
  }

  componentDidMount() {
    setTimeout(() => {
      this.setState({ loading: false });
    }, 500);
  }

  render() {
    if (this.state.loading) {
      return <div style={{ height: HEIGHT, backgroundColor: "black" }} />;
    }
    return (
      <RectShape height={HEIGHT} label={`第${this.props.text + 1}张图片`} />
    );
  }
}

export default class Example extends React.Component {
  render() {
    return (
      <div style={{ wdith: "60vw", margin: "0 auto" }}>
        {Array.from({ length: 10 }, (nill, index) => (
          <LazyLoad height={HEIGHT} once key={index}>
            <div style={{ marginBottom: 50 }}>
              <FakeImage text={index} />
            </div>
          </LazyLoad>
        ))}
      </div>
    );
  }
}
