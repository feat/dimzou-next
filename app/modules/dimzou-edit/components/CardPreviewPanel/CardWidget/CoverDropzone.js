import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import TranslatableMessage from '@/modules/language/containers/TranslatableMessage';
import SquareButton from '@feat/feat-ui/lib/button/SquareButton';
import LazyImage from '@feat/feat-ui/lib/lazy-image';
import { cardWidget as wMessages } from '../../../messages';
import FileDropzone from '../../FileDropzone';

function CoverDropzone(props) {
  const {
    value,
    canReset,
    className,
    inverse,
    shortPlaceholder,
    coverRatio,
  } = props;
  let child;
  if (value) {
    child = (
      <LazyImage
        container={props.scrollContainer}
        className="dz-CardWidget__cover"
        src={value}
        ratio={coverRatio}
      />
    );
  } else {
    child = (
      <div
        className={classNames('dz-CardWidget__cover', {
          'is-inverse': inverse,
        })}
      >
        <div className={classNames('dz-CardWidget__coverPlaceholder')}>
          {shortPlaceholder ? (
            <TranslatableMessage message={wMessages.shortCoverPlaceholder} />
          ) : (
            <TranslatableMessage message={wMessages.coverPlaceholder} />
          )}
        </div>
      </div>
    );
  }

  return (
    <FileDropzone
      accept="image/*"
      multiple={false}
      onDrop={(acceptedFiles) => {
        if (acceptedFiles.length) {
          props.onDrop(acceptedFiles[0]);
        }
      }}
    >
      {({ getRootProps, getInputProps }) => (
        <section className={classNames(className, 'dz-CardWidget__dropzone')}>
          <div {...getRootProps()} style={{ height: '100%' }}>
            <input {...getInputProps()} />
            {child}
          </div>
          {value &&
            canReset && (
              <SquareButton
                className="dz-CardWidget__resetBtn"
                size="xs"
                onClick={props.onReset}
              >
                &times;
              </SquareButton>
            )}
        </section>
      )}
    </FileDropzone>
  );
}

CoverDropzone.propTypes = {
  value: PropTypes.string, // image url
  fallback: PropTypes.string, // image url
  scrollContainer: PropTypes.string, // scroll container selector
  onDrop: PropTypes.func,
  onReset: PropTypes.func,
  placeholder: PropTypes.node,
  inverse: PropTypes.bool,
  shortPlaceholder: PropTypes.bool,
  canReset: PropTypes.bool,
};

CoverDropzone.defaultProps = {
  canReset: true,
  scrollContainer: '.dz-CardPreviewPanel__content',
};

export default CoverDropzone;
