import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { compose } from 'redux'
import { withRouter } from 'next/router'
import Link from 'next/link'
import { createStructuredSelector } from 'reselect'
import classNames from 'classnames'

import { injectIntl } from 'react-intl'

import { getAsPath } from '@/utils/router'

import Button from '@feat/feat-ui/lib/button'
import Modal from '@feat/feat-ui/lib/modal'
import notification from '@feat/feat-ui/lib/notification'
import { selectCurrentUser } from '@/modules/auth/selectors'
import commonMessages, { adminAction } from '@/messages/common'
import { asyncDeleteBundle } from '@/modules/dimzou-edit/actions';
import { BUNDLE_STATUS_PUBLISHED } from '@/modules/dimzou-edit/constants';
import { getAsPath as getDimzouAsPath } from '@/modules/dimzou-edit/utils/router';
import { getVersionLabel } from '@/modules/dimzou-edit/utils/bundle';

import { selectTableState } from '../../selectors'
import { asyncFetchDimzouList } from '../../actions'
import { bundleListType, fieldLabels } from '../../messages'
import intlMessages from './messages';

import './style.scss'

const types = [
  'created',
  'edited',
  'commented',
  'invited',
  'liked',
  'read',
];
const FALLBACK_TYPE  = types[0];
class DimzouTable extends React.PureComponent {
  componentDidMount() {
    if (!this.props.tableState.onceFetched) {
      this.fetchData();
    }
  }

  componentDidUpdate() {
    if (!this.props.tableState.onceFetched) {
      this.fetchData();
    }
  }

  getActiveType() {
    const { router } = this.props;
    const { type } = router.query;
    return type || FALLBACK_TYPE;
  }

  fetchData = () => {
    const { tableState: { next } } = this.props;
    const type = this.getActiveType();
    this.props.fetchData({
      type,
      ...(next || {}),
    });
  }
  
  handleDelete = (data) => {
    const { intl: { formatMessage }} = this.props;
    Modal.confirm({
      title: formatMessage(intlMessages.confirmToDeleteTitle),
      onCancel: () => {},
      onConfirm: () => {
        this.props.deleteBundle({
          bundleId: data.id,
          userId: data.user ? data.user.uid : data.user_id,
        }).catch((err) => {
          notification.error({
            message: 'Error',
            description: err.message,
          });
        })
      },
    })
  }

  changeType = (type) => {
    const { router } = this.props;
    const newQuery = {
      ...router.query,
      type,
    }
    router.replace({
      pathname: router.pathname,
      query : newQuery,
    }, getAsPath('/profile/:userId', newQuery))
  } 
    
    renderDimzouRow = (data) => {
      if (!(data instanceof Object)) {
        return null;
      }
      const { intl: { formatMessage }, currentUser } = this.props;
      const href = {
        pathname: '/dimzou-edit',
        query: {
          bundleId: data.id,
          isPublicationView: data.status === BUNDLE_STATUS_PUBLISHED,
        },
      }
      const asPath = getDimzouAsPath(href);

      return (
        <div className='dz-DimzouTableRow' key={data.id}>
          <div className='dz-DimzouTableRow__col dz-DimzouTableRow__col_title'>
            <Link
              href={href}
              as={asPath}
            >
              <a>
                {data.title}
                {getVersionLabel(data)}
              </a>
            </Link>
          </div>
          <div className='dz-DimzouTableRow__col dz-DimzouTableRow__col_actions'>
            {data.user_id === currentUser.uid && (
              <span 
                className='dz-DimzouTableRow__action dz-DimzouTableRow__action_danger js-clickable'
                onClick={() => this.handleDelete(data)}
              >
                {formatMessage(adminAction.delete)}
              </span>
            )}
          </div>
        </div>
      )
    }

    render() {
      const { tableState, intl: { formatMessage } } = this.props;
      const activeType = this.getActiveType();
      return (
        <div className='dz-DimzouDash'>
          <div className="dz-DimzouDash__header">
            <div className="dz-DimzouDash__tabs">
              {types.map((type) => (
                <Button 
                  type="default"
                  className={classNames({
                    'is-selected': activeType === type,
                  })}
                  onClick={() => {
                    this.changeType(type)
                  }}
                >
                  {formatMessage(bundleListType[type])}
                </Button>
              ))}
            </div>
          </div>
          <div className="dz-DimzouDash__content">
            <div className='dz-DimzouTableRow dz-DimzouTableRow_header'>
              <div className="dz-DimzouTableRow__col dz-DimzouTableRow__col_title">
                {formatMessage(fieldLabels.title)}
              </div>
              <div className="dz-DimzouTableRow__col dz-DimzouTableRow__col_actions">
                {formatMessage(fieldLabels.actions)}
              </div>
            </div>
            {!tableState.items && tableState.loading && (
              <div style={{ padding: 12 }}>
                {formatMessage(commonMessages.loading)}
              </div>
            )}
            {tableState.items && tableState.items.map(this.renderDimzouRow)}
            {tableState.items && tableState.items.length === 0 && (
              <div style={{ padding: 12 }}>
                {formatMessage(commonMessages.noContentHint)}
              </div>
            )}
            {tableState.next && (
              <Button disabled={tableState.loading} block onClick={this.fetchData}>
                {formatMessage(commonMessages.loadMore)}
              </Button>
            )}
          </div>
          
        </div>
      )
    }
}

DimzouTable.propTypes = {
  tableState: PropTypes.object,
  intl: PropTypes.object,
  router: PropTypes.object,
  fetchData: PropTypes.func,
  deleteBundle: PropTypes.func,
  currentUser: PropTypes.object,
}

const mapStateToProps = createStructuredSelector({
  tableState: selectTableState,
  currentUser: selectCurrentUser,
})

const withConnect = connect(mapStateToProps, {
  fetchData: asyncFetchDimzouList,
  deleteBundle: asyncDeleteBundle,
})

export default compose(
  injectIntl, 
  withRouter, 
  withConnect
)(DimzouTable);