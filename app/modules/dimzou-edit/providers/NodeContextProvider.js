import PropTypes from 'prop-types';
import { useContext, useEffect, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectCurrentUserId } from '@/modules/auth/selectors';
import { initNodeEdit } from '../actions';
import { WorkspaceContext, NodeContext } from '../context';
import { selectNodeState } from '../selectors';
import { initNodeCache } from '../utils/cache';

function NodeContextProvider(props) {
  const workspace = useContext(WorkspaceContext);
  const nodeState = useSelector((state) => selectNodeState(state, props));
  const currentUserId = useSelector(selectCurrentUserId);
  const dispatch = useDispatch();
  useEffect(
    () => {
      // console.log('node init effect');
      // may fetch data
      if (props.shouldFetchData) {
        initNodeCache(props.nodeId, currentUserId);
      }
      if (!nodeState && props.nodeId && props.shouldFetchData) {
        dispatch(
          initNodeEdit({
            bundleId: props.bundleId,
            nodeId: props.nodeId,
            invitationCode: workspace.invitationCode,
          }),
        );
      }
    },
    [props.bundleId, props.nodeId, props.shouldFetchData],
  );

  // TODO: handle title_paragraphs update
  const outline = useMemo(
    () => {
      if (!nodeState || !nodeState.basic) {
        return null;
      }
      // { id, sort, currentRewording }
      return Object.values(nodeState.basic.section.title_paragraphs)
        .map((item) => ({
          id: item.paragraph_id,
          sort: item.paragraph_sort,
          text: item.paragraph_title,
          html: item.title_html_cont,
        }))
        .sort((a, b) => a.sort - b.sort);
    },
    [nodeState ? nodeState.basic : undefined],
  );

  const combined = useMemo(
    () => {
      if (!nodeState) {
        return nodeState;
      }
      return {
        ...nodeState,
        outline,
      };
    },
    [nodeState, outline],
  );

  return (
    <NodeContext.Provider value={combined}>
      {props.children}
    </NodeContext.Provider>
  );
}

NodeContextProvider.propTypes = {
  children: PropTypes.node,
  bundleId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  nodeId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  shouldFetchData: PropTypes.bool, // 页面内可能存在多个 NodeContextProvider, 只有 shouldFetchData = true 时才进行初始化
};

NodeContextProvider.defaultProps = {
  shouldFetchData: true,
};

export default NodeContextProvider;
