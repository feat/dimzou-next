import React, { useContext, useMemo } from 'react';
import PropTypes from 'prop-types';

import { DimzouFeedCardIX, DimzouFeedCardVI } from '../Card';
import { FeedRenderContext } from '../Provider';

const RowIX = (props) => {
  const { data = [], startIndex, onItemClick, showAvatar } = props;
  const context = useContext(FeedRenderContext);
  const [subContext1, subContext2] = useMemo(
    () => {
      if (!context.containerWidth) {
        return [context, context];
      }
      return [
        {
          ...context,
          gridWidth: (context.containerWidth / 3) * 2,
        },
        {
          ...context,
          gridWidth: context.containerWidth / 3,
        },
      ];
    },
    [context],
  );

  return (
    <div className="DimzouFeedRow DimzouFeedRow_IX">
      <FeedRenderContext.Provider value={subContext1}>
        <div className="DimzouFeedItem DimzouFeedItem_I">
          <DimzouFeedCardIX
            data={data[0]}
            index={startIndex}
            showAvatar={showAvatar}
            onClick={onItemClick}
          />
        </div>
      </FeedRenderContext.Provider>
      <FeedRenderContext.Provider value={subContext2}>
        <div className="DimzouFeedItem">
          <DimzouFeedCardVI
            data={data[1]}
            index={startIndex + 1}
            showAvatar={showAvatar}
            onClick={onItemClick}
          />
        </div>
        <div className="DimzouFeedItem">
          <DimzouFeedCardVI
            data={data[2]}
            index={startIndex + 2}
            showAvatar={showAvatar}
            onClick={onItemClick}
          />
        </div>
      </FeedRenderContext.Provider>
    </div>
  );
};
RowIX.count = 3;
RowIX.toString = () => 'RowIX';

RowIX.propTypes = {
  data: PropTypes.array,
  onItemClick: PropTypes.func,
  showAvatar: PropTypes.bool,
  startIndex: PropTypes.number,
};

RowIX.defaultProps = {
  startIndex: 0,
};

export default RowIX;
