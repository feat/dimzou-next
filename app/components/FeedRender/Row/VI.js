import React, { useContext, useMemo } from 'react';
import PropTypes from 'prop-types';

import { DimzouFeedCardVII } from '../Card';
import { FeedRenderContext } from '../Provider';

const RowVI = (props) => {
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
          gridWidth: context.containerWidth / 2,
        },
      ];
    },
    [context],
  );

  return (
    <div className="DimzouFeedRow DimzouFeedRow_VI">
      <FeedRenderContext.Provider value={subContext}>
        <div className="DimzouFeedItem">
          <DimzouFeedCardVII
            data={data[0]}
            index={startIndex}
            showAvatar={showAvatar}
            onClick={onItemClick}
          />
        </div>
        <div className="DimzouFeedItem">
          <DimzouFeedCardVII
            data={data[1]}
            index={startIndex + 1}
            showAvatar={showAvatar}
            onClick={onItemClick}
          />
        </div>
      </FeedRenderContext.Provider>
    </div>
  );
};
RowVI.count = 2;
RowVI.toString = () => 'RowVI';

RowVI.propTypes = {
  data: PropTypes.array,
  onItemClick: PropTypes.func,
  showAvatar: PropTypes.bool,
  startIndex: PropTypes.number,
};

RowVI.defaultProps = {
  startIndex: 0,
};

export default RowVI;
