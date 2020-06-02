import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";

import { List, AutoSizer } from "react-virtualized";
import Popover from "../popover";

import SelectOption from "./SelectOption";

class Select extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: this.props.initialValue,
      filter: "",
    };
  }

  // componentDidMount() {
  //   window.addEventListener("keydown", this.handleKeyPress);
  // }
  componentDidUpdate(prevProps, prevState) {
    if (
      this.state.filter === prevState.filter &&
      this.state.focusIndex !== prevState.focusIndex &&
      this.listDom
    ) {
      setTimeout(() => {
        const listDom = this.listDom;
        if (!listDom) {
          return;
        }
        const focusedDom = this.listDom.querySelector("[data-is-focused=true]");
        if (!focusedDom) {
          return;
        }
        const clientHeight = listDom.clientHeight;
        const scrollTop = listDom.scrollTop;
        const offsetTop = focusedDom.offsetTop;
        const height = focusedDom.clientHeight;
        if (this.moveDirection === "up") {
          if (offsetTop < scrollTop + height) {
            listDom.scrollTop = offsetTop;
          } else if (offsetTop > scrollTop + clientHeight) {
            listDom.scrollTop = offsetTop - clientHeight + height;
          }
        } else if (this.moveDirection === "down") {
          if (scrollTop > offsetTop) {
            listDom.scrollTop = offsetTop - height;
          } else if (clientHeight + scrollTop < offsetTop + height) {
            listDom.scrollTop = offsetTop - clientHeight + height;
          }
        }
      }, 200);
    }
  }

  componentWillUnmount() {
    window.removeEventListener("keydown", this.handleKeyPress);
  }

  scrollToValueOption = () => {
    if (!this.listDom) {
      return;
    }
    const listDom = this.listDom;
    const selectedDom = this.listDom.querySelector("[data-is-selected=true]");
    if (!selectedDom) {
      return;
    }
    const clientHeight = listDom.clientHeight;
    const scrollTop = listDom.scrollTop;
    const offsetTop = selectedDom.offsetTop;
    const height = selectedDom.clientHeight;
    if (
      offsetTop < scrollTop + height ||
      offsetTop > scrollTop + clientHeight
    ) {
      listDom.scrollTop = offsetTop - clientHeight / 2;
    }
  };

  getIntialFocusIndex() {
    const { valueExtractor } = this.props;
    const { value } = this.getValue(false);
    const options = this.filteredOptions();
    const index = options.findIndex((option) => valueExtractor(option) === value);
    return index;
  }

  getValue(withOption = true) {
    const { options, valueExtractor } = this.props;
    const value =
      this.props.value === undefined ? this.state.value : this.props.value;
    let option;
    if (withOption) {
      option = options.find((o) => valueExtractor(o) === value);
    }

    return {
      value,
      option,
    };
  }

  handleKeyPress = (e) => {
    // console.log("pressed", e.key);
    const currentOptionLength = this.currentOptions.length;
    if (e.key === "ArrowDown") {
      e.stopPropagation();
      e.preventDefault();
      this.setState({
        focusIndex: (this.state.focusIndex || -1 + 1) % currentOptionLength,
      });
      this.moveDirection = "down";
    } else if (e.key === "ArrowUp") {
      e.stopPropagation();
      e.preventDefault();
      this.setState({
        focusIndex:
          (Math.max(this.state.focusIndex, 0) - 1 + currentOptionLength) %
          currentOptionLength,
      });
      this.moveDirection = "up";
    } else if (e.key === "Enter") {
      e.stopPropagation();
      e.preventDefault();
      const { valueExtractor, onChange } = this.props;
      const option = this.currentOptions[Math.max(0, this.state.focusIndex)];
      const value = valueExtractor(option);
      this.setState({
        value,
        option,
      });
      this.popover.closePortal();
      onChange(value, option);
    }
  };

  handleItemClick = (option) => {
    const { valueExtractor } = this.props;
    const value = valueExtractor(option);

    this.setState({
      value,
      option,
    });
    this.popover.closePortal();
    this.props.onChange(value, option);
  };

  handleFilterInput = (e) => {
    this.setState({
      filter: e.target.value,
      focusIndex: this.getIntialFocusIndex(),
    });
  };

  filteredOptions = () => {
    const { options, filterOption, valueExtractor } = this.props;
    const { filter } = this.state;
    if (filter === this.filter) {
      return this.currentOptions;
    }
    const { value } = this.getValue(false);
    let currentOptions;
    if (filterOption) {
      currentOptions = options.filter((option) => {
        if (valueExtractor(option) === value) {
          return true;
        }
        return filterOption(option, filter);
      });
    } else {
      currentOptions = options;
    }
    // cache options;
    this.filter = filter;
    this.currentOptions = currentOptions;
    return currentOptions;
  };

  renderFilterInput() {
    return (
      <div className="ft-ButtonSelect__filterWrap">
        <input
          ref={(n) => {
            this.filterInput = n;
          }}
          autoFocus={this.props.autoFocusFilterInput}
          type="text"
          value={this.state.filter}
          className="ft-ButtonSelect__filter"
          onChange={this.handleFilterInput}
        />
      </div>
    );
  }

  renderOption = ({
    key, // Unique key within array of rows
    index, // Index of row within collection
    isScrolling, // The List is currently being scrolled
    isVisible, // This row is visible within the List (eg it is not an overscanned row)
    style, // Style object to be applied to row (to position it)
  }) => {
    const option = this.currentOptions[index];
    const { valueExtractor, renderOption } = this.props;
    const currentValue = this.props.value || this.state.value;
    const value = valueExtractor(option);
    const isSelected = currentValue === value;
    const isFocused = index === this.state.focusIndex;
    return (
      <div
        className={classNames("ft-ButtonSelect__option", {
          "is-selected": currentValue === value,
        })}
        style={style}
        data-is-focused={isFocused}
        data-is-selected={isSelected}
        key={key}
        onClick={() => {
          this.handleItemClick(option);
        }}
      >
        {renderOption(option, { isSelected, isFocused }, this.props)}
      </div>
    );
  };

  renderTrigger() {
    const { renderTrigger } = this.props;
    const { value, option } = this.getValue();
    return React.cloneElement(renderTrigger(value, option, this.props), {
      ...this.getTriggerEventHandlers(),
      ref: (n) => {
        this.trigger = n;
      },
    });
  }

  renderContent() {
    const { showFilter, dropdownWidth, dropdownHeight, rowHeight } = this.props;
    const options = this.filteredOptions();
    return (
      <div
        className={classNames("ft-ButtonSelect__dropdown", {
          "ft-ButtonSelect__dropdown_hasFilter": showFilter,
        })}
        style={{
          width: dropdownWidth,
          height: dropdownHeight,
        }}
      >
        <div className="ft-ButtonSelect__dropdownInner">
          {showFilter && this.renderFilterInput()}
          <div style={{ flex: "1 1 auto" }}>
            <AutoSizer>
              {({ height, width }) => (
                <List
                  className="ft-ButtonSelect__optionList"
                  width={width}
                  height={height}
                  rowCount={options.length}
                  rowHeight={rowHeight}
                  rowRenderer={this.renderOption}
                />
              )}
            </AutoSizer>
          </div>
        </div>
      </div>
    );
  }

  render() {
    const {
      closeOnEsc,
      closeOnOutsideClick,
      placement,
      renderTrigger,
      onOpen,
      onClose,
    } = this.props;
    const { value, option } = this.getValue();

    return (
      <Popover
        ref={(n) => {
          this.popover = n;
        }}
        closeOnEsc={closeOnEsc}
        closeOnOutsideClick={closeOnOutsideClick}
        content={this.renderContent()}
        wrapWithDefaultLayer={false}
        triggerWay={this.props.trigger}
        placement={placement}
        onOpen={onOpen}
        onClose={onClose}
      >
        {renderTrigger(value, option, this.props)}
      </Popover>
    );
  }
}

Select.propTypes = {
  options: PropTypes.array,
  trigger: PropTypes.oneOf(["hover", "click"]),
  showFilter: PropTypes.bool,
  closeOnEsc: PropTypes.bool,
  closeOnOutsideClick: PropTypes.bool,
  placement: PropTypes.string,
  dropdownHeight: PropTypes.number,
  dropdownWidth: PropTypes.number,
  rowHeight: PropTypes.number,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  valueExtractor: PropTypes.func,
  filterOption: PropTypes.func,
  renderTrigger: PropTypes.func,
  renderOption: PropTypes.func,
  onChange: PropTypes.func,
  onOpen: PropTypes.func,
  onClose: PropTypes.func,
  autoFocusFilterInput: PropTypes.bool,
};

Select.defaultProps = {
  placement: "topLeft",
  trigger: "click",
  showFilter: false,
  autoFocusFilterInput: true,
  closeOnEsc: true,
  closeOnOutsideClick: true,
  valueExtractor: (option) => option.value,
  renderOption: SelectOption,
  dropdownWidth: 300,
  dropdownHeight: 500,
  rowHeight: 40,
};

export default Select;
