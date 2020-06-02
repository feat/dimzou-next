import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";

import omit from "lodash/omit";

import { namespace as defaultNamespace } from "../config";

function createTemplate({
  Compo = "span",
  namespace: initNamespace = defaultNamespace,
  baseName: initBaseName,
  displayName,
  state,
  customProps,
}) {
  class Temp extends PureComponent {
    static displayName = displayName;

    static propTypes = {
      namespace: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
      baseName: PropTypes.string,
      className: PropTypes.string,
    };

    static defaultProps = {
      namespace: initNamespace,
      baseName: initBaseName,
    };

    render() {
      const { namespace, baseName, className, ...restProps } = this.props;
      const _restProps = customProps && omit(restProps, customProps);
      const defaultClassName = namespace
        ? `${namespace}-${baseName}`
        : baseName;
      return (
        <Compo
          className={classNames(
            defaultClassName,
            className,
            state && state(this.props)
          )}
          {..._restProps || restProps}
        />
      );
    }
  }
  return Temp;
}

export default createTemplate;
