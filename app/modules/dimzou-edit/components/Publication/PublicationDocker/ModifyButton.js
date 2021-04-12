import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/router';
import Button from '@feat/feat-ui/lib/button';
import notification from '@feat/feat-ui/lib/notification';
import TranslatableMessage from '@/modules/language/containers/TranslatableMessage';
import intlMessages from '../messages';
import { asyncCreateCopyBundle } from '../../../actions';
import { getAsPath } from '../../../utils/router';

function ModifyButton(props) {
  const dispatch = useDispatch();
  const [creating, setCreating] = useState(false);
  const router = useRouter();
  return (
    <Button
      type="merge"
      disabled={creating}
      onClick={() => {
        setCreating(true);
        dispatch(
          asyncCreateCopyBundle({
            bundleId: props.bundleId,
            nodeId: props.nodeId,
          }),
        )
          .then((data) => {
            const href = {
              pathname: '/dimzou-edit',
              query: {
                pageName: 'draft',
                bundleId: data.id,
                nodeId: data.node_id,
              },
            };
            router.push(href, getAsPath(href));
          })
          .catch((err) => {
            notification.error({
              message: 'Error',
              description: err.message,
            });
            setCreating(false);
          });
      }}
    >
      <TranslatableMessage message={intlMessages.modifyLabel} />
    </Button>
  );
}

ModifyButton.propTypes = {
  bundleId: PropTypes.number,
  nodeId: PropTypes.number,
};

export default ModifyButton;
