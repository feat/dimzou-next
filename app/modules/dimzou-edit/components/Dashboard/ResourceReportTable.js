import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import moment from 'moment';
import { stringify } from 'query-string';

import Table from '@feat/feat-ui/lib/table';
import Pagination from '@feat/feat-ui/lib/pagination';
import notification from '@feat/feat-ui/lib/notification';

import FilterForm from './ResourceReportFilterForm';
import { asyncFetchResourceStats, setResourceStatsQuery } from '../../actions';
import { selectResourceStats } from '../../selectors';

class ResourceReportTable extends React.PureComponent {
  componentDidMount() {
    const queryState = this.getQueryState();
    if (!queryState) {
      this.props.dispatch(asyncFetchResourceStats({}));
    }
  }

  getQueryState() {
    const { query, requests } = this.props;
    const key = stringify(query);
    return requests[key];
  }

  updatePage = (page) => {
    // TODO: fetch data then update query.
    const query = {
      ...this.props.query,
      page,
    };
    this.updateQuery(query);
  };

  updateDateRange = ({ period }) => {
    const query = {
      ...this.props.query,
      start: period.start.format('YYYY-MM-DD'),
      end: period.start.format('YYYY-MM-DD'),
    };
    return this.updateQuery(query);
  };

  updateQuery(query) {
    return this.props
      .dispatch(asyncFetchResourceStats({ query }))
      .then(() => {
        this.props.dispatch(setResourceStatsQuery(query));
      })
      .catch((err) => {
        notification.error({
          message: 'Error',
          description: err.message,
        });
      });
  }

  render() {
    const queryState = this.getQueryState() || {};

    if (queryState && queryState.fetchError) {
      return <div>TODO {queryState.fetchError.message}</div>;
    }

    return (
      <div className="dz-ResourceReportTable">
        <div className="dz-ResourceReportTable__rangeSelect">
          <div style={{ maxWidth: 240 }}>
            <FilterForm onSubmit={this.updateDateRange} />
          </div>
        </div>
        <div className="dz-ResourceReportTable__content">
          <Table
            loading={this.props.loading}
            data={queryState.data}
            columns={[
              {
                title: '标题',
                dataIndex: 'title',
              },
              {
                title: '发布日期',
                dataIndex: 'publishedAt',
                render: (date) => moment(date).format('YYYY/MM/DD'),
              },
              {
                title: '浏览量',
                dataIndex: 'viewCount',
                sortable: true,
              },
              {
                title: '评论',
                dataIndex: 'commentCount',
              },
              {
                title: '点赞',
                dataIndex: 'likeCount',
              },
              {
                title: '奖赏',
                dataIndex: 'rewardCount',
              },
              {
                title: '操作',
                render: () => (
                  <>
                    <a href="#">详细报告</a>
                  </>
                ),
              },
            ]}
          />
        </div>
        <div className="dz-ResourceReportTable__footer">
          <Pagination
            size="xs"
            {...queryState.pagination}
            onChange={this.updatePage}
          />
        </div>
      </div>
    );
  }
}

ResourceReportTable.propTypes = {
  dispatch: PropTypes.func,
  query: PropTypes.object,
  loading: PropTypes.bool,
  requests: PropTypes.object,
};

const withConnect = connect(selectResourceStats);

export default withConnect(ResourceReportTable);
