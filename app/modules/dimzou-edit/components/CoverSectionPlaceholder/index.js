import React from 'react';
import PropTypes from 'prop-types';
import { RectShape } from '@feat/feat-ui/lib/placeholder';
import {
  getTemplateCoverRatio,
} from '../../utils/template';

function CoverSectionPlaceholder(props) {
  const { template } = props;
  const ratio = getTemplateCoverRatio(template);
  return (
    <div className="margin_b_36">
      <RectShape ratio={ratio} />
    </div>

  );
}

CoverSectionPlaceholder.propTypes = {
  template: PropTypes.string,
};

export default CoverSectionPlaceholder;
