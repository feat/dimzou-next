import React, { useContext, useState, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';

import Modal from '@feat/feat-ui/lib/modal';
import Button from '@feat/feat-ui/lib/button';
// import FtBlock from '@feat/feat-ui/lib/block';
import notification from '@feat/feat-ui/lib/notification';
import FormItem from '@feat/feat-ui/lib/form/FormItem';
import FormLabel from '@feat/feat-ui/lib/form/FormLabel';
import TranslatableMessage from '@/modules/language/containers/TranslatableMessage';
import CategorySelectModal from '@/modules/category/containers/CategorySelectModal';

import get from 'lodash/get';
import ApplyScenesInput from '../ApplyScenesInput';

import { BundleContext, UserCapabilitiesContext } from '../../context';
import intlMessages from '../../messages';
import { asyncSetBundleCategory, asyncSetApplyScenes } from '../../actions';

function SettingsBlock() {
  const bundleState = useContext(BundleContext);
  const { isOwner } = useContext(UserCapabilitiesContext);
  const dispatch = useDispatch();
  const [isCategorySelectOpened, showCategorySelect] = useState(false);
  const [cachedCategory, setCachedCategory] = useState(null);

  const [cachedApplyScenes, setCachedApplyScenes] = useState(null);
  const applyScenesTimer = useRef(null);
  // delay to submit
  useEffect(
    () => {
      clearTimeout(applyScenesTimer.current);
      if (cachedApplyScenes) {
        applyScenesTimer.current = setTimeout(() => {
          dispatch(
            asyncSetApplyScenes({
              bundleId: bundleState.data.id,
              data: cachedApplyScenes.map((item) => item.label),
            }),
          )
            .then(() => {
              setCachedApplyScenes(null);
            })
            .catch((err) => {
              notification.error({
                message: 'Error',
                description: err.message,
              });
            });
        }, 500);
      }
    },
    [cachedApplyScenes],
  );

  if (!bundleState || !bundleState.data || !isOwner) {
    return null;
  }
  const category = cachedCategory || bundleState.data.category;
  const applyScenes =
    cachedApplyScenes ||
    get(bundleState, 'data.apply_scenes', []).map((item) => ({
      value: item,
      label: item,
    }));

  return (
    // <FtBlock title={<TranslatableMessage message={intlMessages.settings} />}>
    <div>
      <FormItem
        label={
          <FormLabel>
            <TranslatableMessage message={intlMessages.categoryLabel} />
          </FormLabel>
        }
        modifier="dashed"
      >
        <Button
          onClick={() => {
            isOwner && showCategorySelect(true);
          }}
          block
        >
          {category && category.id ? (
            <TranslatableMessage
              message={{
                id: `category.${category.slug}`,
                defaultMessage: category.name,
              }}
            />
          ) : (
            <TranslatableMessage message={intlMessages.selectACategory} />
          )}
        </Button>
      </FormItem>
      <FormItem
        label={
          <FormLabel>
            <TranslatableMessage message={intlMessages.applyScenesLabel} />
          </FormLabel>
        }
        modifier="dashed"
      >
        <ApplyScenesInput
          value={applyScenes || []}
          onChange={(values) => {
            setCachedApplyScenes(values);
          }}
        />
      </FormItem>
      {isCategorySelectOpened && (
        <Modal
          isOpen={isCategorySelectOpened}
          onClose={() => {
            showCategorySelect(false);
          }}
          maskClosable
        >
          <CategorySelectModal
            category={category && category.id ? category : undefined}
            onConfirm={({ category: newCategory }) => {
              showCategorySelect(false);
              if (
                newCategory &&
                (!category || newCategory.id !== category.id)
              ) {
                setCachedCategory(newCategory);
                dispatch(
                  asyncSetBundleCategory({
                    bundleId: bundleState.data.id,
                    category: newCategory,
                  }),
                )
                  .then(() => {
                    setCachedCategory(null);
                  })
                  .catch((err) => {
                    notification.error({
                      message: 'Error',
                      description: err.message,
                    });
                  });
              }
            }}
          />
        </Modal>
      )}
    </div>
    // </FtBlock>
  );
}

export default SettingsBlock;
