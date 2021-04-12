import React, { useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';

import Block from '@/components/Block';
import MaskLoader from '@feat/feat-ui/lib/loader/MaskLoader';
import BlockErrorHint from '@/components/BlockErrorHint';
import { mapPublication, shouldShowLoading } from '../../utils';
import TopList from '../TopList';

export default function MostBlock(props) {
  const { title, blockState, loader, prefix } = props;

  useEffect(() => {
    if (!blockState.onceFetched) {
      loader();
    }
  }, []);

  const mapped = useMemo(
    () => {
      if (!blockState.data) {
        return null;
      }
      return mapPublication(blockState.data);
    },
    [blockState.data],
  );

  return (
    <Block title={title} className="margin_b_24">
      {blockState.error && (
        <BlockErrorHint error={blockState.error} onRetry={loader} />
      )}
      {mapped && <TopList data={mapped} prefix={prefix} />}
      {shouldShowLoading(blockState) && (
        <div style={{ height: 200, position: 'relative' }}>
          <MaskLoader />
        </div>
      )}
    </Block>
  );
}

MostBlock.propTypes = {
  loader: PropTypes.func.isRequired,
  title: PropTypes.node,
  blockState: PropTypes.object,
  prefix: PropTypes.string,
};
