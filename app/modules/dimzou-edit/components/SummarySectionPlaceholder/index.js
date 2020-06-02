import React from 'react';
import { RectShape, TextRow } from '@feat/feat-ui/lib/placeholder';


function SummarySectionPlaceholder() {
  return (
    <div className="margin_b_36">
      <TextRow />
      <TextRow />
      <TextRow randomWidth />
      <div className="margin_t_12" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <RectShape className="ft-Placeholder margin_r_5" width="2.25rem" height="2.25rem" />
          <RectShape className="ft-Placeholder margin_r_12" width="6rem" height="1rem" />
          <RectShape className="ft-Placeholder margin_r_12" width="5rem" height="1rem" />
          <RectShape className="ft-Placeholder margin_r_12" width="8rem" height="1rem" />
        </div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <RectShape className="ft-Placeholder margin_r_24" width="1.5rem" height="1.5rem" />
          <RectShape className="ft-Placeholder margin_r_24" width="1.5rem" height="1.5rem" />
          <RectShape className="ft-Placeholder margin_r_24" width="1.5rem" height="1.5rem" />
          <RectShape className="ft-Placeholder margin_r_24" width="1.5rem" height="1.5rem" />
        </div>
      </div>
    </div>
  );
}


export default SummarySectionPlaceholder;
