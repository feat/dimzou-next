import React from 'react';
import PropTypes from 'prop-types';

import Modal from '@feat/feat-ui/lib/modal';

import LanguageSelectPanel from '../LanguageSelectPanel';

class LanguageSelectModal extends React.PureComponent {
  componentDidMount() {
    this.eName =
      document.onmousewheel === null ? 'mousewheel' : 'DOMMouseScroll';
    const mask = document.querySelector('.ft-Modal__mask');
    if (mask) {
      mask.addEventListener(this.eName, this.onMouseWheel);
    }
  }

  componentWillUnmount() {
    const mask = document.querySelector('.ft-Modal__mask');
    if (mask) {
      mask.removeEventListener(this.eName, this.onMouseWheel);
    }
  }

  onMouseWheel = (e) => {
    const languageSelect = document.querySelector(
      '.ft-Modal__mask .LanguageSelect__languages',
    );
    const languageGroup = document.querySelector(
      '.ft-Modal__mask .LanguageSelect__groups',
    );
    if (languageSelect) {
      const mask = document.querySelector('.ft-Modal__mask');
      const closestGroup = e.target.closest('.LanguageSelect__groups');
      if (
        e.target === mask ||
        (closestGroup && closestGroup === languageGroup)
      ) {
        e.preventDefault();
      }
      if (languageSelect.scrollTop === 0 && e.deltaY < 0) {
        e.preventDefault();
      }
      if (
        languageSelect.scrollHeight - languageSelect.clientHeight ===
          languageSelect.scrollTop &&
        e.deltaY > 0
      ) {
        e.preventDefault();
      }
    }
  };

  render() {
    const { isOpen, onClose, ...restProps } = this.props;
    return (
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        maskClosable
        className="ft-Modal__mask"
      >
        <LanguageSelectPanel {...restProps} />
      </Modal>
    );
  }
}

LanguageSelectModal.propTypes = {
  isOpen: PropTypes.bool,
  onClose: PropTypes.func,
};

export default LanguageSelectModal;
