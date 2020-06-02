import React from 'react';
import classNames from 'classnames';

export default class Image extends React.PureComponent {
  render() {
    const { contentState, entityKey, offsetKey, className, onClick, direction = 'ltr' } = this.props;
    const data = contentState.getEntity(entityKey).getData();
    const blockKey = offsetKey.split('-')[0];
    const dragData = { entityKey, blockKey };
    return (
      <div
        className={`public-DraftStyleDefault-block public-DraftStyleDefault-${direction.toLowerCase()}`}
        data-offset-key={offsetKey}
      >
        <img
          onClick={onClick}
          data-offset-key={offsetKey}
          src={data.src}
          alt={data.alt}
          className={classNames(className, 'public-DraftStyleDefault-image')}
          onDragStart={(e) => {
            e.dataTransfer.setData('text/plain', JSON.stringify(dragData));
          }}
        />
      </div>
    );
  }
}
