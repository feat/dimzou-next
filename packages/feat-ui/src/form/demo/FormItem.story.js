import React from "react";
import classNames from "classnames";
import FormItem from "@feat/feat-ui/lib/form/FormItem";
import FormLabel from "@feat/feat-ui/lib/form/FormLabel";
import TextInput from "@feat/feat-ui/lib/text-input";

const wrapperStyle = {
  marginBottom: 12,
};

function Example() {
  return (
    <div>
      <div style={wrapperStyle}>
        <FormItem
          label={<div className="ft-FormLabel">String</div>}
          help={<div className="ft-FormHelp">Help</div>}
          modifier="dashed"
        >
          {({ handleFocus, handleBlur, hasFocus, bindWidget }) => (
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
      </div>
      <div style={wrapperStyle}>
        <FormItem label={<FormLabel>Error</FormLabel>} validateStatus="error">
          {({ handleFocus, handleBlur, hasFocus, bindWidget }) => (
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
      </div>
      <div style={wrapperStyle}>
        <FormItem
          label={<FormLabel>Warning</FormLabel>}
          validateStatus="warning"
        >
          <input className="ft-TextInput ft-TextInput_block ft-TextInput_sm" />
        </FormItem>
      </div>
      <div style={wrapperStyle}>
        <FormItem
          label={<FormLabel>Success</FormLabel>}
          validateStatus="success"
        >
          <input className="ft-TextInput ft-TextInput_block ft-TextInput_sm" />
        </FormItem>
      </div>
    </div>
  );
}

export default Example;
