import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { bindPromiseCreators } from 'redux-saga-routines';

import {
  makeSelectTranslation,
  makeSelectTargetTranslation,
  isTargetTranslationReady,
} from '../../selectors';
import { submitTranslationPromiseCreator } from '../../actions';

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
    const { translation, id, targetLocale, submitTranslation } = this.props;
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
        submitTranslation(data).then(() => {
          input.classList.remove('is-submitting');
        });
      }
    });

    input.addEventListener('keyup', () => {
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

const mapDispachToProps = (dispatch) =>
  bindPromiseCreators(
    {
      submitTranslation: submitTranslationPromiseCreator,
    },
    dispatch,
  );

export default connect(
  mapStateToProps,
  mapDispachToProps,
)(TranslatableForm);
