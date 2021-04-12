import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Link from 'next/link';
import get from 'lodash/get';
import SplashView from '@/components/SplashView';
import AvatarStamp from '@/containers/AvatarStamp';

import TranslatableMessage from '@/modules/language/containers/TranslatableMessage';
import {
  dimzouBundleDesc as dimzouBundleDescSchema,
  dimzouNodeDesc as dimzouNodeDescSchema,
} from '../../../schema';

import { getAsPath } from '../../../utils/router';
import {
  BUNDLE_STATUS_PUBLISHED,
  BUNDLE_STATUS_DRAFT,
  NODE_TYPE_CHAPTER,
} from '../../../constants';
import intlMessages from './messages';

import CollaboratorBlock from './CollaboratorBlock';

/**
 * 需要从 props 中判断 资源类型，并根据不同的资源类型渲染页面
 */
class Detail extends React.PureComponent {
  getTitle() {
    const { nodeDesc } = this.props;

    return nodeDesc?.text_title;
  }

  getSummary() {
    const { nodeDesc } = this.props;
    return nodeDesc?.text_summary;
  }

  renderBreadcrumb() {
    const { nodeDesc, bundleDesc } = this.props;
    const dashHref = {
      pathname: '/dimzou-edit',
      query: {
        pageName: 'dashboard',
        userId: this.props.userId,
      },
    };

    const els = [
      <li className="breadcrumb__item" key="dash">
        <Link href={dashHref} as={getAsPath(dashHref)}>
          <a>
            <TranslatableMessage message={intlMessages.dashboard} />
          </a>
        </Link>
      </li>,
    ];

    if (bundleDesc.is_multi_chapter) {
      if (nodeDesc.node_type === NODE_TYPE_CHAPTER) {
        const coverHref = {
          pathname: '/dimzou-edit',
          query: {
            pageName: 'dashboard',
            userId: this.props.userId,
            type: 'detail',
            bundleId: bundleDesc.id,
            nodeId: bundleDesc.nodes[0],
          },
        };
        els.push(
          <li
            className="breadcrumb__item is-active"
            aria-current="page"
            key={bundleDesc.nodes[0]}
          >
            <Link href={coverHref} as={getAsPath(coverHref)}>
              <a>{bundleDesc.title}</a>
            </Link>
          </li>,
        );
      }
    }

    els.push(
      <li
        className="breadcrumb__item is-active"
        aria-current="page"
        key={nodeDesc.id}
      >
        {this.getTitle()}
      </li>,
    );

    return (
      <div style={{ paddingLeft: 20, paddingRight: 20 }}>
        <ol className="breadcrumb">{els}</ol>
      </div>
    );
  }

  renderEditLink() {
    const { bundleId, nodeId } = this.props;
    const href = {
      pathname: '/dimzou-edit',
      query: {
        pageName: 'draft',
        bundleId,
        nodeId,
      },
    };
    const as = getAsPath(href);
    return (
      <Link as={as} href={href}>
        <a>
          <TranslatableMessage message={intlMessages.edit} />
        </a>
      </Link>
    );
  }

  renderReadLink() {
    const { bundleId, nodeId } = this.props;
    const href = {
      pathname: '/dimzou-edit',
      query: {
        pageName: 'view',
        bundleId,
        nodeId,
      },
    };
    const as = getAsPath(href);
    return (
      <Link as={as} href={href}>
        <a>
          <TranslatableMessage message={intlMessages.view} />
        </a>
      </Link>
    );
  }

  render() {
    const { bundleDesc, nodeDesc } = this.props;

    if (!bundleDesc || !nodeDesc) {
      return <SplashView />;
    }

    return (
      <div className="dz-ResourceStatistics">
        {this.renderBreadcrumb()}
        <div className="dz-ResourceStatistics__content">
          <div className="dz-ResourceBasic dz-ResourceStatistics__block">
            <div className="dz-ResourceBasic__main">
              <h1 className="dz-ResourceBasic__title">{this.getTitle()}</h1>
              <div className="dz-ResourceBasic__avatar">
                <AvatarStamp {...nodeDesc.user} />
              </div>
              <div className="dz-ResourceBasic__summary">
                {this.getSummary()}
              </div>
            </div>
            <div className="dz-ResourceBasic__data">
              <ul style={{ marginTop: 40 }}>
                {bundleDesc?.status === BUNDLE_STATUS_PUBLISHED && (
                  <li>{this.renderReadLink()}</li>
                )}
                {bundleDesc?.status === BUNDLE_STATUS_DRAFT && (
                  <li>{this.renderEditLink()}</li>
                )}
              </ul>
            </div>
          </div>

          {nodeDesc?.collaborators && (
            <CollaboratorBlock data={nodeDesc.collaborators} />
          )}
          {/* <Block title="基本情况" className="dz-ResourceStatistics__block">
            TODO
          </Block>
          <Block title="阅读倾向" className="dz-ResourceStatistics__block">
            TODO： 需要统计数据 - 用户停留时间 - 用户到哪些地方去了 -
          </Block> */}
        </div>
      </div>
    );
  }
}

Detail.propTypes = {
  bundleDesc: PropTypes.object,
  nodeDesc: PropTypes.object,
  bundleId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  nodeId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  userId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
};

const mapStateToProps = (state, props) => ({
  bundleDesc: get(state, [
    'entities',
    dimzouBundleDescSchema.key,
    props.bundleId,
  ]),
  nodeDesc: get(state, ['entities', dimzouNodeDescSchema.key, props.nodeId]),
});

const withConnect = connect(mapStateToProps);

export default withConnect(Detail);
