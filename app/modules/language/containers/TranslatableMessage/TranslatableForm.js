import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import notification from '@feat/feat-ui/lib/notification';
import message from '@feat/feat-ui/lib/message';

import {
  makeSelectTranslation,
  makeSelectTargetTranslation,
  isTargetTranslationReady,
} from '../../selectors';
import { asyncSubmitTranslation, asyncDeleteTranslation } from '../../actions';

import './style.scss';

class TranslatableForm extends React.Component {
  readyRendered = false;

  componentDidMount() {
    this.wrap.addEventListener('click', this.handleClick);

    const placeholder = document.createElement('span');
    placeholder.classList.add('TranslatableMessage__placeholder');
    placeholder.innerText =
      this.props.origin || this.props.defaultMessage || this.props.id;
    this.placeholder = placeholder;
    this.wrap.appendChild(placeholder);

    // this.btn.addEventListener('click', this.handleSubmit);
    const input = document.createElement('span');
    input.classList.add('TranslatableMessage__input');
    input.innerText = '...';
    input.style.minWidth = `${placeholder.getBoundingClientRect().width}px`;
    this.input = input;

    if (this.props.isReady) {
      this.renderSpan();
    }

    this.wrap.appendChild(input);
  }

  componentDidUpdate() {
    if (this.props.isReady && !this.readyRendered) {
      this.renderSpan();
    }
  }

  componentWillUnmount() {
    this.wrap.removeEventListener('click', this.handleClick);
    // this.btn.removeEventListener('click', this.handleSubmit);
  }

  handleClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (this.props.isReady && this.input) {
      const isEditable = this.input.getAttribute('contenteditable');
      if (!isEditable) {
        this.input.setAttribute('contenteditable', true);
      }
      this.input.focus();
    }
  };

  renderSpan() {
    const { input, placeholder } = this;
    const {
      translation,
      id,
      targetLocale,
      submitTranslation,
      deleteTranslation,
    } = this.props;
    input.innerText = translation || '';
    if (!translation) {
      placeholder.classList.add('is-visible');
    }

    input.addEventListener('keydown', (e) => {
      if (e.code === 'Enter') {
        e.preventDefault();
        e.stopPropagation();
        const text = input.innerText;
        input.blur();
        input.classList.add('is-submitting');
        const data = {
          key: id,
          locale: targetLocale,
          translation: text,
        };
        if (translation && !text) {
          deleteTranslation(data)
            .then(() => {
              message.success('Translation deleted');
            })
            .catch((err) => {
              notification.error({
                message: 'Error',
                description: err.message,
              });
            });
          return;
        }
        submitTranslation(data)
          .then(() => {
            input.classList.remove('is-submitting');
            message.success('Translation submitted');
          })
          .catch((err) => {
            notification.error({
              message: 'Failed To Submit Translation',
              description: err.message,
            });
          });
      }
    });

    input.addEventListener('keyup', (e) => {
      e.preventDefault();
      const text = input.innerText;
      const placehodlerHasVisibleClass = placeholder.classList.contains(
        'is-visible',
      );
      if (text && placehodlerHasVisibleClass) {
        placeholder.classList.remove('is-visible');
        input.style.minWidth = '0px';
      } else if (!text && !placehodlerHasVisibleClass) {
        placeholder.classList.add('is-visible');
        input.style.minWidth = `${placeholder.getBoundingClientRect().width}px`;
      }
    });

    this.readyRendered = true;
  }

  render() {
    const { isReady } = this.props;
    return (
      <span
        className={classNames('TranslatableMessage', {
          'is-loading': !isReady,
        })}
        ref={(n) => {
          this.wrap = n;
        }}
      />
    );
  }
}

TranslatableForm.propTypes = {
  id: PropTypes.string,
  submitTranslation: PropTypes.func,
  deleteTranslation: PropTypes.func,
  targetLocale: PropTypes.string,
  translation: PropTypes.string,
  origin: PropTypes.string,
  defaultMessage: PropTypes.string,
  isReady: PropTypes.bool,
};

const mapStateToProps = createStructuredSelector({
  origin: makeSelectTranslation(),
  translation: makeSelectTargetTranslation(),
  isReady: isTargetTranslationReady,
});

const mapDispatchToProps = {
  submitTranslation: asyncSubmitTranslation,
  deleteTranslation: asyncDeleteTranslation,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(TranslatableForm);
