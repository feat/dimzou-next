import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { injectIntl } from 'react-intl';
import { useRouter } from 'next/router';
import Button from '@feat/feat-ui/lib/button';
import Modal from '@feat/feat-ui/lib/modal';
import FeatModal from '@feat/feat-ui/lib/feat-modal';
import notification from '@feat/feat-ui/lib/notification';
import LanguageSelectModal from '@/modules/language/components/LanguageSelectModal';
import TranslatableMessage from '@/modules/language/containers/TranslatableMessage';
import { selectLocales } from '@/modules/language/selectors';
import {
  asyncFetchLocales,
} from '@/modules/language/actions';
import intlMessages from '../messages';
import { asyncCreateTranslation } from '../../../actions';

function TranslateButton(props) {
  const { intl: { formatMessage }, publication } = props;
  const [isLanguageModalOpened, setLanguageModelOpened] = useState(false);
  const [isCreating, setCreating] = useState(false);
  const locales = useSelector(selectLocales);
  const dispatch = useDispatch();
  const router = useRouter();

  return (
        <>
            <Button
              type="merge"
              onClick={() => {
                setLanguageModelOpened(true);
              }}
            >
              {formatMessage(intlMessages.translateLabel)}
            </Button>
            <LanguageSelectModal
              isOpen={isLanguageModalOpened}
              onClose={() => {
                setLanguageModelOpened(false);
              }}
              fetchLocales={() => {
                dispatch(asyncFetchLocales());
              }}
              locales={locales}
              shouldDisable={(lang) => publication.lang === lang}
              onConfirm={(language) => {
                setLanguageModelOpened(false);
                setCreating(true);
                dispatch(asyncCreateTranslation({
                  bundleId: publication.bundle_id,
                  nodeId: publication.node_id,
                  language,
                })).then(
                  (data) => {
                    const href = {
                      pathname: '/dimzou-edit',
                      query: {
                        bundleId: data.id,
                      },
                    }
                    router.push(href, `/draft/${data.id}`,);
                  }
                ).catch((err) => {
                  notification.error({
                    message: 'Error',
                    description: err.message,
                  });
                  setCreating(false);
                })
              }}
            />
            <Modal isOpen={isCreating}>
              <FeatModal>
                <FeatModal.Header>
                  <FeatModal.Title>
                    <TranslatableMessage
                      message={intlMessages.creatingTranslationHint}
                    />
                  </FeatModal.Title>
                </FeatModal.Header>
              </FeatModal>
            </Modal>
        </>
  )
}

TranslateButton.propTypes = {
  publication: PropTypes.object,
  intl: PropTypes.object,
}

export default injectIntl(TranslateButton);