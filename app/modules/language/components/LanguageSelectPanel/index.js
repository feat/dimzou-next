import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import groupBy from 'lodash/groupBy';
import sortBy from 'lodash/sortBy';

import { formatMessage } from '@/services/intl';
import commonMessages from '@/messages/common';

import FeatModal from '@feat/feat-ui/lib/feat-modal';
import Button from '@feat/feat-ui/lib/button';
import notification from '@feat/feat-ui/lib/notification';

// import InlineCarouselSelect from '@/components/InlineCarouselSelect';

import TranslatableMessage from '@/modules/language/containers/TranslatableMessage';
import { withDeviceInfo } from '@/modules/device-info';

import AddLocaleWidget from '../AddLocaleWidget';

import intlMessages from './messages';

import './style.scss';

// const ALL_LANGUAGE = 'all';

class LanguageSelectPanel extends React.PureComponent {
  state = {
    selectedGroup: undefined,
  };

  componentDidMount() {
    if (!this.props.locales) {
      try {
        this.props.fetchLocales();
      } catch (err) {
        notification.error({
          message: 'Error',
          description: err.message,
        });
      }
      // this.props.fetchLocales().catch((err) => {
      //   notification.error({
      //     message: 'Error',
      //     description: err.message,
      //   })
      // });
    }
  }

  selectLang = (value) => {
    const data = this.props.locales.find((lang) => lang.locale === value);
    this.props.onConfirm(value, data);
  };

  handleCreateLocale = (values) =>
    this.props.createLocale(values).then(() => {
      this.addWidget.reset();
    });

  handleGroupOptionClick = (group) => {
    const region = document.querySelector(`#${group.value}`);
    const content = document.querySelector('.LanguageSelect__groups');
    const regionTop = region.offsetTop;

    if (this.state.selectedGroup === group.value) {
      this.setState({
        selectedGroup: undefined,
      });
      content.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    } else {
      this.setState({
        selectedGroup: group.value,
      });
      content.scrollTo({
        top: regionTop,
        behavior: 'smooth',
      });
    }
  };

  // 清除滚动条挤压宽度；
  handleMouseOver = () => {
    const LanguageSelectGroups = document.querySelector(
      '.LanguageSelect__groups',
    );
    const GroupsRect = LanguageSelectGroups.getBoundingClientRect();
    LanguageSelectGroups.style.marginRight = `${0 -
      (GroupsRect.width - LanguageSelectGroups.clientWidth)}px`;
  };

  handleMouseOut = () => {
    const LanguageSelectGroups = document.querySelector(
      '.LanguageSelect__groups',
    );
    LanguageSelectGroups.style.marginRight = '0px';
  };

  renderSelect() {
    const { locales, selectedLang, canCreateLocale } = this.props;
    const { selectedGroup } = this.state;
    // const languageGroup = groupBy(locales, (item) => item.continent_code);
    const languageSort = sortBy(locales, (item) => item.label_region);
    const languageGroup = groupBy(languageSort, (item) => item.region_sub1);
    delete languageGroup.null;
    const groupOptions = [
      ...Object.keys(languageGroup)
        .sort()
        .map((key) => ({
          value: key,
          label: formatMessage(intlMessages[key.replace('-', '')]),
        })),
    ];

    if (canCreateLocale) {
      groupOptions.push({
        value: 'custom',
        label: formatMessage(intlMessages.customLabel),
      });
      languageGroup.custom = locales.filter((item) => item.is_custom);
    }

    // const langOptions =
    //   selectedGroup === undefined
    //     ? locales
    //     : languageGroup[selectedGroup] || [];
    return (
      <FeatModal className="LanguageSelect">
        <FeatModal.Wrap>
          <FeatModal.Header>
            <FeatModal.Title className="LanguageSelectFlex__option">
              <TranslatableMessage
                message={
                  this.props.isRegion
                    ? intlMessages.panelRegionTitle
                    : intlMessages.panelTitle
                }
              />
            </FeatModal.Title>
            {this.props.isDesktop && (
              <FeatModal.SubHeader className="LanguageSelectFlex__option">
                {/* <InlineCarouselSelect
                  options={groupOptions}
                  value={this.state.selectedGroup}
                  onChange={this.handleGroupOptionClick}
                  renderLabel={(item) => item.label}
                  valueExtractor={(item) => item.value}
                /> */}
                {groupOptions.map((option, index) => (
                  <Button
                    type="merge"
                    className={classNames({
                      'is-selected': selectedGroup === option.value,
                    })}
                    onClick={() => this.handleGroupOptionClick(option, index)}
                  >
                    {option.label}
                  </Button>
                ))}
              </FeatModal.SubHeader>
            )}
          </FeatModal.Header>
          <FeatModal.Content
            className="LanguageSelect__groups"
            onFocus={() => 0}
            onBlur={() => 0}
            onMouseOver={this.handleMouseOver}
            onMouseOut={this.handleMouseOut}
          >
            {groupOptions.map((groupOption) => (
              <div key={groupOption.value} className="LanguageSelect__group">
                <div
                  className="LanguageSelect__group_label"
                  id={groupOption.value}
                >
                  {groupOption.label}
                </div>
                <div className="LanguageSelectGrid">
                  {languageGroup[groupOption.value].map((lang) => (
                    <div
                      className="LanguageSelectGrid__cell LanguageSelectGrid__cell_option"
                      key={lang.id}
                    >
                      <Button
                        className={classNames('LanguageSelect__option', {
                          'is-selected': lang.locale === selectedLang,
                        })}
                        block
                        type="merge"
                        value={lang.label}
                        disabled={this.props.shouldDisable ? this.props.shouldDisable(lang) : false}
                        onClick={() => this.selectLang(lang.locale)}
                      >
                        {this.props.isRegion ? lang.label_region : lang.label}
                      </Button>
                    </div>
                  ))}
                  {groupOption.value === 'custom' && (
                    <div className="LanguageSelect__addWidget">
                      <AddLocaleWidget
                        ref={(n) => {
                          this.addWidget = n;
                        }}
                        onSubmit={this.handleCreateLocale}
                      />
                    </div>
                  )}
                </div>
              </div>
            ))}
            {/* {selectedGroup === 'custom' && (
                  <div className="LanguageSelect__addWidget">
                    <AddLocaleWidget
                      ref={(n) => {
                        this.addWidget = n;
                      }}
                      onSubmit={this.handleCreateLocale}
                    />
                  </div>
                )} */}
          </FeatModal.Content>
        </FeatModal.Wrap>
      </FeatModal>
    );
  }

  render() {
    const { locales, style } = this.props;
    return (
      <div style={style}>
        {locales ? (
          this.renderSelect()
        ) : (
          <FeatModal className="LanguageSelect">
            <FeatModal.Wrap>
              <FeatModal.Header>
                <FeatModal.Title>
                  <TranslatableMessage
                    message={
                      this.props.isRegion
                        ? intlMessages.panelRegionTitle
                        : intlMessages.panelTitle
                    }
                  />
                </FeatModal.Title>
              </FeatModal.Header>
              <FeatModal.Content>
                <TranslatableMessage message={commonMessages.loading} />
              </FeatModal.Content>
            </FeatModal.Wrap>
          </FeatModal>
        )}
      </div>
    );
  }
}

LanguageSelectPanel.propTypes = {
  locales: PropTypes.array,
  selectedLang: PropTypes.string,
  onConfirm: PropTypes.func.isRequired,
  fetchLocales: PropTypes.func,
  createLocale: PropTypes.func,
  canCreateLocale: PropTypes.bool,
  style: PropTypes.object,
  isDesktop: PropTypes.bool,
  isRegion: PropTypes.bool,
  shouldDisable: PropTypes.func,
};

export default withDeviceInfo(LanguageSelectPanel);
