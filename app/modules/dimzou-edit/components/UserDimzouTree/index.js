import React, { useContext, useRef, useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { injectIntl } from 'react-intl';
import get from 'lodash/get';
import Router from 'next/router';
import TextInput from '@feat/feat-ui/lib/text-input';
import ButtonBase from '@feat/feat-ui/lib/button/ButtonBase';
import Loader from '@feat/feat-ui/lib/loader';

import { selectCurrentUser } from '@/modules/auth/selectors';

import TranslatableMessage from '@/modules/language/containers/TranslatableMessage';
import ScrollBox from '@/components/ScrollBox';
import { useScrollControl, useCachedState } from '@/utils/hooks';

import Icon from '../Icon';
import BundleNode from './BundleNode';
import ScrollNavigator from '../ScrollNavigator';

import intlMessages, { bundleStatus as statusMessages } from '../../messages';

import './style.scss';
import { WorkshopContext, AppContext } from '../../context';
import styles from '../Explorer/index.module.scss';

const expandedCaches = {
  data: {},
  get(userId) {
    if (!this.data[userId]) {
      this.data[userId] = {
        data: {},
        get(key) {
          return this.data[key];
        },
        set(key, value) {
          this.data[key] = value;
        },
      };
    }
    return this.data[userId];
  },
};

let navigateTimer;
let isRouteReady = true;
const KEYBOARD_ACTION_TIMEOUT = 300;

Router.events.on('routeChangeStart', () => {
  isRouteReady = false;
});
Router.events.on('routeChangeComplete', () => {
  setTimeout(() => {
    isRouteReady = true; // NOTE: fake ready, page content may not actually ready.
  }, 1000);
});
// 路由未准备好时，不执行动作
const composeAction = (fn) => (...args) => {
  if (isRouteReady) {
    fn(...args);
  }
};
const getActiveNode = () =>
  document.querySelector(`.${styles.node}.${styles.isActive}`);

const getNodes = () => [...document.querySelectorAll(`.${styles.node}`)];
const pathToHref = (path) => {
  const [, view, bundleId, nodeId] = path.split('/');
  return {
    pathname: '/dimzou-edit',
    query: {
      pageName: view === 'draft' ? 'draft' : 'view',
      bundleId,
      nodeId,
    },
  };
};

const getOffsetTop = (el, container) => {
  let dom = el;
  let val = 0;
  while (container.contains(dom) && container !== dom) {
    val += dom.offsetTop;
    dom = dom.offsetParent;
  }
  return val;
};

const canToggle = (dom) => dom.dataset.type === 'collection';
const isExpanded = (dom) => dom.dataset.isExpanded === 'true';
const getToggle = (dom) => dom.querySelector(`.${styles.node__icon}`);

const closeCollection = () => {
  const activeNode = getActiveNode();
  if (!activeNode) {
    return undefined;
  }
  if (canToggle(activeNode) && isExpanded(activeNode)) {
    const toggle = getToggle(activeNode);
    toggle?.click();
  }
  return setTimeout(
    composeAction(() => {
      activeNode.click();
    }),
    KEYBOARD_ACTION_TIMEOUT,
  );
};

const expandCollection = () => {
  const activeNode = getActiveNode();
  if (!activeNode) {
    return undefined;
  }
  if (canToggle(activeNode) && !isExpanded(activeNode)) {
    const toggle = getToggle(activeNode);
    toggle?.click();
  }
  return setTimeout(
    composeAction(() => {
      activeNode.click();
    }),
    KEYBOARD_ACTION_TIMEOUT,
  );
};

const excepts = [
  '.dz-App__sidebarFirst',
  '.ft-ModalContainer',
  '.dz-ReleasePanelWrap',
];

function UserDimzouTree(props) {
  const appState = useContext(AppContext);
  const workshopState = useContext(WorkshopContext);
  const currentUser = useSelector(selectCurrentUser);
  const scrollBoxWrap = useRef(null);
  const { classified } = workshopState;
  const expandedCache = expandedCaches.get(workshopState.userId);
  const { formatMessage } = props.intl;
  const { setScroll } = useScrollControl(
    scrollBoxWrap,
    `dimzou_user_related_${workshopState.userId}`,
  );
  const [hasFocus, setHasFocus] = useCachedState('dimzou-tree', false);
  const scrollActiveItemIntoView = useCallback(
    () => {
      const currentItem =
        scrollBoxWrap.current &&
        scrollBoxWrap.current.querySelector(`.${styles.isActive}`);
      if (currentItem) {
        const offsetTop = getOffsetTop(currentItem, scrollBoxWrap.current);
        const boxHeight = scrollBoxWrap.current.clientHeight;
        const boxScrollTop = scrollBoxWrap.current.scrollTop;
        const delta = offsetTop - boxScrollTop;

        const isVisible = delta > 0 && delta < boxHeight;
        if (!isVisible) {
          setScroll({
            left: 0,
            top: offsetTop - 50,
          });
        }
      }
    },
    [classified],
  );

  const dataLength = get(workshopState, 'data.length');
  useEffect(
    () => {
      if (dataLength) {
        scrollActiveItemIntoView();
      }
    },
    [dataLength || 0],
  );

  const toPrevNode = useCallback((timeout = 0, tailing = true) => {
    if (!isRouteReady) {
      return undefined;
    }
    const nodes = getNodes();
    const activeNode = getActiveNode();
    const index = nodes.findIndex((n) => n === activeNode);
    const nextActiveNode = nodes[index - 1];
    if (nextActiveNode) {
      requestAnimationFrame(() => {
        activeNode && activeNode.classList.remove(styles.isActive);
        nextActiveNode && nextActiveNode.classList.add(styles.isActive);
        // nextActiveNode.scrollIntoView();
      });
      // 向前移动时，保证当前 activeNode 在视图内
      const container = scrollBoxWrap.current;
      if (container) {
        const offsetTop = getOffsetTop(nextActiveNode, container);
        const boxScrollTop = container.scrollTop;
        const delta = offsetTop - boxScrollTop;
        const headerHeight = container.querySelector(
          '.dz-DraftsPanelSubSection__header',
        ).clientHeight;
        if (delta < headerHeight) {
          // sticky element;
          setScroll({
            left: 0,
            top: offsetTop - headerHeight,
          });
        }
      }
      // 异步模拟点击。因为页面跳转时有阻塞
      return setTimeout(
        composeAction(() => {
          // 如果是从 header 到 node 则不实用 '#tailing';
          if (
            tailing === false ||
            (activeNode.dataset.type === 'header' &&
              nextActiveNode.dataset.type === 'leaf')
          ) {
            nextActiveNode.click();
          } else {
            const href = {
              ...pathToHref(nextActiveNode.getAttribute('href')),
              hash: '#tailing',
            };
            Router.push(href, `${nextActiveNode.getAttribute('href')}#tailing`);
          }
          // nextActiveNode.click();
        }),
        timeout,
      );
    }
    return undefined;
  }, []);

  // 当进行滚动切换时，最小单位为 node
  const toNextNode = useCallback((timeout = 0, trigger = 'scroll') => {
    if (!isRouteReady) {
      return undefined;
    }
    const nodes = getNodes();
    const activeNode = getActiveNode();
    const index = nodes.findIndex((n) => n === activeNode);
    let nextActiveNode = null;
    let i = 1;
    do {
      nextActiveNode = nodes[index + i];
      if (!nextActiveNode) {
        break;
      }
      if (trigger !== 'scroll') {
        break;
      }
      if (nextActiveNode.dataset.type !== 'header') {
        break;
      }
      i += 1;
    } while (nextActiveNode);
    if (nextActiveNode) {
      requestAnimationFrame(() => {
        activeNode && activeNode.classList.remove(styles.isActive);
        nextActiveNode && nextActiveNode.classList.add(styles.isActive);
        const container = scrollBoxWrap.current;
        if (container) {
          const nextActiveNodeOffsetTop = getOffsetTop(
            nextActiveNode,
            container,
          );

          // activeNode 底部位置与 容器底部之间的距离
          const bottomOffset =
            nextActiveNodeOffsetTop +
            nextActiveNode.clientHeight -
            container.scrollTop -
            container.clientHeight;

          if (bottomOffset > 0) {
            setScroll({
              left: 0,
              top:
                nextActiveNodeOffsetTop +
                nextActiveNode.clientHeight -
                container.clientHeight,
            });
            return;
          }
          const headerHeight = container.querySelector(
            '.dz-DraftsPanelSubSection__header',
          ).clientHeight;
          const topOffset =
            nextActiveNodeOffsetTop - container.scrollTop - headerHeight;
          if (topOffset < 0) {
            setScroll({
              left: 0,
              top: nextActiveNodeOffsetTop - headerHeight,
            });
          }
        }
      });

      // 异步模拟点击。因为页面跳转时有阻塞
      return setTimeout(
        composeAction(() => {
          nextActiveNode.click();
        }),
        timeout,
      );
    }
    return undefined;
  }, []);

  // handleFocusEvent
  useEffect(
    // eslint-disable-next-line consistent-return
    () => {
      const dom = scrollBoxWrap.current;
      if (hasFocus) {
        const handleClickOutside = (e) => {
          if (hasFocus && dom && !dom.contains(e.target)) {
            setHasFocus(false);
          }
        };

        const handleSidebarNavigate = (e) => {
          if (
            e.key === 'ArrowUp' ||
            e.key === 'ArrowDown' ||
            e.key === 'ArrowLeft' ||
            e.key === 'ArrowRight'
          ) {
            e.preventDefault();
            clearTimeout(navigateTimer);
          }
          if (!isRouteReady) {
            return;
          }
          if (e.key === 'ArrowUp') {
            navigateTimer = toPrevNode(KEYBOARD_ACTION_TIMEOUT, false);
          } else if (e.key === 'ArrowDown') {
            navigateTimer = toNextNode(KEYBOARD_ACTION_TIMEOUT, 'keyboard');
          } else if (e.key === 'ArrowLeft') {
            closeCollection();
          } else if (e.key === 'ArrowRight') {
            expandCollection();
          }
        };

        window.addEventListener('click', handleClickOutside);
        window.addEventListener('keydown', handleSidebarNavigate);
        return () => {
          window.removeEventListener('click', handleClickOutside);
          window.removeEventListener('keydown', handleSidebarNavigate);
        };
      }
    },
    [hasFocus, scrollBoxWrap.current],
  );

  return (
    <ScrollNavigator
      container=".dz-App" // 仅平面层次中滚动触发计算
      navTriggerLimit={30}
      onToPrev={toPrevNode}
      onToNext={toNextNode}
      excepts={excepts}
      disabled={appState.pageName === 'create'}
    >
      <div className="dz-DraftsPanel">
        <div className="dz-DraftsPanel__header">
          <div className="dz-DraftsPanel__searchBar">
            <TextInput
              value={workshopState.filter}
              onChange={(e) => {
                workshopState.updateFilter(e.target.value);
              }}
              placeholder={formatMessage(intlMessages.workshopFilterHint)}
            />
          </div>
          <div className="dz-DraftsPanel__focus">
            <ButtonBase onClick={scrollActiveItemIntoView}>
              <Icon name="focus" className="size_xs" />
            </ButtonBase>
          </div>
        </div>
        {workshopState.loading && (
          <div className="dz-DraftsPanel__loadingHint">
            <Loader size="xs" />
          </div>
        )}
        <ScrollBox
          className="dz-DraftsPanel__content"
          hasMore={!!workshopState.next}
          loading={workshopState.loading}
          stopScrollPropagation
          ref={(n) => {
            scrollBoxWrap.current = n;
          }}
          onClick={() => {
            if (!hasFocus) {
              setHasFocus(true);
            }
          }}
        >
          {classified.hasCreated && (
            <div className="dz-DraftsPanelSection">
              {classified.created.published &&
                !!classified.created.published.length && (
                  <div className="dz-DraftsPanelSubSection">
                    <div className="dz-DraftsPanelSubSection__header">
                      <TranslatableMessage message={statusMessages.published} />
                    </div>
                    <div>
                      {classified.created.published.map((b) => (
                        <BundleNode
                          type="publication"
                          currentUser={currentUser}
                          data={b}
                          key={b.id}
                          expanded={expandedCache.get(`publication_${b.id}`)}
                          cacheExpanded={(expanded) =>
                            expandedCache.set(`publication_${b.id}`, expanded)
                          }
                        />
                      ))}
                    </div>
                  </div>
                )}
              {classified.created.draft &&
                !!classified.created.draft.length && (
                  <div className="dz-DraftsPanelSubSection">
                    <div className="dz-DraftsPanelSubSection__header">
                      <TranslatableMessage message={statusMessages.draft} />
                    </div>
                    <div>
                      {classified.created.draft.map((b) => (
                        <BundleNode
                          currentUser={currentUser}
                          data={b}
                          key={b.id}
                          expanded={expandedCache.get(`draft_${b.id}`)}
                          cacheExpanded={(expanded) =>
                            expandedCache.set(`draft_${b.id}`, expanded)
                          }
                        />
                      ))}
                    </div>
                  </div>
                )}
              {classified.created.published &&
                !!classified.created.published.length && (
                  <div className="dz-DraftsPanelSubSection">
                    <div className="dz-DraftsPanelSubSection__header">
                      <TranslatableMessage message={statusMessages.archived} />
                    </div>
                    <div className="dz-DraftsPanelSubSection__content dz-DraftsPanelSubSection__content_archived">
                      {classified.created.published.map((b) => (
                        <BundleNode
                          currentUser={currentUser}
                          data={b}
                          key={b.id}
                          expanded={expandedCache.get(`draft_${b.id}`)}
                          cacheExpanded={(expanded) =>
                            expandedCache.set(`draft_${b.id}`, expanded)
                          }
                        />
                      ))}
                    </div>
                  </div>
                )}
            </div>
          )}
          {classified.hasParticipated && (
            <div className="dz-DraftsPanelSection">
              <div className="dz-DraftsPanelSection__header">
                <TranslatableMessage message={intlMessages.participatedLabel} />
              </div>
              {classified.participated.published &&
                !!classified.participated.published.length && (
                  <div className="dz-DraftsPanelSubSection">
                    <div className="dz-DraftsPanelSubSection__header">
                      <TranslatableMessage message={statusMessages.published} />
                    </div>
                    <div>
                      {classified.participated.published.map((b) => (
                        <BundleNode
                          type="publication"
                          showRoleOfUser={workshopState.userId}
                          currentUser={currentUser}
                          data={b}
                          key={b.id}
                          expanded={expandedCache.get(`publication_${b.id}`)}
                          cacheExpanded={(expanded) =>
                            expandedCache.set(`publication_${b.id}`, expanded)
                          }
                        />
                      ))}
                    </div>
                  </div>
                )}
              {classified.participated.draft &&
                !!classified.participated.draft.length && (
                  <div className="dz-DraftsPanelSubSection">
                    <div className="dz-DraftsPanelSubSection__header">
                      <TranslatableMessage message={statusMessages.draft} />
                    </div>
                    <div>
                      {classified.participated.draft.map((b) => (
                        <BundleNode
                          showRoleOfUser={workshopState.userId}
                          currentUser={currentUser}
                          data={b}
                          key={b.id}
                          expanded={expandedCache.get(`draft_${b.id}`)}
                          cacheExpanded={(expanded) =>
                            expandedCache.set(`draft_${b.id}`, expanded)
                          }
                        />
                      ))}
                    </div>
                  </div>
                )}
            </div>
          )}
        </ScrollBox>
      </div>
    </ScrollNavigator>
  );
}

UserDimzouTree.propTypes = {
  intl: PropTypes.object,
};

export default injectIntl(UserDimzouTree);
