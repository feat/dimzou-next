import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import Button from "../button";
import IconButton from "../button/IconButton";
// import "./style/index.scss";
// const Option = AutoComplete.Option;
const VALUE_SEPARATOR = "|";

class Searchbox extends React.Component {
  static defaultProps = {
    type: "text",
    historyKey: "historyItems",
    clearBtnLabel: "Clear History",
  };

  constructor(props) {
    super(props);
    this.state = {
      value: this.props.initialValue || "",
      autocompleteData: [],
    };
  }

  getValidHistoryItems = () => {
    const { value } = this.state;
    const historyItems = localStorage.historyItems.split(VALUE_SEPARATOR);
    return historyItems.filter((item) => item.indexOf(value) > -1).map((item) => ({
      value: item,
      label: item,
      meta: {
        isHistory: true,
      },
    }));
  };

  tryToUpdateHistory = (keyword) => {
    // Set History
    const history = localStorage.getItem(this.props.historyKey) || "";
    const historyOptions = history.split(VALUE_SEPARATOR);
    if (historyOptions.indexOf(keyword) === -1) {
      localStorage.setItem(
        this.props.historyKey,
        history ? `${keyword}${VALUE_SEPARATOR}${history}` : keyword
      );
    }
  };

  // ----onSearch------------------------------------
  handleSearch = () => {
    // console.log(e);
    const { value } = this.state;
    const keyword = value.trim();
    if (keyword === "") {
      return;
    }

    this.tryToUpdateHistory(keyword);

    this.props.onSearch(keyword);
  };

  handleInputChange = (e) => {
    const { value } = e.target;
    this.setState({
      value,
    });
    // TODO: auto complete callback;
  };

  handleInputFocus = () => {
    this.setState({
      isFocused: true,
    });
  };

  handleInputBlur = () => {
    this.setState({
      isFocused: false,
    });
  };

  handleInputKeyDown = (e) => {
    if (e.keyCode === 13) {
      e.stopPropagation();
      e.preventDefault();
      this.handleSearch();
      // return;
    }
  };

  handleClearHistory = () => {
    localStorage.removeItem(this.props.historyKey);
  };

  handleSelectOption = (option) => {
    this.tryToUpdateHistory(option.value);
    this.setState({
      value: option.value,
    });
    this.props.onSearch(option.value);
  };

  renderDropdown() {
    let options = [];
    const hasHistory = Boolean(localStorage.getItem(this.props.historyKey));

    if (hasHistory) {
      options = options.concat(this.getValidHistoryItems());
    }
    options = options.concat(this.state.autocompleteData);
    if (!options.length) {
      return null;
    }

    return (
      <div
        className={classNames("ft-SearchBox__dropdown", {
          "is-visible": this.state.isFocused,
        })}
      >
        <ul className="ft-SearchBox__list">
          {options.map((option) => (
            <li
              className={classNames("ft-SearchBox__option", {
                "ft-SearchBox__option_history":
                  option.meta && option.meta.isHistory,
              })}
              key={option.value}
              data-value={option.value}
              onMouseDown={() => this.handleSelectOption(option)}
            >
              {option.label}
            </li>
          ))}
        </ul>
        {hasHistory && (
          <Button
            className="ft-SearchBox__clearBtn"
            type="merge"
            onMouseDown={this.handleClearHistory}
          >
            {this.props.clearBtnLabel}
          </Button>
        )}
      </div>
    );
  }

  render() {
    const { type, placeholder, className, style } = this.props;
    return (
      <div className={classNames("ft-SearchBox", className)} style={style}>
        <div className="ft-SearchBox__inputWrap">
          <input
            className="ft-SearchBox__input"
            type={type}
            value={this.state.value}
            placeholder={placeholder}
            autoComplete={false}
            onFocus={this.handleInputFocus}
            onBlur={this.handleInputBlur}
            onChange={this.handleInputChange}
            onKeyDown={this.handleInputKeyDown}
          />
          <IconButton
            className="ft-SearchBox__searchBtn"
            onClick={this.handleSearch}
            svgIcon="search-v2"
            type="merge"
            size="sm"
          />
        </div>
        {this.renderDropdown()}
      </div>
    );
  }
}

Searchbox.propTypes = {
  type: PropTypes.string,
  placeholder: PropTypes.node,
  clearBtnLabel: PropTypes.node,
  initialValue: PropTypes.string,
  historyKey: PropTypes.string,
  onSearch: PropTypes.func.isRequired,
};

export default Searchbox;
