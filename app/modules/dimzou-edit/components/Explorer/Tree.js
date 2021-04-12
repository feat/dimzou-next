import React from 'react';
import PropTypes from 'prop-types';

import { isRootLevel, sortingFunction } from './utils';
import styles from './index.module.scss';

const Tree = React.forwardRef((props, ref) => {
  const {
    nodes,
    allNodes,
    selectedNode,
    prefix = '',
    depth = 0,
    renderElement: Element,
    expandedKeys,
    onToggleExpanded,
  } = props;
  return (
    <div className={styles.subTree} ref={ref}>
      {nodes
        .filter((node) => isRootLevel(nodes, node))
        .sort(sortingFunction)
        .map((child, index) => (
          <React.Fragment key={child.id}>
            <Element
              nodes={nodes}
              allNodes={allNodes}
              selectedNode={selectedNode}
              prefix={prefix}
              expandedKeys={expandedKeys}
              renderElement={Element}
              depth={depth}
              onToggleExpanded={onToggleExpanded}
              index={index}
              node={child}
            />
          </React.Fragment>
        ))}
    </div>
  );
});

Tree.displayName = 'Tree';

Tree.propTypes = {
  nodes: PropTypes.array.isRequired,
  allNodes: PropTypes.array.isRequired,
  selectedNode: PropTypes.string,
  prefix: PropTypes.string,
  depth: PropTypes.number,
  expandedKeys: PropTypes.object, // a set
  onToggleExpanded: PropTypes.func,
  renderElement: PropTypes.func.isRequired,
};

export default Tree;
