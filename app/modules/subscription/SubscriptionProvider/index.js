/* eslint-disable react/no-unused-state */
import React from 'react';
import PropTypes from 'prop-types';
import Router from 'next/router';

import notification from '@feat/feat-ui/lib/notification';

import {
  subscribe,
  unsubscribe,
  fetchSubscriptions,
} from '../requests'

export const SubscriptionContext = React.createContext({
  data: { isReady: false },
})


export default class SubscriptionProvider extends React.PureComponent {
    state = {
      data: [],
      users: {},
      categories: {},
      isReady: false,
    }

    componentDidMount() {
      if (this.props.hasAuthedUser) {
        fetchSubscriptions().then(({ data }) => {
          logging.debug(data);
          const users = {};
          const categories = {};
          for (let i = 0; i < data.length; i+=1) {
            const record = data[i];
            switch (record.subscription_type) {
              case 'follow_user':
                users[`${record.followed_user.uid}_${record.entity_type}`] = true;
                break;
              case 'follow_category':
                categories[`${record.follow_category}_${record.entity_type}`] = true;
                break;
              default:
                logging.warn(`Unknown subscription type: ${record.subscription_type}`);
            }
          }
          this.setState({
            data,
            users,
            categories,
            isReady: true,
          })
        }).catch((err) => {
          notification.error({
            message: 'Error',
            description: err.message,
          })
        })
      }
    }

    redirect () {
      Router.push({
        pathname: '/auth/login',
        query: {
          redirect: window.location.pathname,
        },
      })
    }

    getRequestParams(data)  {
      const params = {};
      switch (data.type) {
        case 'user':
          params.subscription_type = 'follow_user';
          params.followed_user_uid = data.targetId;
          params.entity_type = data.entityType;
          return params;
        case 'category':
          params.subscription_type = 'follow_category';
          params.followed_category_id = data.targetId;
          params.entity_type = data.entityType;
          return params;
        default: 
          return null;
      }
    }

    subscribe = (data) => {
      if (!this.props.hasAuthedUser) {
        this.redirect();
        return Promise.resolve();
      }
      const params = this.getRequestParams(data);
      return subscribe(params).then(({ data: resData }) => {
        logging.debug(resData);
        if (data.type === 'user') {
          const users = {
            ...this.state.users,
            [`${data.targetId}_${data.entityType}`]: true,
          };
          this.setState({
            data: [
              ...this.state.data,
              resData,
            ],
            users,
          })
          return;
        }
        if (data.type === 'follow_category') {
          // TODO
        }
      }).catch((err) => {
        notification.error({
          message: 'Error',
          description: err.message,
        })
      })
    }

    unsubscribe = (data) => {
      const params = this.getRequestParams(data);
      return unsubscribe(params).then(() => {
        if (data.type === 'user') {
          const list = this.state.data.filter((item) => !item.followed_user || item.followed_user.uid !== data.targetId)
          const users = {
            ...this.state.users,
          };
          delete users[`${data.targetId}_${data.entityType}`];
          this.setState({
            data: list,
            users,
          })
          return;
        }
        if (data.type === 'follow_category') {
          // TODO
        }
      }).catch((err) => {
        notification.error({
          message: 'Error',
          description: err.message,
        })
      })
    }

    checkSubscribed = (data) => {
      switch (data.type) {
        case 'user': 
          return this.state.users[`${data.targetId}_${data.entityType}`]
        case 'category':
          return this.state.categories[`${data.targetId}_${data.entityType}`]
        default: 
          return false;
      }
    }

    render() {
      return (
        <SubscriptionContext.Provider
          value={{
            data: this.state,
            subscribe: this.subscribe,
            unsubscribe: this.unsubscribe,
            checkSubscribed: this.checkSubscribed,
          }} 
        >
          {this.props.children}
        </SubscriptionContext.Provider>
      )
    }
}

SubscriptionProvider.propTypes = {
  children: PropTypes.any,
  hasAuthedUser: PropTypes.bool,
}