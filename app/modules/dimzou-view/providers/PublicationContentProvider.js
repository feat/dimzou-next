import { useCallback, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import notification from '@feat/feat-ui/lib/notification';
import { selectContentState, selectPublicationMetaState } from '../selectors';
import { asyncFetchNodePublication } from '../actions';

function PublicationContentProvider(props) {
  const metaState = useSelector((state) =>
    selectPublicationMetaState(state, props),
  );
  const contentState = useSelector((state) => selectContentState(state, props));
  const nodeId = props.nodeId || metaState?.data?.node_id;

  const dispatch = useDispatch();
  const fetchData = useCallback(
    () => {
      dispatch(
        asyncFetchNodePublication({
          bundleId: props.bundleId,
          nodeId,
          related: props.showRelated,
        }),
      ).catch((err) => {
        notification.error({
          message: 'Error',
          description: err.message,
        });
      });
    },
    [props.bundleId, nodeId],
  );

  useEffect(
    () => {
      if (!nodeId) {
        return;
      }
      if (!contentState.onceFetched && !contentState.loading) {
        fetchData();
      }
    },
    [props.bundleId, nodeId],
  );

  return props.children;
}

export default PublicationContentProvider;
