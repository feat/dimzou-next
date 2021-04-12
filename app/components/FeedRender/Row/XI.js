import React, { useContext, useMemo } from 'react';
import PropTypes from 'prop-types';

import { DimzouFeedCardIII } from '../Card';
import { FeedRenderContext } from '../Provider';

const RowXI = (props) => {
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
    <div className="DimzouFeedRow DimzouFeedRow_XI">
      <FeedRenderContext.Provider value={subContext}>
        <div className="DimzouFeedItem">
          <DimzouFeedCardIII
            data={data[0]}
            index={startIndex}
            showAvatar={showAvatar}
            onClick={onItemClick}
          />
        </div>
        <div className="DimzouFeedItem">
          <DimzouFeedCardIII
            data={data[1]}
            index={startIndex + 1}
            showAvatar={showAvatar}
            onClick={onItemClick}
          />
        </div>
        <div className="DimzouFeedItem">
          <DimzouFeedCardIII
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
RowXI.count = 3;
RowXI.toString = () => 'RowXI';

RowXI.propTypes = {
  data: PropTypes.array,
  onItemClick: PropTypes.func,
  showAvatar: PropTypes.bool,
  startIndex: PropTypes.number,
};

RowXI.defaultProps = {
  startIndex: 0,
};

export default RowXI;
