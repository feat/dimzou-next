import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import get from 'lodash/get';
import {
  isCurrentRecord,
  isPendingRecord,
  isHistoricalRecord,
  isRejectedRecord,
} from '../../utils/rewordings';

const CoverThumbnail = ({ data, template, ratio, onClick, isSelected }) => {
  const { crop_img: croppedImage, img } = data;
  const templateData = get(data, ['template_config', template]);

  let style;
  if (templateData) {
    style = {
      paddingTop: `${100 / ratio}%`,
      backgroundImage: `url("${croppedImage}")`,
      backgroundSize: 'cover',
    };
  } else {
    style = {
      paddingTop: `${100 / ratio}%`,
      backgroundImage: `url("${img}")`,
    };
  }

  const classes = { 'dz-CoverThumbnail': true };
  if (isSelected) {
    classes['is-selected'] = true;
  }

  if (isCurrentRecord(data)) {
    classes['dz-CoverThumbnail_current'] = true;
  } else if (isPendingRecord(data)) {
    classes['dz-CoverThumbnail_pending'] = true;
  } else if (isHistoricalRecord(data)) {
    classes['dz-CoverThumbnail_historic'] = true;
  } else if (isRejectedRecord(data)) {
    classes['dz-CoverThumbnail_rejected'] = true;
  }

  return (
    <div className={classNames(classes)} onClick={onClick}>
      <div className="dz-CoverThumbnail__img" style={style} />
    </div>
  );
};

CoverThumbnail.propTypes = {
  data: PropTypes.object,
  template: PropTypes.string,
  ratio: PropTypes.number,
  onClick: PropTypes.func,
  isSelected: PropTypes.bool,
};

export default CoverThumbnail;
