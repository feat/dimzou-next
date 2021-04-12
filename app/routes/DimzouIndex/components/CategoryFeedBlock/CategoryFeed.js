import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import Button from '@feat/feat-ui/lib/button';
import TranslatableMessage from '@/modules/language/containers/TranslatableMessage';
import cMessages from '@/messages/common';
import { provider } from '../../helpers';

function CategoryFeed(props) {
  const { blockState, loader, shouldFetch, onItemClick } = props;

  useEffect(
    () => {
      if (!blockState.onceFetched && shouldFetch) {
        loader();
      }
    },
    [shouldFetch],
  );

  if (!blockState) {
    return null;
  }

  const { data, templates, error } = blockState;

  if (error) {
    return (
      <div
        style={{
          height: 400,
          background: '#f3f3f3',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <div className="t-center">
          <div className="margin_b_12">
            <TranslatableMessage message={cMessages.errorHint} />
          </div>
          <div>
            <Button onClick={props.loader}>
              <TranslatableMessage message={cMessages.retry} />
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (!templates) {
    return null;
  }
  const toSlice = data || [];
  const content = [];

  for (let i = 0, j = 0; i < templates.length; i += 1) {
    const T = provider.getTemplate(templates[i]);
    content.push(
      <T
        data={toSlice.slice(j, j + T.count)}
        key={i}
        startIndex={j}
        onItemClick={onItemClick}
      />,
    );
    j += T.count;
  }

  return <div className="FeedSection">{content}</div>;
}

CategoryFeed.propTypes = {
  blockState: PropTypes.object,
  loader: PropTypes.func,
  shouldFetch: PropTypes.bool,
  onItemClick: PropTypes.func,
};

export default CategoryFeed;
