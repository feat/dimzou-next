/**
 * 代码参考 https://github.com/codesandbox/codesandbox-client/blob/master/packages/app/src/embed/components/Sidebar/FileTree/index.js
 */
import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';
import ButtonBase from '@feat/feat-ui/lib/button/ButtonBase';

import { flattenResource } from './utils';
import { useExpandedControl } from '../../Explorer/hooks';
import { Tree, Node as TNode, Element as TElement } from '../../Explorer';

import { getAsPath } from '../../../utils/router';
import Icon from '../../Icon';
function ResourceTree(props) {
  const allNodes = useMemo(() => flattenResource(props.data), [props.data]);
  const { expandedKeys, toggleExpanded, resetExpanded } = useExpandedControl(
    props.selectedNode,
  );
  const { userId } = props;

  const Element = useMemo(
    () => {
      function Collection(props) {
        const { depth, node, prefix, selectedNode } = props;
        const pathKey = `${prefix}/${node.id}`;
        const children = props.allNodes.filter((n) => n.parentId === node.id);
        const href = {
          pathname: '/dimzou-edit',
          query: {
            pageName: 'dashboard',
            userId,
            bundleId: node.bundleId,
            nodeId: node.nodeId,
            type: 'detail',
          },
        };
        const expanded = props.expandedKeys.has(pathKey);

        let icon = 'book';
        if (expanded) {
          icon = 'bookOpened';
        } else if (children.length) {
          icon = 'bookHasContent';
        }

        const activePath =
          depth === 0 ? `${pathKey}/node-${node.nodeId}` : pathKey;

        return (
          <TElement data-type="collection" data-depth={depth}>
            <Link href={href} as={getAsPath(href)} passHref>
              <TNode
                icon={icon}
                label={node.label}
                depth={depth}
                active={activePath === selectedNode}
                onToggleExpanded={() => {
                  props.onToggleExpanded(pathKey);
                }}
              />
            </Link>
            {expanded && (
              <Tree
                nodes={children}
                prefix={pathKey}
                allNodes={props.allNodes}
                selectedNode={props.selectedNode}
                expandedKeys={props.expandedKeys}
                renderElement={El}
                depth={depth + 1}
                onToggleExpanded={props.onToggleExpanded}
              />
            )}
          </TElement>
        );
      }

      function Leaf(props) {
        const { depth, node, prefix, selectedNode } = props;
        const pathKey = `${prefix}/${node.id}`;
        const href = {
          pathname: '/dimzou-edit',
          query: {
            pageName: 'dashboard',
            userId,
            bundleId: node.bundleId,
            nodeId: node.nodeId,
            type: 'detail',
          },
        };

        const activePath =
          depth === 0 ? `${pathKey}/node-${node.nodeId}` : pathKey;

        return (
          <TElement data-type="leaf" data-depth={depth}>
            <Link href={href} as={getAsPath(href)} passHref>
              <TNode
                icon="page"
                label={node.label}
                depth={depth}
                active={activePath === selectedNode}
              />
            </Link>
          </TElement>
        );
      }

      function El(props) {
        const { node } = props;
        switch (node.type) {
          case 'collection':
            return <Collection {...props} />;
          case 'leaf':
            return <Leaf {...props} />;
          default:
            return <div>Unknown Type: {node.type}</div>;
        }
      }

      return El;
    },
    [userId],
  );

  return (
    <div>
      <Tree
        nodes={allNodes}
        allNodes={allNodes}
        selectedNode={props.selectedNode}
        expandedKeys={expandedKeys}
        renderElement={Element}
        onToggleExpanded={toggleExpanded}
      />
      <div className={props.toolbarClassName}>
        <ButtonBase onClick={resetExpanded} className="size_xs">
          <Icon name="collapse" />
        </ButtonBase>
      </div>
    </div>
  );
}

ResourceTree.propTypes = {
  data: PropTypes.array,
  selectedNode: PropTypes.string,
  toolbarClassName: PropTypes.string,
  userId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
};

export default ResourceTree;
