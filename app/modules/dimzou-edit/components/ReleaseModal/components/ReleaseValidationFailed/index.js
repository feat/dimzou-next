import React from 'react';
import PropTypes from 'prop-types';

import FeatModal from '@feat/feat-ui/lib/feat-modal';
import TranslatableMessage from '@/modules/language/containers/TranslatableMessage';

import ActionButton from '@/components/ActionButton';
import rMessages from '../../messages';
import { NODE_TYPE_COVER } from '../../../../constants';
import intlMessages from '../../../../messages';

export default function ReleaseValidationFailed(props) {
  const { nodes, error, onConfirm } = props;
  const isValidationError = error.data && error.data.errors;

  return (
    <FeatModal fixedHeight>
      <FeatModal.Wrap>
        <FeatModal.Header>
          <FeatModal.Title>
            <TranslatableMessage message={rMessages.validationFailed} />
          </FeatModal.Title>
        </FeatModal.Header>
        <FeatModal.Content>
          {isValidationError
            ? Object.entries(error.data.errors).map(([id, messages]) => {
                const node = nodes.find(
                  (item) => String(item.id) === String(id),
                );
                if (!node) {
                  logging.warn('can not find related node', id);
                  return null;
                }
                return (
                  <div className="dz-ValidationSection" key={id}>
                    <h3 className="dz-ValidationSection__title">
                      {node.text_title || (
                        <TranslatableMessage
                          messages={
                            node.type === NODE_TYPE_COVER
                              ? intlMessages.emptyCoverPlaceholder
                              : intlMessages.emptyTitlePlaceholder
                          }
                        />
                      )}
                    </h3>
                    <ul className="dz-ValidationSection__info">
                      {Object.values(messages).map((info, index) => (
                        <li key={index}>{info}</li>
                      ))}
                    </ul>
                  </div>
                );
              })
            : error.message}
        </FeatModal.Content>
        <FeatModal.Footer>
          <ActionButton type="ok" size="md" onClick={onConfirm} />
        </FeatModal.Footer>
      </FeatModal.Wrap>
    </FeatModal>
  );
}

ReleaseValidationFailed.propTypes = {
  error: PropTypes.object,
  nodes: PropTypes.array,
  onConfirm: PropTypes.func,
};
