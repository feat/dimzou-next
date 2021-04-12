import React from 'react';
import PropTypes from 'prop-types';
import get from 'lodash/get';
import { injectIntl } from 'react-intl';
import Checkbox from '@feat/feat-ui/lib/checkbox';
import message from '@feat/feat-ui/lib/message';
import TranslatableMessage from '@/modules/language/containers/TranslatableMessage';
import ActionButton from '@/components/ActionButton';
import { FeedRenderContext } from '@/components/FeedRender/Provider';
import { cardPreview as cMessages } from '../../messages';
import {
  CardI,
  CardII,
  CardIII,
  CardIV,
  CardV,
  CardVI,
  CardVII,
  CardVIII,
  CardIX,
  CardX,
  CardXI,
  CardXII,
} from './CardWidget';

import './style.scss';

const BASE_KEY = '_base';
class CardPreviewPanel extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: props.data || {},
      updateAll: true,
    };
  }

  getTitle = (templateCode) =>
    get(
      this.state.data,
      [templateCode, 'title'],
      get(this.state.data, [BASE_KEY, 'title'], this.props.baseInfo.title),
    );

  getBody = (templateCode) =>
    get(
      this.state.data,
      [templateCode, 'body'],
      get(this.state.data, [BASE_KEY, 'body'], this.props.baseInfo.body),
    );

  getCover = (templateCode) =>
    get(
      this.state.data,
      [templateCode, 'cover'],
      get(this.state.data, [BASE_KEY, 'cover'], this.props.baseInfo.cover),
    );

  handleWidgetChange = (templateCode, info) => {
    const key = this.state.updateAll ? BASE_KEY : templateCode;
    let templateInfo;
    if (info.value === undefined) {
      templateInfo = {
        ...(this.state.data[key] || {}),
      };
      delete templateInfo[info.field];
    } else {
      templateInfo = {
        ...(this.state.data[key] || {}),
        [info.field]: info.value,
      };
    }

    this.setState({
      data: {
        ...this.state.data,
        [key]: templateInfo,
      },
    });
  };

  handleCoverUpload = (code, file) => {
    this.props.onFileUpload(file).then((res) => {
      this.handleWidgetChange(code, {
        field: 'cover',
        value: res.url,
      });
    });
  };

  handleSubmit = () => {
    const {
      intl: { formatMessage },
    } = this.props;
    // TODO: cleanup data
    if (!this.getTitle()) {
      message.error(formatMessage(cMessages.titleRequried));
      return;
    }
    if (!this.getBody()) {
      message.error(formatMessage(cMessages.summaryRequired));
      return;
    }

    this.props.onSubmit(this.state.data);
  };

  cleanUpData = (templateCode) => {
    // FieldTextEditable 可能在 onBlur 时触发state更新，所以此处需要 setTimeout
    setTimeout(() => {
      const templateData = this.state.data[templateCode];
      if (!templateData) {
        return;
      }
      const { baseInfo } = this.props;
      let onceCleaned = false;
      const updated = { ...templateData };
      if (!templateData.title || templateData.title === baseInfo.title) {
        onceCleaned = true;
        delete updated.title;
      }
      if (!templateData.body || templateData.body === baseInfo.body) {
        onceCleaned = true;
        delete updated.body;
      }
      if (onceCleaned) {
        this.setState({
          data: {
            ...this.state.data,
            [templateCode]: updated,
          },
        });
      }
    }, 100);
  };

  render() {
    const { onCancel, baseInfo } = this.props;

    return (
      <div className="dz-ReleasePanel dz-CardPreviewPanel">
        <div className="dz-ReleasePanel__header">
          <div className="dz-ReleasePanel__title">
            <TranslatableMessage message={cMessages.title} />
          </div>
        </div>
        <div className="dz-ReleasePanel__content dz-CardPreviewPanel__content">
          <div className="dz-ReleasePanel__desc dz-CardPreviewPanel__desc">
            <div className="dz-CardPreviewPanel__descInner">
              <TranslatableMessage message={cMessages.desc} />
            </div>
            <div className="dz-CardPreviewPanel__control">
              <Checkbox
                checked={this.state.updateAll}
                onChange={(e) => {
                  this.setState({
                    updateAll: e.target.checked,
                  });
                }}
              >
                <TranslatableMessage message={cMessages.updateAll} />
              </Checkbox>
            </div>
          </div>

          <div className="dz-CardPreviewPanel__canvas">
            <div style={{ float: 'left', width: 750 }}>
              <FeedRenderContext.Provider
                value={{ containerWidth: 750, gridWidth: 750 }}
              >
                <div className="dz-CardPreviewPanel__item">
                  <CardX
                    title={this.getTitle('X')}
                    body={this.getBody('X')}
                    cover={this.getCover('X')}
                    coverCanReset={this.getCover('X') !== baseInfo.cover}
                    author={baseInfo.author}
                    onChange={(info) => {
                      this.handleWidgetChange('X', info);
                    }}
                    onBlur={() => {
                      this.cleanUpData('X');
                    }}
                    uploadCover={(file) => {
                      this.handleCoverUpload('X', file);
                    }}
                  />
                </div>
                <div className="dz-CardPreviewPanel__item">
                  <CardXI
                    title={this.getTitle('XI')}
                    body={this.getBody('XI')}
                    cover={this.getCover('XI')}
                    coverCanReset={this.getCover('XI') !== baseInfo.cover}
                    author={baseInfo.author}
                    onChange={(info) => {
                      this.handleWidgetChange('XI', info);
                    }}
                    uploadCover={(file) => {
                      this.handleCoverUpload('XI', file);
                    }}
                  />
                </div>
                <div className="dz-CardPreviewPanel__item">
                  <CardXII
                    title={this.getTitle('XII')}
                    body={this.getBody('XII')}
                    cover={this.getCover('XII')}
                    coverCanReset={this.getCover('XII') !== baseInfo.cover}
                    author={baseInfo.author}
                    onChange={(info) => {
                      this.handleWidgetChange('XII', info);
                    }}
                    uploadCover={(file) => {
                      this.handleCoverUpload('XII', file);
                    }}
                  />
                </div>
              </FeedRenderContext.Provider>
            </div>
            <div style={{ float: 'right', width: 375 }}>
              <FeedRenderContext.Provider
                value={{ containerWidth: 750, gridWidth: 375 }}
              >
                <div className="dz-CardPreviewPanel__item">
                  <CardVI
                    title={this.getTitle('VI')}
                    body={this.getBody('VI')}
                    cover={this.getCover('VI')}
                    coverCanReset={this.getCover('VI') !== baseInfo.cover}
                    author={baseInfo.author}
                    onChange={(info) => {
                      this.handleWidgetChange('VI', info);
                    }}
                    uploadCover={(file) => {
                      this.handleCoverUpload('VI', file);
                    }}
                  />
                </div>

                <div className="dz-CardPreviewPanel__item">
                  <CardVII
                    title={this.getTitle('VII')}
                    body={this.getBody('VII')}
                    cover={this.getCover('VII')}
                    coverCanReset={this.getCover('VII') !== baseInfo.cover}
                    author={baseInfo.author}
                    onChange={(info) => {
                      this.handleWidgetChange('VII', info);
                    }}
                    uploadCover={(file) => {
                      this.handleCoverUpload('VII', file);
                    }}
                  />
                </div>

                <div className="dz-CardPreviewPanel__item">
                  <CardV
                    title={this.getTitle('V')}
                    body={this.getBody('V')}
                    cover={this.getCover('V')}
                    coverCanReset={this.getCover('V') !== baseInfo.cover}
                    author={baseInfo.author}
                    onChange={(info) => {
                      this.handleWidgetChange('V', info);
                    }}
                    uploadCover={(file) => {
                      this.handleCoverUpload('V', file);
                    }}
                  />
                </div>
                <div className="dz-CardPreviewPanel__item">
                  <CardVIII
                    title={this.getTitle('VIII')}
                    body={this.getBody('VIII')}
                    cover={this.getCover('VIII')}
                    coverCanReset={this.getCover('VIII') !== baseInfo.cover}
                    author={baseInfo.author}
                    onChange={(info) => {
                      this.handleWidgetChange('VIII', info);
                    }}
                    uploadCover={(file) => {
                      this.handleCoverUpload('VIII', file);
                    }}
                  />
                </div>
              </FeedRenderContext.Provider>
              <div
                className="dz-CardPreviewPanel__item"
                style={{ width: 187.5 }}
              >
                <FeedRenderContext.Provider
                  value={{ containerWidth: 750, gridWidth: 187.5 }}
                >
                  <CardI
                    title={this.getTitle('I')}
                    body={this.getBody('I')}
                    cover={this.getCover('I')}
                    coverCanReset={this.getCover('I') !== baseInfo.cover}
                    author={baseInfo.author}
                    onChange={(info) => {
                      this.handleWidgetChange('I', info);
                    }}
                    uploadCover={(file) => {
                      this.handleCoverUpload('I', file);
                    }}
                  />
                </FeedRenderContext.Provider>
              </div>
            </div>
            <div style={{ float: 'left', width: 750 + 12 }}>
              <div
                className="dz-CardPreviewPanel__item"
                style={{ float: 'left', width: 500 }}
              >
                <FeedRenderContext.Provider
                  value={{ containerWidth: 750, gridWidth: 500 }}
                >
                  <CardIX
                    title={this.getTitle('IX')}
                    body={this.getBody('IX')}
                    cover={this.getCover('IX')}
                    coverCanReset={this.getCover('IX') !== baseInfo.cover}
                    author={baseInfo.author}
                    onChange={(info) => {
                      this.handleWidgetChange('IX', info);
                    }}
                    uploadCover={(file) => {
                      this.handleCoverUpload('IX', file);
                    }}
                  />
                </FeedRenderContext.Provider>
              </div>
              <div style={{ float: 'left', marginLeft: 12, width: 250 }}>
                <FeedRenderContext.Provider
                  value={{ containerWidth: 750, gridWidth: 250 }}
                >
                  <div className="dz-CardPreviewPanel__item">
                    <CardII
                      title={this.getTitle('II')}
                      body={this.getBody('II')}
                      cover={this.getCover('II')}
                      coverCanReset={this.getCover('II') !== baseInfo.cover}
                      author={baseInfo.author}
                      onChange={(info) => {
                        this.handleWidgetChange('II', info);
                      }}
                      uploadCover={(file) => {
                        this.handleCoverUpload('II', file);
                      }}
                    />
                  </div>
                  <div className="dz-CardPreviewPanel__item">
                    <CardIII
                      title={this.getTitle('III')}
                      body={this.getBody('III')}
                      cover={this.getCover('III')}
                      coverCanReset={this.getCover('III') !== baseInfo.cover}
                      author={baseInfo.author}
                      onChange={(info) => {
                        this.handleWidgetChange('III', info);
                      }}
                      uploadCover={(file) => {
                        this.handleCoverUpload('III', file);
                      }}
                    />
                  </div>
                  <div className="dz-CardPreviewPanel__item">
                    <CardIV
                      title={this.getTitle('IV')}
                      body={this.getBody('IV')}
                      cover={this.getCover('IV')}
                      coverCanReset={this.getCover('IV') !== baseInfo.cover}
                      author={baseInfo.author}
                      onChange={(info) => {
                        this.handleWidgetChange('IV', info);
                      }}
                      uploadCover={(file) => {
                        this.handleCoverUpload('IV', file);
                      }}
                    />
                  </div>
                </FeedRenderContext.Provider>
              </div>
            </div>
          </div>
        </div>
        <div className="dz-ReleasePanel__footer">
          <div className="dz-ReleasePanel__actions">
            <ActionButton
              className="margin_r_24"
              type="no"
              size="sm"
              onClick={onCancel}
            />
            <ActionButton type="ok" size="sm" onClick={this.handleSubmit} />
          </div>
        </div>
      </div>
    );
  }
}

CardPreviewPanel.propTypes = {
  data: PropTypes.object,
  baseInfo: PropTypes.object, // { title, body, cover, author }  from draft data
  onCancel: PropTypes.func,
  onFileUpload: PropTypes.func,
  onSubmit: PropTypes.func,
  intl: PropTypes.object,
};

export default injectIntl(CardPreviewPanel);
