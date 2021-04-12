import React, { useContext, useMemo } from 'react';
import PropTypes from 'prop-types';

import { DimzouFeedCardVIII } from '../Card';
import { FeedRenderContext } from '../Provider';

const RowIV = (props) => {
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
    <div className="DimzouFeedRow DimzouFeedRow_IV">
      <FeedRenderContext.Provider value={subContext}>
        <div className="DimzouFeedItem">
          <DimzouFeedCardVIII
            data={data[0]}
            index={startIndex}
            showAvatar={showAvatar}
            onClick={onItemClick}
          />
        </div>
        <div className="DimzouFeedItem">
          <DimzouFeedCardVIII
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
RowIV.count = 2;
RowIV.toString = () => 'RowIV';

RowIV.propTypes = {
  data: PropTypes.array,
  onItemClick: PropTypes.func,
  showAvatar: PropTypes.bool,
  startIndex: PropTypes.number,
};

RowIV.defaultProps = {
  startIndex: 0,
};

export default RowIV;
