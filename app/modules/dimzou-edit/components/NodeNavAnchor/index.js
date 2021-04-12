/**
 * 用于预加载下一章节信息
 */
import React, { useContext, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
// import Link from 'next/link';
// import Router from 'next/router';
import get from 'lodash/get';
// import TranslatableMessage from '@/modules/language/containers/TranslatableMessage';
import { BundleContext, WorkspaceContext } from '../../context';
import { selectNodeState } from '../../selectors';
import { initNodeEdit } from '../../actions';
// import Countdown from './Countdown';
// import intlMessages from '../../messages';
import './style.scss';

function NodeNavAnchor() {
  const bundleState = useContext(BundleContext);
  const workspace = useContext(WorkspaceContext);
  const dispatch = useDispatch();
  const domRef = useRef(null);
  // const activeRef = useRef(false);
  const [active, setActive] = useState(null);
  // const navigateTimer = useRef(null);

  const nodes = get(bundleState, 'data.nodes', []);
  const nodeIndex = nodes.findIndex(
    (item) => String(item.id) === workspace.nodeId,
  );
  const next = nodeIndex > -1 ? nodes[nodeIndex + 1] : null;
  const nodeState = useSelector(
    (state) => (next ? selectNodeState(state, { nodeId: next.id }) : null),
  );
  useEffect(
    () => {
      const handleScroll = () => {
        // cacl offset and load data
        if (!next || !domRef.current) {
          return;
        }
        const box = domRef.current.getBoundingClientRect();
        const viewportHeight =
          window.innerHeight || document.documentElement.clientHeight;

        // prefetch data;
        if (box.top - viewportHeight < 100 && box.top - viewportHeight > 0) {
          if (!nodeState) {
            const params = {
              bundleId: workspace.bundleId,
              nodeId: next.id,
            };
            dispatch(initNodeEdit(params));
            // .then(() => {
            //   if (autoRedirect) {
            //     Router.push({
            //       pathname: '/dimzou-edit',
            //       query: params,
            //     }, `/draft/${params.bundleId}/${params.nodeId}`).then(() => {
            //       window.scrollTo(0, 0);
            //     })
            //   }
            // })
          }
        }

        if (viewportHeight - box.bottom > 50) {
          if (active) {
            return;
          }
          // const nextTimer = setTimeout(() => {
          //   Router.push({
          //     pathname: '/dimzou-edit',
          //     query: {
          //       bundleId: workspace.bundleId,
          //       nodeId: next.id,
          //     },
          //   }, `/draft/${workspace.bundleId}/${next.id}`).then(() => {
          //     window.scrollTo(0, 0);
          //   })
          // }, 5000);
          setActive(true);
        } else {
          setActive(false);
        }
      };

      window.addEventListener('scroll', handleScroll);
      return () => {
        window.removeEventListener('scroll', handleScroll);
      };
    },
    [next, active],
  );

  if (!next) {
    return null;
  }

  return (
    <div ref={domRef} className="dz-NodeNavAnchor">
      {/* <Link 
        href={{
          pathname: '/dimzou-edit',
          query: {
            bundleId: workspace.bundleId,
            nodeId: next.id,
          },
        }}
        as={`/draft/${workspace.bundleId}/${next.id}`}
      >
        <a className='dz-NodeNavAnchor__link'>
          <TranslatableMessage
            message={intlMessages.nextChapter} values={{
              title: <strong>{next.text_title}</strong>,
            }}
          />

          {active && <Countdown
            onFinished={() => {
              Router.push({
                pathname: '/dimzou-edit',
                query: {
                  bundleId: workspace.bundleId,
                  nodeId: next.id,
                },
              }, `/draft/${workspace.bundleId}/${next.id}`).then(() => {
                window.scrollTo(0, 0);
              });
            }} count={5} />}
        </a>
      </Link> */}
    </div>
  );
}

export default NodeNavAnchor;
