import React from 'react';
import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';

import TagGroupInput from '@/components/TagGroupInput';

import { getApplyScenes } from '../../requests';
import rMessages from '../ReleaseModal/messages';

function fetchAsyncOptions(value) {
  return getApplyScenes(value).then(({ data }) =>
    data.map((item) => ({
      data: {
        value: item.label,
        label: item.label,
      },
      key: value,
    })),
  );
}

function ApplyScenesInput(props) {
  const { formatMessage } = useIntl();
  return (
    <TagGroupInput
      autoFocus={props.autoFocus}
      placeholder={formatMessage(rMessages.applyScenePlaceholder)}
      value={props.value}
      onChange={props.onChange}
      asyncOptions={fetchAsyncOptions}
    />
  );
}

ApplyScenesInput.propTypes = {
  value: PropTypes.array,
  onChange: PropTypes.func,
  autoFocus: PropTypes.bool,
};

export default ApplyScenesInput;
