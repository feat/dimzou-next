import React from 'react';
import PropTypes from 'prop-types';
import Table from 'rc-table';
import classNames from 'classnames';

import { namespace as defaultNS } from '../config';
import Pagination from '../pagination';
import MaskLoader from '../loader/MaskLoader';

export default class FtTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = this.getInitState();
  }

  getInitState() {
    const { pagination } = this.props;
    if (!pagination) {
      return {};
    }
    return {
      pagination: {
        ...Pagination.defaultProps,
        ...pagination,
      },
    };
  }

  getData() {
    if (this.state.pagination) {
      const { current, pageSize } = this.state.pagination;
      return this.props.data.slice(
        pageSize * (current - 1),
        pageSize * current,
      );
    }
    return this.props.data;
  }

  handlePagination = (value) => {
    this.setState({
      pagination: {
        ...this.state.pagination,
        current: value,
      },
    });
  };

  render() {
    const {
      namespace,
      blockName,
      size,
      className,
      wrapperClassName,
      pagination,
      loading,
      ...tableProps
    } = this.props;
    const baseName = `${namespace}-${blockName}`;
    const classConfig = {};
    if (size !== 'default') {
      classConfig[`${baseName}-${size}`] = true;
    }
    const data = this.getData();
    return (
      <div className={classNames(`${baseName}Wrapper`, wrapperClassName)}>
        <Table
          prefixCls={baseName}
          {...tableProps}
          data={data}
          className={classNames(className, classConfig)}
        />
        {pagination && (
          <Pagination
            {...this.state.pagination}
            size={size}
            onChange={this.handlePagination}
          />
        )}
        {loading && <MaskLoader className={`${baseName}-loading-mask`} />}
      </div>
    );
  }
}

FtTable.propTypes = {
  namespace: PropTypes.string,
  blockName: PropTypes.string,
  data: PropTypes.array.isRequired,
  loading: PropTypes.bool,
  size: PropTypes.oneOf(['sm', 'md']),
  pagination: PropTypes.object,
};

FtTable.defaultProps = {
  namespace: defaultNS,
  blockName: 'Table',
  size: 'md',
};
