import React, { useContext, useMemo } from 'react';
import PropTypes from 'prop-types';

import { DimzouFeedCardVI } from '../Card';
import { FeedRenderContext } from '../Provider';

const RowX = (props) => {
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
          gridWidth: context.containerWidth / 3,
        },
      ];
    },
    [context],
  );

  return (
    <div className="DimzouFeedRow DimzouFeedRow_X">
      <FeedRenderContext.Provider value={subContext}>
        <div className="DimzouFeedItem DimzouFeedItem_I">
          <DimzouFeedCardVI
            data={data[0]}
            index={startIndex}
            showAvatar={showAvatar}
            onClick={onItemClick}
          />
        </div>
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
RowX.count = 3;
RowX.toString = () => 'RowX';

RowX.propTypes = {
  data: PropTypes.array,
  onItemClick: PropTypes.func,
  showAvatar: PropTypes.bool,
  startIndex: PropTypes.number,
};

RowX.defaultProps = {
  startIndex: 0,
};

export default RowX;
