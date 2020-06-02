import React from "react";
import FormItem from "@feat/feat-ui/lib/form/FormItem";
import TextInput from "@feat/feat-ui/lib/text-input";

const wrapperStyle = {
  marginBottom: 12,
};

function Example() {
  return (
    <div>
      <div style={wrapperStyle}>
        <span>No Border</span>
        <FormItem
          label={<div className="ft-FormLabel">String</div>}
          help={<div className="ft-FormHelp">Help</div>}
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
        <span>Solid</span>
        <FormItem
          label={<div className="ft-FormLabel">String</div>}
          help={<div className="ft-FormHelp">Help</div>}
          modifier="solid"
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
        <span>Dashed</span>
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
    </div>
  );
}

export default Example;
