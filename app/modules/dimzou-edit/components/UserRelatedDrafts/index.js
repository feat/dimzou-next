import React, { useEffect, useMemo, useRef } from 'react';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import groupBy from 'lodash/groupBy';
import get from 'lodash/get';
import Link from 'next/link';

import { formatMessage } from '@/services/intl';
import { selectCurrentUser } from '@/modules/auth/selectors';
import { selectUsername } from '@/modules/user/selectors';

import IconButton from '@feat/feat-ui/lib/button/IconButton';
import Tooltip from '@feat/feat-ui/lib/tooltip';
import TranslatableMessage from '@/modules/language/containers/TranslatableMessage';
import ScrollBox from '@/components/ScrollBox';
import SubscribeButton from '@/modules/subscription/SubscribeButton';

import { selectUserRelatedDrafts } from '../../selectors';
import { asyncFetchUserRelated, showCurrentUserDrafts } from '../../actions';
import dimzouSocket from '../../socket';
import BundleNode from '../UserDraftsPanel/BundleNode'
import workshopIcon from '../../assets/icon-workshop.svg';

import intlMessages, { menu as menuMessages, bundleStatus as statusMessages } from '../../messages';
import {  ROLE_OWNER } from '../../constants';
import { groupByStatus } from '../../utils/bundle';
import { SUBSCRIPTION_ENTITY_TYPE_DIMZOU } from '../../../subscription/constants';

const PAGE_SIZE = 999;

function UserRelatedDrafts(props) {
  const { expandedCache } = props;
  const userRelatedDrafts = useSelector((state) => selectUserRelatedDrafts(state, props)) || {};
  const dispatch = useDispatch();
  const currentUser = useSelector(selectCurrentUser);
  const username = useSelector((state) => selectUsername(state, props));
  const scrollBoxWrap = useRef(null);
  useEffect(() => {
    if (!userRelatedDrafts.onceFetched && !userRelatedDrafts.loading) {
      dispatch(asyncFetchUserRelated({ userId: props.userId, pageSize: PAGE_SIZE }));
    }
    dimzouSocket.private(`dimzou-user-${props.userId}`);
  }, [props.userId]);

  const bundleNodes = useMemo(() => {
    const extraNodes = userRelatedDrafts.loaded ? userRelatedDrafts.loaded.filter((item) => !userRelatedDrafts.ids[item.id]) : [];
    const flatNodes = userRelatedDrafts.data ? userRelatedDrafts.data.reduce((els, bundle) => els.concat(bundle, bundle.all_copies ? bundle.all_copies : [] ), []) : [];
    return [
      ...extraNodes,
      ...flatNodes,
    ]
  }, [userRelatedDrafts.data, userRelatedDrafts.loaded])
  
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
  }, [userRelatedDrafts.data ? userRelatedDrafts.data.length : 0]);

  const classified = useMemo(() => {
    const roleGrouped = groupBy(bundleNodes, (bundle) => {
      const collaborators = get(bundle, 'nodes.0.collaborators');
      if (collaborators) {
        const info = collaborators.find((item) => item.user && item.user.uid === props.userId);
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
  }, [bundleNodes]);

  return (
    <div 
      className='dz-DraftsPanel'
      ref={props.domRef}
    >
      <div className="dz-DraftsPanel__header has-border">
        <div className="dz-DraftsPanel__title">
          <Link 
            href={{
              pathname: '/dimzou-edit',
              query: {
                userId: props.userId,
              },
            }}
            as={`/profile/${props.userId}/dimzou`}
          >
            <a>
              <TranslatableMessage 
                message={intlMessages.userCreatedPanel}
                values={{ username: username || props.userId }}
              />
            </a>
          </Link>
          <SubscribeButton 
            style={{ borderRadius: 15, marginLeft: 8 }} 
            type="user"
            targetId={props.userId}
            entityType={SUBSCRIPTION_ENTITY_TYPE_DIMZOU}
          />
        </div>
        <div className="dz-DraftsPanel__actions">
          <Tooltip
            placement="top"
            trigger="hover"
            title={formatMessage(menuMessages.myWorkshop)}
            overlayStyle={{ zIndex: 9 }}
          >
            <IconButton 
              onClick={() => {
                dispatch(showCurrentUserDrafts(true))
              }}
              dangerouslySetInnerHTML={{ __html: workshopIcon }}
            />
          </Tooltip>
        </div>
      </div>
      <ScrollBox 
        className="dz-DraftsPanel__content"
        scrollToLoad
        hasMore={!!userRelatedDrafts.next}
        loading={userRelatedDrafts.loading}
        loadMore={() => {
          dispatch(asyncFetchUserRelated({
            userId: props.userId,
            next: userRelatedDrafts.next,
          }));
        }}
        stopScrollPropagation
        scrollCacheKey={`dimzou_user_related_${props.userId}`}
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
                      showRoleOfUser={props.userId} 
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
                      showRoleOfUser={props.userId} 
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

UserRelatedDrafts.propTypes = {
  userId: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
  domRef: PropTypes.object,
  expandedCache: PropTypes.object,
}

export default UserRelatedDrafts;