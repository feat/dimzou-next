import React, { useMemo, useCallback, useRef, useContext } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import classNames from 'classnames';
import ContentOutline from './ContentOutline';
import styles from './index.module.scss';
import ScrollNavigator from '../../../dimzou-edit/components/ScrollNavigator';
import { ScrollContext } from '../../context';
import getHeadings from './getHeadings';

const NODE_TYPE_CHAPTER = 0;
function BundleOutline(props) {
  const domRef = useRef(null);
  const { meta, publication } = props;
  const { hash, setHash } = useContext(ScrollContext);
  const router = useRouter();

  const nodes = useMemo(
    () =>
      meta?.nodes
        .filter((node) => node.node_type === NODE_TYPE_CHAPTER)
        .map((node) => ({
          id: node.id,
          nodeId: node.id,
          label: node.text_title,
          bundleId: meta.bundle_id,
        })),
    [meta?.nodes],
  );

  const onToPrev = useCallback(
    () => {
      const { bundleId, nodeId } = router.query;
      const activeIndex = nodes.findIndex((n) => String(n.nodeId) === nodeId);
      if (activeIndex === -1) {
        return;
      }
      if (activeIndex === 0) {
        const href = {
          pathname: '/dimzou-view',
          query: {
            bundleId,
          },
          hash: '#tailing',
        };
        router.push(href, `/dimzou/${bundleId}#tailing`);
        return;
      }
      const prev = nodes[activeIndex - 1];
      const href = {
        pathname: '/dimzou-view',
        query: {
          bundleId,
          nodeId: prev.nodeId,
        },
        hash: '#tailing',
      };
      router.push(href, `/dimzou/${bundleId}/${prev.nodeId}#tailing`);
    },
    [nodes, publication],
  );

  const onToNext = useCallback(
    () => {
      let nextNode;
      const { bundleId, nodeId } = router.query;

      if (!nodeId) {
        [nextNode] = nodes;
      } else {
        const activeIndex = nodes.findIndex((n) => String(n.nodeId) === nodeId);
        nextNode = nodes[activeIndex + 1];
      }
      if (!nextNode) {
        return;
      }

      const href = {
        pathname: '/dimzou-view',
        query: {
          bundleId,
          nodeId: nextNode.nodeId,
        },
      };
      router.push(href, `/dimzou/${bundleId}/${nextNode.nodeId}`).then(() => {
        window.scrollTo(0, 0);
      });
    },
    [meta?.nodes, publication],
  );

  return (
    <ScrollNavigator onToPrev={onToPrev} onToNext={onToNext}>
      <div className={styles.block} ref={domRef}>
        <div className={styles.title}>
          <Link
            href={{
              pathname: '/dimzou-view',
              query: {
                bundleId: meta.bundle_id,
              },
            }}
            as={`/dimzou/${meta.bundle_id}/`}
          >
            <a>{meta.title}</a>
          </Link>
        </div>
        <div>
          {nodes &&
            nodes.map((n) => {
              const active = String(n.nodeId) === String(publication?.node_id);
              const headings =
                publication?.content && getHeadings(publication.content);
              return (
                <div className={styles.element} key={n.id}>
                  <Link
                    href={{
                      pathname: '/dimzou-view',
                      query: {
                        bundleId: n.bundleId,
                        nodeId: n.nodeId,
                      },
                    }}
                    as={`/dimzou/${n.bundleId}/${n.nodeId}`}
                    replace={active}
                  >
                    <a
                      className={classNames(styles.node, styles.depth1, {
                        [styles.isActive]: active && !hash,
                      })}
                    >
                      {n.label}
                    </a>
                  </Link>
                  {active &&
                    !!headings.length && (
                      <ContentOutline
                        headings={headings}
                        depth={1}
                        activeHash={hash}
                        setActiveHash={setHash}
                      />
                    )}
                </div>
              );
            })}
        </div>
      </div>
    </ScrollNavigator>
  );
}

export default BundleOutline;
