import React from "react";
import Block from "@feat/feat-ui/lib/block";
import Button from "@feat/feat-ui/lib/button";
import { RectShape } from "@feat/feat-ui/lib/placeholder";

/** 控制显示不同的block */
export default class Example extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      editMode: false,
    };
    this.toggleEditMode = this.toggleEditMode.bind(this);
  }

  getToggleLabel() {
    return this.state.editMode ? "Cancel" : "Edit";
  }

  toggleEditMode() {
    this.setState({
      editMode: !this.state.editMode,
    });
  }

  render() {
    return (
      <Block
        title="Demo Block"
        subTitle={
          <span>Message Info</span>
        }
      >
        {this.state.editMode ? (
          <RectShape label="Edit" ratio={16 / 9} />
        ) : (
          <RectShape label="Preview" ratio={16 / 9} />
        )}
      </Block>
    );
  }
}
