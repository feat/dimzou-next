import React, { useCallback } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import Button from '@feat/feat-ui/lib/button';
import TranslatableMessage from '@/modules/language/containers/TranslatableMessage';

function CategoryList(props) {
  const { data, selected, onItemClick } = props;

  const handleItemClick = useCallback(
    (e) => {
      const { index } = e.currentTarget.dataset;
      if (data[index]) {
        onItemClick(e, data[index]);
      }
    },
    [data],
  );

  return (
    <div className="CategoryList">
      {data &&
        data.map((cat, i) => (
          <Button
            className={classNames('ft-Button_anchor', {
              'is-selected': `${cat.id}` === selected,
            })}
            key={cat.id}
            type="merge"
            block
            data-index={i}
            onClick={handleItemClick}
          >
            {cat.slug ? (
              <TranslatableMessage
                message={{
                  id: `category.${cat.slug}`,
                  defaultMessage: cat.name,
                }}
              />
            ) : (
              cat.name
            )}
          </Button>
        ))}
    </div>
  );
}

CategoryList.propTypes = {
  data: PropTypes.array,
  selected: PropTypes.string,
  onItemClick: PropTypes.func,
};

export default CategoryList;
