import classNames from "classnames";
import createTemplate from "../util/createTemplate";

const FormLabel = createTemplate({
  Compo: "span",
  baseName: "FormValueStatic",
  displayName: "FormValueStatic",
  customProps: ["block", "modifier"],
  state: ({ namespace, baseName, block, modifier, size }) => {
    const prefix = `${namespace}-${baseName}`;
    return classNames(prefix, {
      [`${prefix}_${modifier}`]: modifier,
      [`${prefix}_${size}`]: size,
      [`${prefix}_block`]: block,
    });
  },
});

export default FormLabel;
