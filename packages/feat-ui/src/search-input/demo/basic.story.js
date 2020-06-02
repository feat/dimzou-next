import React from "react";
import Searchbox from "../SearchBox";
class Example extends React.Component {
  // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);
    this.state = {
      value: "",
    };
  }

  onSearch = (value) => {
    console.log("search: ", value);
  };

  render() {
    return (
      <div className="demo">
        <Searchbox
          initialValue="kongkx"
          onSearch={this.onSearch}
          type="text"
        />
      </div>
    );
  }
}

Example.propTypes = {};

export default Example;
