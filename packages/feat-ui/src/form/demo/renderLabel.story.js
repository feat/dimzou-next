import React from "react";
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
          renderLabel={({ hasFocus }) =>
            hasFocus ? (
              <FormLabel>HasFocus</FormLabel>
            ) : (
              <FormLabel>Blur</FormLabel>
            )
          }
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
