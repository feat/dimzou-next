import React, { Component } from "react";
import PropTypes from "prop-types";

import { Row, Col } from "../grid";
import FlatSelect from "../flat-select";
import Button from "../button";

import data from "./data";
import "./style/index.scss";

class LanguageSelect extends Component {
  static propTypes = {
    options: PropTypes.array.isRequired,
    onChange: PropTypes.func,
  }

  state = {
    selectedGroup: this.props.options[0].l_id,
    selectedLang: undefined,
  }

  getGroupOptions() {
    return this.props.options.map((group) => (
      { value: group.l_id, label: group.language_name }
    ));
  }

  getOptions() {
    const selectedGroup = this.state.selectedGroup;
    const { options } = this.props;
    if (options[selectedGroup].children) {
      return options[selectedGroup].children.map((language) => (
        { value: language.l_id, label: language.language_name, meta: language }
      ));
    }
    return [{ value: options[selectedGroup].l_id, label: options[selectedGroup].language_name }];
  }

  getValue(id) {
    let option;
    this.props.options.some((group) => group.children && group.children.some((lang) => {
      if (lang.l_id === id) {
        option = lang;
        return true;
      }
      return false;
    }));
    if (option) {
      return option;
    }
    return undefined;
  }

  selectGroup = (value) => {
    this.setState({
      selectedGroup: value,
    });
  }

  selectLang = (value) => {
    this.setState({
      selectedLang: value,
    });
    this.props.onChange && this.props.onChange(this.getValue(value));
  }

  render() {
    const { selectedGroup, selectedLang } = this.state;
    const groupOptions = this.getGroupOptions();
    const langOptions = this.getOptions();

    return (
      <Row flex className="LanguageSelect">
        <Col span={6} className="LanguageSelect__groups">
          <FlatSelect
            value={selectedGroup}
            onChange={this.selectGroup}
          >
            {groupOptions.map((group) => (
              <Button className="LanguageSelect__option" block type="merge" value={group.value} key={group.value}>{group.label}</Button>
            ))}
          </FlatSelect>
        </Col>
        <Col auto className="LanguageSelect__languages">
          <FlatSelect
            value={selectedLang}
            gridSpan={6}
            onChange={this.selectLang}
          >
            {langOptions.map((lang) => (
              <Button className="LanguageSelect__option" block type="merge" value={lang.value} key={lang.value}>{lang.label}</Button>
            ))}
          </FlatSelect>
        </Col>
      </Row>
    );
  }
}

LanguageSelect.defaultProps = {
  options: data,
};

export default LanguageSelect;
