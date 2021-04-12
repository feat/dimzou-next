import React, { useContext, useMemo } from 'react';
import PropTypes from 'prop-types';

import { DimzouFeedCardI } from '../Card';
import { FeedRenderContext } from '../Provider';

const RowXIII = (props) => {
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
          gridWidth: context.containerWidth / 4,
        },
      ];
    },
    [context],
  );

  return (
    <div className="DimzouFeedRow DimzouFeedRow_XIII">
      <FeedRenderContext.Provider value={subContext}>
        <div className="DimzouFeedItem DimzouFeedItem_I">
          <DimzouFeedCardI
            data={data[0]}
            index={startIndex}
            showAvatar={showAvatar}
            onClick={onItemClick}
          />
        </div>
        <div className="DimzouFeedItem DimzouFeedItem_II">
          <DimzouFeedCardI
            data={data[1]}
            index={startIndex + 1}
            showAvatar={showAvatar}
            onClick={onItemClick}
          />
        </div>
        <div className="DimzouFeedItem">
          <DimzouFeedCardI
            data={data[2]}
            index={startIndex + 2}
            showAvatar={showAvatar}
            onClick={onItemClick}
          />
        </div>
        <div className="DimzouFeedItem">
          <DimzouFeedCardI
            data={data[3]}
            index={startIndex + 3}
            showAvatar={showAvatar}
            onClick={onItemClick}
          />
        </div>
      </FeedRenderContext.Provider>
    </div>
  );
};
RowXIII.count = 4;
RowXIII.toString = () => 'RowXIII';

RowXIII.propTypes = {
  data: PropTypes.array,
  onItemClick: PropTypes.func,
  showAvatar: PropTypes.bool,
  startIndex: PropTypes.number,
};

RowXIII.defaultProps = {
  startIndex: 0,
};

export default RowXIII;
