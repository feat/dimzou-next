import React, { useState, useEffect, useContext } from 'react';
import PropTypes from 'prop-types';

import readFileAsURL from '@/utils/readFileAsURL';
import Button from '@feat/feat-ui/lib/button';
import { formatMessage } from '@/services/intl';

import { RectShape } from '@feat/feat-ui/lib/placeholder';
import { 
  removeAppendBlock,
  submitMediaBlock,
  commitMediaBlock,
} from '../../actions';
import { UserCapabilitiesContext, useMeasure } from '../../context';
import { uploadBlock as uploadBlockMessages } from './messages'

function UploadBlock(props) {
  const [fileUrl, setFileUrl] = useState();
  const userCapabilities = useContext(UserCapabilitiesContext);

  useEffect(() => {
    readFileAsURL(props.file).then((url) => {
      setFileUrl(url);
    });
  }, [props.file]);
  useMeasure([fileUrl]);

  let maskLayer = null;
  if (props.requestError) {
    const canRetry = props.requestError.code !== 'DIMZOU_NODE_HAS_BEEN_LOCKED';
    maskLayer = (
      <div className="dz-BlockSection__mask">
        <div style={{ width: 320, maxheight: 260, textAlign: 'center', paddingTop: 16, paddingBottom: 16, paddingLeft: 14, paddingRight: 24, backgroundColor: 'rgba(255, 255, 255, .6)'}}>
          <div style={{ marginBottom: 12, fontSize: 22, fontWeight: 600 }}>
            {formatMessage(uploadBlockMessages.error)}
          </div>
          <div style={{ marginBottom: 16, fontSize: 16, lineHeight: 1.25 }}>
            {props.requestError.message}
          </div>
          <div>
            {canRetry && (
              <Button
                onClick={() => {
                  const creator = userCapabilities.canElect ? commitMediaBlock : submitMediaBlock;
                  props.dispatch(creator({
                    bundleId: props.bundleId,
                    nodeId: props.nodeId,
                    pivotId: props.pivotId,
                    file: props.file,
                    retry: true,
                  }));
                }}
              >{formatMessage(uploadBlockMessages.retry)}</Button>
            )}
            <Button
              style={canRetry ? { marginLeft: 36 } : {}}
              onClick={() => {
                props.dispatch(removeAppendBlock({
                  nodeId: props.nodeId,
                  pivotId: props.pivotId,
                }))
              }}
              type='merge'
            >{formatMessage(uploadBlockMessages.cancel)}</Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="dz-BlockSection dz-BlockSection_content dz-BlockSection_placeholder" style={props.style}>
      <div className="dz-BlockSection__paraNum"></div>
      <div className="dz-BlockSection__wrapper" style={{ position: 'relative' }}>
        {fileUrl ? (
          <div className="typo-Article">
            <figure>
              <img src={fileUrl} alt="upload" />
            </figure>
          </div>
        ) : (
          <RectShape className="dz-Text__imagePlaceholder" ratio={16 / 9} />
        )}
        {maskLayer}
      </div> 
    </div>
  )
}

UploadBlock.propTypes = {
  file: PropTypes.object.isRequired,
  requestError: PropTypes.object,
  bundleId: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string,
  ]),
  nodeId: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string,
  ]),
  pivotId: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string,
  ]),
  dispatch: PropTypes.func,
  style: PropTypes.object,
};

export default UploadBlock;
