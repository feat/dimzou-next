import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Link as ScrollLink, Element, Events } from 'react-scroll';

import Link from 'next/link';
import BackButton from '@/components/BackButton';

import {
  NODE_TYPE_CHAPTER,
  NODE_TYPE_COVER,
  NODE_STATUS_PUBLISHED,
} from '@/modules/dimzou-edit/constants';

import TranslatableMessage from '@/modules/language/containers/TranslatableMessage';

import LazyLoad, {
  forceCheck,
  setVisibleCheck,
} from '@feat/feat-ui/lib/lazy-load';
// import Sticky from '@feat/feat-ui/lib/sticky';
import Block from '@feat/feat-ui/lib/block';
import notification from '@feat/feat-ui/lib/notification';
import TemplateIV from '@/modules/dimzou-edit/components/Template/TemplateIV';

import ViewWork from '../ViewWork';
import CoverView from '../CoverView';
import NodePlaceholder from '../NodePlaceholder';

import intlMessages from '../../messages';

import './style.scss';

const DELTA = 50;

class BookView extends React.Component {
  componentWillMount() {
    setVisibleCheck(false);
  }

  componentDidMount() {
    Events.scrollEvent.register('begin', () => {
      setVisibleCheck(false);
    });
    Events.scrollEvent.register('end', () => {
      setVisibleCheck(true);
      forceCheck();
    });
    const { nodeId } = this.props;
    if (nodeId) {
      const dom = document.querySelector(`[name="node_${nodeId}"]`);
      if (dom) {
        const box = dom.getBoundingClientRect();
        // logging.debug(box);
        window.scrollTo(0, box.top);
      }
    }
    setVisibleCheck(true);
    forceCheck();
    if (typeof window === 'object') {
      window.addEventListener('scroll', this.syncLocation);
    }
  }

  componentWillUnmount() {
    if (typeof window === 'object') {
      window.removeEventListener('scroll', this.syncLocation);
    }
    Events.scrollEvent.remove('begin');
    Events.scrollEvent.remove('end');
  }

  fetchNodePublication = (nodeId) => {
    const { bundleId } = this.props;
    this.props
      .fetchNodePublication({ bundleId, data: { nodeId } })
      .catch((err) => {
        notification.error({
          message: 'Error',
          description: err.message,
        });
      });
  };

  syncLocation = () => {
    const { pathname } = window.location;
    const dom = document.querySelector(`[data-link="${pathname}"]`);
    if (!dom) {
      return;
    }
    const box = dom.getBoundingClientRect();
    const viewportHeight =
      window.innerHeight || document.documentElement.clientHeight;
    const shouldUpdatePathname = box.top > viewportHeight || box.bottom < DELTA;
    if (shouldUpdatePathname) {
      const items = document.querySelectorAll('[data-link]');
      Array.prototype.some.call(items, (item) => {
        const itemBox = item.getBoundingClientRect();
        if (
          (itemBox.top > DELTA && itemBox.top < viewportHeight) ||
          (itemBox.bottom > DELTA && itemBox.bottom < viewportHeight) ||
          (itemBox.top < DELTA && itemBox.bottom > viewportHeight)
        ) {
          window.history.replaceState(null, undefined, item.dataset.link);
          return true;
        }
        return false;
      });
    }
  };

  renderCoverView(item) {
    const { loaded, bundleId } = this.props;
    const publicationId = loaded[item.id];
    return (
      <CoverView
        publicationId={publicationId}
        bundleId={bundleId}
        loader={() => this.fetchNodePublication(item.id)}
      />
    );
  }

  renderSidebarFirst() {
    const { nodes } = this.props;
    const coverNode = nodes.find((item) => item.node_type === NODE_TYPE_COVER);
    const chapterNodes = nodes.filter(
      (item) => item.node_type === NODE_TYPE_CHAPTER,
    );
    return (
      // <Sticky top="#header" bottomBoundary={`#node_${nodeId}`}>
      <div className="dz-TemplateIV__sidebarFirst dz-Book__sidebarFirst">
        <Block
          className="padding_t_12"
          title={
            <ScrollLink to={`node_${coverNode.id}`} spy smooth offset={-60}>
              {coverNode.text_title}
            </ScrollLink>
          }
        >
          {chapterNodes.map((item) => (
            <div key={item.id}>
              <ScrollLink
                className={classNames(
                  'ft-Button ft-Button_anchor dz-Book__sidebarOption',
                  // {
                  //   'is-selected': item.id === nodeId,
                  // },
                )}
                to={`node_${item.id}`}
                spy
                smooth
                offset={-60}
              >
                {item.text_title}
              </ScrollLink>
            </div>
          ))}
        </Block>
      </div>
      // </Sticky>
    );
  }

  renderNode(item) {
    const { bundleId, loaded } = this.props;
    if (item.node_type === NODE_TYPE_COVER) {
      return (
        <TemplateIV
          // sidebarFirst={this.renderSidebarFirst(item.id)}
          main={this.renderCoverView(item)}
        />
      );
    }
    const publicationId = loaded[item.id];

    if (item.status !== NODE_STATUS_PUBLISHED && !publicationId) {
      return (
        <TemplateIV
          // sidebarFirst={this.renderSidebarFirst(item.id)}
          main={
            <NodePlaceholder
              data-link={`/dimzou/${bundleId}/${item.id}`}
              title={item.text_title}
              summary={item.text_summary}
              action={
                <Link
                  href={{
                    pathname: 'dimzou-edit',
                    query: { bundleId, nodeSrot: item.sort },
                  }}
                  as={`/draft/${bundleId}/${item.sort}`}
                >
                  <a
                    className="ft-Button ft-Button_primary ft-Button_md"
                    style={{ paddingLeft: '24px', paddingRight: '24px' }}
                  >
                    <TranslatableMessage message={intlMessages.joinEditing} />
                  </a>
                </Link>
              }
            />
          }
        />
      );
    }

    return (
      <ViewWork
        publicationId={publicationId}
        nodeSort={item.sort}
        isBook
        // sidebarFirst={this.renderSidebarFirst(item.id)}
        loader={() => this.fetchNodePublication(item.id)}
        loading={
          <TemplateIV
            // sidebarFirst={this.renderSidebarFirst(item.id)}
            main={
              <NodePlaceholder
                title={item.text_title}
                summary={item.text_summary}
                status={<TranslatableMessage message={intlMessages.loading} />}
              />
            }
          />
        }
      />
    );
  }

  render() {
    const { nodes } = this.props;
    return (
      <div>
        {this.renderSidebarFirst()}
        {nodes.map((item) => (
          <Element
            name={`node_${item.id}`}
            key={item.id}
            id={`node_${item.id}`}
            className="dz-Book__section"
          >
            <LazyLoad
              height={typeof window === 'object' ? window.innerHeight : 1000}
            >
              {this.renderNode(item)}
            </LazyLoad>
          </Element>
        ))}
        <BackButton  />
      </div>
    );
  }
}

BookView.propTypes = {
  bundleId: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
  nodeId: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
  nodes: PropTypes.array,
  loaded: PropTypes.object,
  fetchNodePublication: PropTypes.func.isRequired,
};

export default BookView;
