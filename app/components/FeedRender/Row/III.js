import React, { useContext, useMemo } from 'react';
import PropTypes from 'prop-types';

import { DimzouFeedCardXII } from '../Card';
import { FeedRenderContext } from '../Provider';

const RowIII = (props) => {
  const { data = [], startIndex, onItemClick, showAvatar } = props;
  const context = useContext(FeedRenderContext);
  const [subContext] = useMemo(
    () => {
      if (!context.containerWidth) {
        return [context];
      }
      return [
        {
          ...context,
          gridWidth: context.containerWidth,
        },
      ];
    },
    [context],
  );

  return (
    <div className="DimzouFeedRow DimzouFeedRow_III">
      <FeedRenderContext.Provider value={subContext}>
        <div className="DimzouFeedItem">
          <DimzouFeedCardXII
            data={data[0]}
            index={startIndex}
            showAvatar={showAvatar}
            onClick={onItemClick}
          />
        </div>
      </FeedRenderContext.Provider>
    </div>
  );
};
RowIII.count = 1;
RowIII.toString = () => 'RowIII';

RowIII.propTypes = {
  data: PropTypes.array,
  onItemClick: PropTypes.func,
  showAvatar: PropTypes.bool,
  startIndex: PropTypes.number,
};

RowIII.defaultProps = {
  startIndex: 0,
};

export default RowIII;
