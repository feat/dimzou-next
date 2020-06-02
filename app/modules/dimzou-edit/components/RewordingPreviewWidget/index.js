import React from 'react';

import { extractWidgetInfo } from '../../utils/rewordings';
import {
  REWORDING_WIDGET_TEXT_EDITOR,
  REWORDING_WIDGET_IMAGE,
  REWORDING_WIDGET_CODE_BLOCK,
} from '../../constants';

import ImageRewording from './ImageRewording';
import CodeBlockRewording from './CodeBlockRewording';
import TextRewording from './TextRewording';

import './style.scss';

const widgetMap = {
  [REWORDING_WIDGET_IMAGE]: ImageRewording,
  [REWORDING_WIDGET_CODE_BLOCK]: CodeBlockRewording,
  [REWORDING_WIDGET_TEXT_EDITOR]: TextRewording,
};

class RewordingWidget extends React.PureComponent {
  render() {
    const widgetInfo = extractWidgetInfo(this.props.data);
    const Render = widgetMap[widgetInfo.type];

    return <Render {...this.props} />;
  }
}

export default RewordingWidget;
