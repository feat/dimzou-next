import React from 'react';
import { RectShape, TextBlock, TextRow } from '@feat/feat-ui/lib/placeholder';

function ContentBlockSectionPlaceholder() {
  return (
    <div className="dz-BlockSection dz-BlockSection_content">
      <div className="dz-BlockSection__wrapper" />
      <div className="dz-BlockSection__main">
        <div className="dz-BlockSectionCurrent">
          <div className="dz-BlockSection__leading">
            <RectShape
              className="ft-Placeholder margin_r_5"
              width="2.25rem"
              height="2.25rem"
            />
            <div className="dz-BlockSection__paraNum" />
          </div>
          <div className="dz-BlockSectionCurrent__main">
            <div
              className="dz-BlockSectionCurrent__userInfo"
              style={{ display: 'flex' }}
            >
              <div style={{ width: '6rem', marginRight: 12 }}>
                <TextRow />
              </div>
              <div style={{ width: '5rem', marginRight: 12 }}>
                <TextRow />
              </div>
              <div style={{ width: '8rem', marginRight: 12 }}>
                <TextRow />
              </div>
            </div>
            <div>
              <TextBlock row={3} randomWidth />
            </div>
          </div>
          <div className="dz-BlockSectionFooter" style={{ display: 'flex' }}>
            <div
              className="dz-BlockSectionFooter__left"
              style={{ display: 'flex' }}
            >
              <span className="dz-BlockSectionFooter__action">
                <RectShape width="1.5rem" height="1.5rem" />
              </span>
              <span className="dz-BlockSectionFooter__action">
                <RectShape width="1.5rem" height="1.5rem" />
              </span>
              <span className="dz-BlockSectionFooter__action">
                <RectShape width="1.5rem" height="1.5rem" />
              </span>
              <span className="dz-BlockSectionFooter__action">
                <RectShape width="1.5rem" height="1.5rem" />
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ContentBlockSectionPlaceholder;
