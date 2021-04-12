import React, { useContext, useCallback, useRef } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Loader from '@feat/feat-ui/lib/loader';
import { injectIntl } from 'react-intl';
import TextInput from '@feat/feat-ui/lib/text-input';
import { WorkshopContext } from '../../../context';

import ResourceSection from './ResourceSection';
import styles from './index.module.scss';
import intlMessages from '../../../messages';
import ScrollNavigator from '../../ScrollNavigator';
import expStyles from '../../Explorer/index.module.scss';

function ResourceNavigator(props) {
  const {
    intl: { formatMessage },
  } = props;
  const { classified, error, updateFilter, filter } = useContext(
    WorkshopContext,
  );
  const domRef = useRef();

  const onToPrev = useCallback(() => {
    const activeNode = domRef.current?.querySelector(`.${expStyles.isActive}`);
    const nodes = [...domRef.current?.querySelectorAll(`.${expStyles.node}`)];
    const nodeIndex = nodes.findIndex((n) => n === activeNode);
    const nextActiveNode = nodes[nodeIndex - 1];
    if (nextActiveNode) {
      nextActiveNode.click();
    }
  }, []);

  const onToNext = useCallback(() => {
    const activeNode = domRef.current?.querySelector(`.${expStyles.isActive}`);
    const nodes = [...domRef.current?.querySelectorAll(`.${expStyles.node}`)];
    const nodeIndex = nodes.findIndex((n) => n === activeNode);
    const nextActiveNode = nodes[nodeIndex + 1];
    if (nextActiveNode) {
      nextActiveNode.click();
    }
  }, []);

  let selectedNode = '';
  if (props.bundleId && props.nodeId) {
    selectedNode = `/bundle-${props.bundleId}/node-${props.nodeId}`;
  } else if (props.bundleId) {
    selectedNode = `/bundle-${props.bundleId}`;
  }

  if (error) {
    return <div className={styles.block}>{error.message}</div>;
  }

  if (!classified) {
    return (
      <div className={styles.block}>
        <div style={{ textAlign: 'center' }}>
          <Loader size="xs" />
        </div>
      </div>
    );
  }

  const sections = [];
  sections.push(
    <div key="search" className={styles.group}>
      <div className={styles.group__title}>快速查询</div>
      <div
        className={classNames(
          styles.group__content,
          styles.group__content_query,
        )}
      >
        <TextInput
          value={filter}
          onChange={(e) => {
            updateFilter(e.target.value);
          }}
          placeholder={formatMessage(intlMessages.workshopFilterHint)}
        />
      </div>
    </div>,
  );
  if (classified.hasCreated) {
    sections.push(
      <div key="created" className={styles.group}>
        <div className={styles.group__title}>我创建的</div>
        <div className={styles.group__content}>
          <ResourceSection
            title="已发表"
            selectedNode={selectedNode}
            userId={props.userId}
            data={classified.created.published}
          />
          <ResourceSection
            title="草稿"
            selectedNode={selectedNode}
            userId={props.userId}
            data={classified.created.draft}
          />
        </div>
      </div>,
    );
  }
  // console.log(classified);
  return (
    <ScrollNavigator
      navTriggerLimit={30}
      excepts={['.dz-App__sidebarFirst', '.l-UserApp__sidebar', '.IM']}
      onToPrev={onToPrev}
      onToNext={onToNext}
    >
      <div ref={domRef} className={styles.block}>
        {sections}
      </div>
    </ScrollNavigator>
  );
}

ResourceNavigator.propTypes = {
  userId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  bundleId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  nodeId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  intl: PropTypes.object,
};

export default injectIntl(ResourceNavigator);
