import React from 'react';
import PropTypes from 'prop-types';
import CoverPlaceholder from '../CoverBlockRender/CoverPlaceholder';
import { getTemplateCoverRatio } from '../../utils/template';

class ChapterCoverPlaceholder extends React.PureComponent {
  render() {
    return (
      <div className="dz-CoverSection__wrap">
        <CoverPlaceholder ratio={getTemplateCoverRatio(this.props.template)} />
      </div>
    );
  }
}

ChapterCoverPlaceholder.propTypes = {
  template: PropTypes.string,
};

export default ChapterCoverPlaceholder;
