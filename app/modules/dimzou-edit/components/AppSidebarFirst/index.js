import { useContext, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectCurrentUser } from '@/modules/auth/selectors';

import { WorkspaceContext, OwnerContext } from '../../context'
import { setSidebarHasFocus } from '../../actions'

import UserDraftsPanel from '../UserDraftsPanel';
import UserRelatedDrafts from '../UserRelatedDrafts';

let sidebarFirst;
let navigateTimer;

const handleSidebarNavigate = (e) => {
  if (e.key === 'ArrowUp' || e.key === 'ArrowDown' || e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
    e.preventDefault();
    clearTimeout(navigateTimer);
  }
  const labels = [...document.querySelectorAll('.dz-LabelButton')];
  const activeLabel = document.querySelector('.dz-LabelButton.is-active');
  const index = labels.findIndex((n) => n === activeLabel);
  let nextActiveNode; 
  if (e.key === 'ArrowUp') {
    nextActiveNode = labels[index-1];
    
  } else 
  if (e.key === 'ArrowDown') {
    nextActiveNode = labels[index+1];
  }
  if (nextActiveNode) {
    requestAnimationFrame(() => {
      activeLabel && activeLabel.classList.remove('is-active');
      nextActiveNode && nextActiveNode.classList.add('is-active');
      // nextActiveNode.scrollIntoView();
    })
    // fix off canvas scroll
    const box = nextActiveNode.getBoundingClientRect();
    const container = document.querySelector('.dz-DraftsPanel__content');
    if (container) {
      const containerBox = container.getBoundingClientRect();
      // console.log('fix_offset', container.scrollTop);
      if (e.key === 'ArrowDown') {
        // check bottom edge
        const delta = containerBox.bottom - box.bottom;
        // console.log('fix_offset delta', delta);
        if (delta < 0) {
          container.scrollTo(0, container.scrollTop - delta);
        }  
      }
      if (e.key === 'ArrowUp') {
        // check top edge
        const delta = containerBox.top - box.top;
        // console.log('fix_offset delta', delta);
        if (delta > 0) {
          container.scrollTo(0, container.scrollTop - delta - 30); // has sticky element
        }
      }
    }
    
    // const bundleNode = nextActiveNode.closest('.dz-DraftsPanelNode_bundle');
    // if (bundleNode) {
    //   console.log('fix_offset', bundleNode.offsetTop);  
    // }
    
    navigateTimer = setTimeout(() => {
      nextActiveNode.click();
    }, 300);
  }
  if (e.key === 'ArrowLeft' && activeLabel.dataset.nodeLevel === 'bundle' && activeLabel.dataset.isExpanded === 'true') {
    try {
      const bundleNode = activeLabel.closest('.dz-DraftsPanelNode_bundle');
      const toggleDom = bundleNode && bundleNode.querySelector('.dz-DraftsPanelNode__toggle');
      toggleDom.click();
      if (!bundleNode.classList.contains('is-current')) {
        navigateTimer = setTimeout(() => {
          activeLabel.click();
        }, 300);
      }
    } catch (err) {
      logging.debug(err);
    }
  }
  if (e.key === 'ArrowRight' && activeLabel.dataset.nodeLevel === 'bundle' && activeLabel.dataset.isExpanded === 'false') {
    try {
      const bundleNode = activeLabel.closest('.dz-DraftsPanelNode_bundle');
      const toggleDom = bundleNode && bundleNode.querySelector('.dz-DraftsPanelNode__toggle');
      toggleDom.click();
      if (!bundleNode.classList.contains('is-current')) {
        navigateTimer = setTimeout(() => {
          activeLabel.click();
        }, 300);
      }
    } catch (err) {
      logging.debug(err);
    }
  }
}

function AppSidebarFirst() {
  const { displayCurrentUserDrafts, sidebarHasFocus } = useContext(WorkspaceContext);
  const ownerInfo = useContext(OwnerContext);
  const currentUser = useSelector(selectCurrentUser);
  const domRef = useRef(null);
  const dispatch = useDispatch();

  // eslint-disable-next-line consistent-return
  useEffect(() => {
    if (sidebarHasFocus) {
      document.addEventListener('keydown', handleSidebarNavigate);
      const watchClickOutside = (e) => {
        // console.log('clicked handling');
        if (!domRef.current || domRef.current.contains(e.target)) {
          return;
        }
        dispatch(setSidebarHasFocus(false));
        window.removeEventListener('click', watchClickOutside);
      }
      window.addEventListener('click', watchClickOutside);
    } else {
      document.removeEventListener('keydown', handleSidebarNavigate);
    }
    return () => {
      document.removeEventListener('keydown', handleSidebarNavigate);
    }
  }, [sidebarHasFocus]);

  // eslint-disable-next-line consistent-return
  useEffect(() => {
    if (domRef.current) {
      const handleClick = () => {
        dispatch(setSidebarHasFocus(true));
      }
      domRef.current.addEventListener('click', handleClick);
      return () => {
        domRef.current.removeEventListener('click', handleClick);
      }
    }
  }, [domRef.current]);


  if (!ownerInfo) {
    sidebarFirst = sidebarFirst || <UserDraftsPanel domRef={domRef} />;
  } else if (ownerInfo && ownerInfo.uid !== currentUser.uid) {
    const ownerUserId = ownerInfo.uid;
    if (displayCurrentUserDrafts) {
      sidebarFirst = <UserDraftsPanel domRef={domRef} showBackBtn backUserId={ownerUserId} />;
    } else {
      sidebarFirst = <UserRelatedDrafts domRef={domRef} userId={ownerUserId} />;
    }
  } else {
    sidebarFirst = <UserDraftsPanel domRef={domRef} />;
  }

  return sidebarFirst;
}

export default AppSidebarFirst;