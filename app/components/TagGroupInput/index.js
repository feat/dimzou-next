import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import debounce from 'lodash/debounce';

import Popover from '@feat/feat-ui/lib/popover';
import SquareButton from '@feat/feat-ui/lib/button/SquareButton';
// import CrossButton from '@/components/CrossButton';

import './style.scss';

const KEY_ENTER = 'Enter';
const KEY_ARROW_UP = 'ArrowUp';
const KEY_ARROW_DOWN = 'ArrowDown';
const KEY_DELETE = 'Backspace';
const KEY_ESC = 'Escape';
const spiltKeys = [
  'Enter', 
  // ...(',;./[]\\'.split('')),
  // ...('，；。／【】、'.split('')),
];

class TagGroupInput extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      // isFocused: false,
      text: '',
      options: [],
      fetched: {},
      isOpen: false,
      currentSelect: 0, // initial not reset
      isSelectActive: false,
    };
    this.handleInputBlur = this.handleInputBlur.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleInputFocus = this.handleInputFocus.bind(this);
    this.handleInputKeyDown = this.handleInputKeyDown.bind(this);
    this.selectOption = this.selectOption.bind(this);
    this.fetchOptions = debounce(this.fetchOptions, 400);
  }

  componentWillUnmount() {
    this.tryToClearCommitTimer();
  }

  getMenuStyle() {
    const inputRect = this.input.getBoundingClientRect();
    return {
      width: inputRect.width,
      top: this.input.offsetTop + inputRect.height,
      left: this.input.offsetLeft,
      maxHeight: '20rem',
      position: 'absolute',
    };
  }

  setIgnoreBlur(ignore) {
    this.shouldIgnoreBlur = ignore;
  }

  focus() {
    this.input.focus();
  }

  fetchOptions(value) {
    this.setState({
      ...this.state.fetched,
      [value]: 'fetching',
    });
    this.props.asyncOptions(value.trim()).then(
      (response) => {
        // logging.debug(response);
        this.setState({
          options: this.state.options.concat(response),
          fetched: {
            ...this.state.fetched,
            [value]: 'fetching',
          },
        });
      },
      () => {
        this.setState({
          fetched: {
            ...this.state.fetched,
            [value]: 'failed',
          },
        });
      },
    );
  }

  tryToClearCommitTimer() {
    if (this.commitTimer) {
      clearTimeout(this.commitTimer);
      this.commitTimer = null;
    }
  }

  tryToCommitInput = () => {
    const trimed = this.state.text.trim();
    if (trimed) {
      this.submitTag({
        label: trimed,
      });
    }
  }


  submitTag(data) {
    if (!data) {
      return;
    }

    this.props.onChange(this.props.addItem(this.props.value, data));

    this.setState({
      text: '',
      currentSelect: false,
    });
  }

  selectOption(data) {
    this.submitTag(data);
    this.input.focus();
  }

  removeIndex = (index) => {
    const { onChange, value, removeItem } = this.props;
    onChange(removeItem(value, index));
  };

  handleInputFocus(e) {
    e.preventDefault();
    this.setIgnoreBlur(false);
    this.tryToClearCommitTimer();
    if (!this.state.isOpen) {
      this.setState({
        isOpen: true,
        // isFocused: true,
      });
    }
    if (this.props.onFocus) {
      this.props.onFocus();
    }
  }

  handleInputBlur(e) {
    if (this.shouldIgnoreBlur) {
      return;
    }
    this.setState({
      isOpen: false,
      // isFocused: false,
    });
    if (this.props.autoCommit) {
      this.commitTimer = setTimeout(this.tryToCommitInput, 1000);
    }
    if (this.props.onBlur) {
      this.props.onBlur(e);
    }
  }

  handleInputChange(e) {
    e.preventDefault();
    const { itemMaxLength } = this.props;
    const { value } = e.target;
    const trimedVal = value.trim();
    const match = /(.*)?[,;./[\]\\，；。／【】、]$/.exec(value);
    if (match) {
      if (match[1]) {
        this.submitTag({
          label: match[1],
        });
      }
      this.setState({
        text: '',
        isSelectActive: false,
      });
    } else {
      this.setState({
        text: itemMaxLength ? value.slice(0, itemMaxLength) : value,
        isSelectActive: false, // reset select active
      });
      if (trimedVal !== '' && this.props.asyncOptions) {
        if (this.state.fetched[trimedVal]) return;
        this.fetchOptions(trimedVal);
      }
    }
  }

  handleInputKeyDown(e) {
    const { value, getValueCount } = this.props;
    const { key } = e;

    const { isOpen, text } = this.state;
    const { currentSelect, options } = this.state;
    const filteredOptions = options.filter((option) => option.key === text);

    // prepend current valid;
    const optionCount = filteredOptions.length;
    const valueCount = getValueCount(value);
    // logging.debug(e.key, keyCode);
    if (key === 'Tab') {
      this.tryToCommitInput();
    } else if (spiltKeys.indexOf(key) > -1 && !this.state.isSelectActive) {
      e.preventDefault();
      this.tryToCommitInput();
    } 
    else if (key === KEY_DELETE && this.state.text === '' && valueCount) {
      this.props.onChange(this.props.removeItem(value, valueCount - 1));
    } else if (key === KEY_ARROW_UP && isOpen && optionCount) {
      e.preventDefault();
      if (!this.state.isSelectActive) {
        this.setState({
          currentSelect: optionCount - 1,
          isSelectActive: true,
        });
      } else {
        this.setState({
          currentSelect: (currentSelect - 1 + optionCount) % optionCount,
          isSelectActive: true,
        });
      }
    } else if (key === KEY_ARROW_DOWN && isOpen && optionCount) {
      e.preventDefault();
      if (!this.state.isSelectActive) {
        this.setState({
          currentSelect: 0,
          isSelectActive: true,
        });
      } else {
        this.setState({
          currentSelect: (currentSelect + 1 + optionCount) % optionCount,
          isSelectActive: true,
        });
      }
    } else if (key === KEY_ENTER && this.state.isSelectActive) {
      e.preventDefault();
      this.selectOption(filteredOptions[currentSelect].data);
    } else if (key === KEY_ESC && this.state.isSelectActive) {
      e.preventDefault();
      this.setState({
        isSelectActive: false,
      });
    }
  }

  render() {
    const { value, placeholder, getTagLabel, itemMaxLength } = this.props;

    const { text, options, isOpen, currentSelect } = this.state;

    const filteredOptions = options.filter((option) => option.key === text);
    
    let leftHint = null;
    if (itemMaxLength) {
      const left = itemMaxLength - text.length;
      if (left < 5) {
        leftHint = (
          <span className="TagGroupWidget__countHint">
            {left}
          </span>
        )
      }
    }
    
    return (
      <div className="TagGroupWidget">
        {value &&
          value.map((tag, index) => (
            <span
              className="TagGroupItem"
              key={index}
            >
              <Popover
                content={
                  <div style={{ width: 240 }}>
                    {getTagLabel(tag)}
                  </div>
                }
              >
                <span className="TagGroupItem__label">
                  {getTagLabel(tag)}
                </span>
              </Popover>
              <SquareButton
                className="TagGroupItem__btn"
                onClick={() => this.removeIndex(index)}
                type="merge"
              >
                  &times;
              </SquareButton>
            </span>
          ))}
        <span className="TagGroupWidget__inputWrap">
          <input
            type="text"
            id={this.props.inputId}
            ref={(n) => {
              this.input = n;
            }}
            autoComplete="off"
            placeholder={
              this.props.isSingleItem && value.length > 0 ? '' : placeholder
            }
            className="TagGroupWidget__input"
            value={this.state.text}
            onBlur={this.handleInputBlur}
            onFocus={this.handleInputFocus}
            onChange={this.handleInputChange}
            onKeyDown={this.handleInputKeyDown}
            disabled={this.props.isSingleItem && value.length > 0}
            autoFocus={this.props.autoFocus}
          />
          {leftHint}
          {isOpen ? (
            <div
              className="TagGroupWidget__optionMenu"
              // style={this.getMenuStyle()}
            >
              {filteredOptions.map((option, index) => (
                <div
                  className={classNames('TagGroupWidget__optionItem', {
                    'is-selected':
                      this.state.isSelectActive && index === currentSelect,
                  })}
                  key={option.data.label}
                  data-option-index={index}
                  onMouseDown={() => {
                    this.setIgnoreBlur(true);
                  }}
                  onClick={(e) => {
                    e.preventDefault();
                    this.selectOption(option.data);
                  }}
                >
                  {option.data.label}
                </div>
              ))}
            </div>
          ) : null}
        </span>
      </div>
    );
  }
}

TagGroupInput.defaultProps = {
  getTagLabel: (item) => item.label,
  getValueCount: (value) => value.length,
  addItem: (value, item) => value.concat(item),
  removeItem: (value, index) => [
    ...value.slice(0, index),
    ...value.slice(index + 1),
  ],
};

TagGroupInput.propTypes = {
  inputId: PropTypes.string,
  placeholder: PropTypes.string,

  // array|list handle
  getTagLabel: PropTypes.func,
  getValueCount: PropTypes.func,
  addItem: PropTypes.func,
  removeItem: PropTypes.func,

  asyncOptions: PropTypes.func,

  value: PropTypes.array,
  onChange: PropTypes.func,
  onFocus: PropTypes.func,
  onBlur: PropTypes.func,
  isSingleItem: PropTypes.bool,

  autoCommit: PropTypes.bool,
  autoFocus: PropTypes.bool,

  itemMaxLength: PropTypes.number,
};

export default TagGroupInput;
