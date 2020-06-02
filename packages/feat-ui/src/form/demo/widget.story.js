import React from "react";
import classNames from "classnames";
import FormItem from "@feat/feat-ui/lib/form/FormItem";
import Button from "@feat/feat-ui/lib/button";
import Popover from "@feat/feat-ui/lib/popover";
import FlatDatePicker from "@feat/feat-ui/lib/flat-date-picker";
import FormLabel from "@feat/feat-ui/lib/form/FormLabel";
import TextInput from "@feat/feat-ui/lib/text-input";

class InputItem extends React.Component {
  render() {
    return (
      <FormItem modifier="dashed" label={<FormLabel>TextInput</FormLabel>}>
        {({ handleBlur, handleFocus, bindWidget }) => (
          <TextInput
            ref={(n) => {
              bindWidget(n);
            }}
            block
            onFocus={handleFocus}
            onBlur={handleBlur}
          />
        )}
      </FormItem>
    );
  }
}

class ButtonItem extends React.Component {
  render() {
    return (
      <FormItem modifier="dashed" label={<FormLabel>Button</FormLabel>}>
        {({ handleFocus, handleBlur }) => (
          <Button onFocus={handleFocus} onBlur={handleBlur} block>
            Trigger
          </Button>
        )}
      </FormItem>
    );
  }
}

class PoplayerItem extends React.Component {
  render() {
    return (
      <FormItem modifier="dashed" label={<FormLabel>Popover</FormLabel>}>
        {({ handleFocus, handleBlur }) => (
          <Popover
            placement="bottomLeft"
            trigger="click"
            ref={(n) => {
              this.popover = n;
            }}
            content={
              <div style={{ width: 200 }}>
                <FlatDatePicker
                  yearRange={72}
                  pickerMode="history"
                  placeholder="Select a date"
                  format="Y-m"
                  viewMode="ym"
                  onChange={(e) => {
                    console.log(e);
                  }}
                />
              </div>
            }
            onOpen={handleFocus}
            onClose={handleBlur}
          >
            <Button block>Demo</Button>
          </Popover>
        )}
      </FormItem>
    );
  }
}

class DemoItem extends React.Component {
  state = {};

  handleFocus = () => {
    this.setState({
      hasFocus: true,
    });
  };

  handleBlur = () => {
    this.setState({
      hasFocus: false,
    });
  };

  render() {
    return (
      <div style={{ width: 300 }}>
        <InputItem />
        <ButtonItem />
        <PoplayerItem />
      </div>
    );
  }
}

export default DemoItem;
