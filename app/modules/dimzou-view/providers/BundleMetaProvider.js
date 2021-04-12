import { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import notification from '@feat/feat-ui/lib/notification';

import { asyncFetchBundlePublicationMeta } from '../actions';
import { selectPublicationMetaState } from '../selectors';

function BundleMetaProvider(props) {
  const publicationMeta = useSelector((state) =>
    selectPublicationMetaState(state, { bundleId: props.bundleId }),
  );
  const dispatch = useDispatch();
  const fetchMeta = useCallback(
    () => {
      dispatch(
        asyncFetchBundlePublicationMeta({
          bundleId: props.bundleId,
        }),
      ).catch((err) => {
        notification.error({
          message: 'Error',
          description: err.message,
        });
      });
    },
    [props.bundleId],
  );

  useEffect(
    () => {
      if (!publicationMeta.onceFetched && !publicationMeta.loading) {
        fetchMeta();
      }
    },
    [props.bundleId],
  );

  return props.children;
}

export default BundleMetaProvider;
