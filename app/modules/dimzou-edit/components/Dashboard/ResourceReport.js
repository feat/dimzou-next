import React from 'react';
import Block from '@feat/feat-ui/lib/block';
import TranslatableMessage from '@/modules/language/containers/TranslatableMessage';

import intlMessages from './messages';

import ResourceReportTable from './ResourceReportTable';

class ResourceReport extends React.PureComponent {
  render() {
    return (
      <Block
        title={
          <TranslatableMessage message={intlMessages.resourceReportTitle} />
        }
        className="dz-ResourceReport"
      >
        <div className="dz-ResourceReport__brief">
          <div className="dz-ResourceReportBrief">
            <div className="dz-ResourceReportBrief__item">
              <div className="dz-ResourceReportBrief__title">浏览量</div>
              <div className="dz-ResourceReportBrief__data">862131</div>
            </div>
            <div className="dz-ResourceReportBrief__item">
              <div className="dz-ResourceReportBrief__title">收到评论</div>
              <div className="dz-ResourceReportBrief__data">319072</div>
            </div>
            <div className="dz-ResourceReportBrief__item">
              <div className="dz-ResourceReportBrief__title">点赞</div>
              <div className="dz-ResourceReportBrief__data">722359</div>
            </div>
            <div className="dz-ResourceReportBrief__item">
              <div className="dz-ResourceReportBrief__title">获得奖赏</div>
              <div className="dz-ResourceReportBrief__data">781</div>
            </div>
            <div className="dz-ResourceReportBrief__item">
              <div className="dz-ResourceReportBrief__title">编辑者</div>
              <div className="dz-ResourceReportBrief__data">8781</div>
            </div>
            <div className="dz-ResourceReportBrief__item">
              <div className="dz-ResourceReportBrief__title">被关注</div>
              <div className="dz-ResourceReportBrief__data">722</div>
            </div>
          </div>
        </div>
        <div className="dz-ResourceReport__content">
          <ResourceReportTable />
        </div>
      </Block>
    );
  }
}

export default ResourceReport;
