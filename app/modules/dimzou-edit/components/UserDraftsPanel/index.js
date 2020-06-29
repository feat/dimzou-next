import React, { useEffect, useMemo, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import classNames from 'classnames';
// import className from 'classnames';
import get from 'lodash/get';
import PropTypes from 'prop-types'
import groupBy from 'lodash/groupBy';

import { formatMessage } from '@/services/intl';
import { selectCurrentUser } from '@/modules/auth/selectors';
import { selectUsername } from '@/modules/user/selectors';

import IconButton from '@feat/feat-ui/lib/button/IconButton';
import Tooltip from '@feat/feat-ui/lib/tooltip';
import TranslatableMessage from '@/modules/language/containers/TranslatableMessage';
import ScrollBox from '@/components/ScrollBox';

import BundleNode from './BundleNode';

import { selectUserDraftsState } from '../../selectors';
// import { WorkspaceContext } from '../../context';
import { 
  // initCreateChapter, 
  // exitCreateChapter,
  // initCreateCover,
  // exitCreateCover,
  asyncFetchUserDrafts,
  showCurrentUserDrafts,
} from '../../actions';

import dimzouSocket from '../../socket';

// import pageIcon from '../../assets/icon-page.svg';
// import bookIcon from '../../assets/icon-book.svg';
import backIcon from '../../assets/icon-back.svg';
import intlMessages, { bundleStatus as statusMessages } from '../../messages'
import {  ROLE_OWNER } from '../../constants';
import { groupByStatus } from '../../utils/bundle';

import './style.scss';

const PAGE_SIZE = 999;

function UserDraftsPanel(props) {
  const { expandedCache } = props;
  const userDraftsState = useSelector(selectUserDraftsState);
  // const workspace = useContext(WorkspaceContext);
  const currentUser = useSelector(selectCurrentUser);
  const dispatch = useDispatch();
  const scrollBoxWrap = useRef(null);

  useEffect(() => {
    if(currentUser.uid && !userDraftsState.onceFetched && !userDraftsState.loading) {
      dispatch(asyncFetchUserDrafts({
        pageSize: PAGE_SIZE,
      }));
    }
    if (currentUser.uid) {
      dimzouSocket.private(`dimzou-user-${currentUser.uid}`);
    }
  }, []);

  const backUsername = useSelector((state) => selectUsername(state, { userId: props.backUserId }));

  const { data, loaded, ids } = userDraftsState;

  const bundleNodes = useMemo(() => {
    const extraNodes = loaded.filter((item) => !ids[item.id]);
    const flatNodes = data ? data.reduce((els, bundle) => els.concat(bundle, bundle.all_copies ? bundle.all_copies : [] ), []) : [];
    return [
      ...extraNodes,
      ...flatNodes,
    ]
  }, [data, loaded]);

  const classified = useMemo(() => {
    const roleGrouped = groupBy(bundleNodes, (bundle) => {
      const collaborators = get(bundle, 'nodes.0.collaborators');
      if (collaborators) {
        const info = collaborators.find((item) => item.user && item.user.uid === currentUser.uid);
        if (info && info.role === ROLE_OWNER) {
          return 'created';
        } 
        return 'participated';
      }
      if (bundle.user && bundle.user.uid === currentUser.uid) {
        return 'created'
      }
      return 'participated';
    });
    const output = {};
    Object.keys(roleGrouped).forEach((key) => {
      output[key] = groupByStatus(roleGrouped[key]);
    });
    if (roleGrouped.created && roleGrouped.created.length) {
      output.hasCreated = true;
    }
    if (roleGrouped.participated && roleGrouped.participated.length) {
      output.hasParticipated = true;
    }
    return output;
  }, [bundleNodes, currentUser.uid]);

  useEffect(() => {
    const currentItem = scrollBoxWrap.current && scrollBoxWrap.current.querySelector('.is-current');
    if (currentItem) {
      const { offsetTop } = currentItem;
      const boxHeight = scrollBoxWrap.current.clientHeight;
      const boxScrollTop = scrollBoxWrap.current.scrollTop;
      const delta = offsetTop - boxScrollTop;
      const isVisible = delta > 0 && delta < boxHeight;
      if (!isVisible) {
        const scrollOffset = offsetTop - 30; // 30 --> sticky item height
        requestAnimationFrame(() => {
          if (scrollBoxWrap.current) {
            scrollBoxWrap.current.scrollTop = scrollOffset;
          }
        })
      }
    }
  }, [data ? data.length : 0]);

  const backButton = props.showBackBtn ? (
    <Tooltip
      placement="top"
      trigger="hover"
      title={formatMessage(intlMessages.userCreatedPanel, { username: backUsername })}
      overlayStyle={{ zIndex: 9 }}
    >
      <IconButton 
        onClick={() => {
          dispatch(showCurrentUserDrafts(false));
        }}
        dangerouslySetInnerHTML={{ __html: backIcon }}
      />
    </Tooltip>
  ) : null;

  const shouldRender = data || loaded.length;
  
  if (!shouldRender) {
    return null;
  } 
  return (
    <div 
      ref={props.domRef}
      className='dz-DraftsPanel'
    >
      <div
        className={
          classNames("dz-DraftsPanel__header", {
            'has-border': !!backButton,
          })
        }>
        <div className="dz-DraftsPanel__actions">
          {backButton}
        </div>
      </div>
      <ScrollBox 
        className="dz-DraftsPanel__content"
        scrollToLoad
        hasMore={!!userDraftsState.next}
        loading={userDraftsState.loading}
        loadMore={() => {
          dispatch(asyncFetchUserDrafts({
            next: userDraftsState.next,
          }));
        }}
        stopScrollPropagation
        scrollCacheKey='dimzou_current_user_drafts'
        ref={(n) => {
          scrollBoxWrap.current = n;
        }}
      >
        {classified.hasCreated && (
          <div className="dz-DraftsPanelSection">
            {classified.created.published && !!classified.created.published.length && (
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
                      cacheExpanded={(expanded) => expandedCache.set(`publication_${b.id}`, expanded)}
                    />
                  ))}
                </div>
              </div>
            )}
            {classified.created.draft && !!classified.created.draft.length && (
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
                      cacheExpanded={(expanded) => expandedCache.set(`draft_${b.id}`, expanded)}
                    />
                  ))}
                </div>
              </div>
            )}
            {classified.created.published && !!classified.created.published.length && (
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
                      cacheExpanded={(expanded) => expandedCache.set(`draft_${b.id}`, expanded)}
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
            {classified.participated.published && !!classified.participated.published.length && (
              <div className="dz-DraftsPanelSubSection">
                <div className="dz-DraftsPanelSubSection__header">
                  <TranslatableMessage message={statusMessages.published} />
                </div>
                <div>
                  {classified.participated.published.map((b) => (
                    <BundleNode 
                      type="publication" 
                      showRoleOfUser={currentUser.uid} 
                      currentUser={currentUser} 
                      data={b} 
                      key={b.id} 
                      expanded={expandedCache.get(`publication_${b.id}`)}
                      cacheExpanded={(expanded) => expandedCache.set(`publication_${b.id}`, expanded)}
                    />
                  ))}
                </div>
              </div>
            )}
            {classified.participated.draft && !!classified.participated.draft.length && (
              <div className="dz-DraftsPanelSubSection">
                <div className="dz-DraftsPanelSubSection__header">
                  <TranslatableMessage message={statusMessages.draft} />
                </div>
                <div>
                  {classified.participated.draft.map((b) => (
                    <BundleNode 
                      showRoleOfUser={currentUser.uid} 
                      currentUser={currentUser} 
                      data={b} 
                      key={b.id} 
                      expanded={expandedCache.get(`draft_${b.id}`)}
                      cacheExpanded={(expanded) => expandedCache.set(`draft_${b.id}`, expanded)}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </ScrollBox>
    </div>
  )
}

UserDraftsPanel.propTypes = {
  showBackBtn: PropTypes.bool,
  backUserId: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string,
  ]),
  domRef: PropTypes.object,
  expandedCache: PropTypes.object,
}

export default UserDraftsPanel;