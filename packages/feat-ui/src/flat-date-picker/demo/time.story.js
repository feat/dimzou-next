import React from "react";
import moment from "moment";
import FlatDatePicker from "@feat/feat-ui/lib/flat-date-picker";

/** FlatDatePicker TimeSelect */

const Example = () => (
  <div>
    <FlatDatePicker
      pickerMode="normal"
      viewMode="Hm"
      format="H:m"
      onChange={(m, dateString) => {
        console.log(m, dateString);
      }}
    />
  </div>
);

export default Example;
