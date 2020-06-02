import React, { useRef, useState, useEffect } from 'react';
import PropTypes from 'prop-types'
import { useSelector } from 'react-redux';
import update from 'immutability-helper';
import Dropzone from 'react-dropzone';
import readFileAsURL from '@/utils/readFileAsURL';

import LazyImage from '@feat/feat-ui/lib/lazy-image';
import {
  EditorState,
  Modifier,
} from '@feat/draft-js';

import { formatMessage } from '@/services/intl';

import { selectCurrentUser } from '@/modules/auth/selectors'
import DimzouEditor, {
  createFromRawData,
  createFromHTML,
  createEmptyWithFocus,
  getHTML,
} from '../DimzouEditor';

import {
  createPlaceholders,
} from '../../messages';

const initTitleRaw = {
  blocks: [{ type: 'header-one', text: '' }],
  entityMap: {},
};

const preparePreview = (file) => {
  if (file.preview) {
    return Promise.resolve();
  }
  
  return readFileAsURL(file).then((url) => {
    // eslint-disable-next-line
      file.preview = url;
  });
};

function SectionReleaseCard(props) {
  const currentUser = useSelector(selectCurrentUser);
  const titleEditorRef = useRef(null);
  const summaryEditorRef = useRef(null);
  const [state, setState] = useState({
    titleEditorState: props.initialValues.title ? createFromHTML(props.initialValues.title) : createFromRawData(initTitleRaw),
    summaryEditorState: props.initialValues.summary ? createFromHTML(props.initialValues.summary) : createEmptyWithFocus(),
    cover: props.initialValues.cover,
  })

  useEffect(() => {
    const titleContentState = state.titleEditorState.getCurrentContent();
    const summaryContentState = state.summaryEditorState.getCurrentContent();
    const title = titleContentState.hasText() ?  getHTML(titleContentState) : '';
    const summary = summaryContentState.hasText() ? getHTML(summaryContentState) : '';
    props.onChange({
      title,
      summary,
      cover: state.cover,
    })
  }, [state])

  return (
    <div className='dz-ReleaseCard'>
      <Dropzone
        onDrop={(files) => {
          logging.debug('drop');
          const file = files[0];
          preparePreview(file).then(() => {
            setState({
              ...state,
              cover: file,
            })
          }) 
        }}
        onDragOver={(e) => {
          e.stopPropagation();
        }}
      >
        {({ getRootProps, getInputProps }) => (
          <div {...getRootProps()} className="ft-ImageDropzone__drop">
            <input {...getInputProps()} />
            {state.cover ? (
              <LazyImage ratio={16 / 9} src={state.cover.preview} />
            ) : (
              <div 
                className='dz-ReleaseCard__coverContainer'
              >
                <span className='dz-ReleaseCard__coverPlaceholder'>
                  {formatMessage(createPlaceholders.cover)}
                </span>
              </div>
            )}
          </div>
        )}
      </Dropzone>
      <div className='typo-Article'>
        <DimzouEditor
          mode="create"
          ref={titleEditorRef}
          placeholder={
            <div className="typo-Article__titlePlaceholder">
              {formatMessage(createPlaceholders.title)}
            </div>
          }
          handleKeyCommand={(editorState, onChange, command) => {
            if (command === 'backspace') {
              const content = editorState.getCurrentContent();
              if (
                content.getBlockMap().size === 1 &&
                  content.getFirstBlock().getText().length === 0
              ) {
                return 'handled';
              }
            }
            return 'not-handled';
          }}
          handleReturn={(editorState) => {
            const contentState = editorState.getCurrentContent();
            if (contentState.hasText()) {
              summaryEditorRef.current && summaryEditorRef.current.focus();
              return 'handled';
            }
            return 'not-handled';
          }}
          editorState={state.titleEditorState}
          onChange={(titleEditorState) => {
            setState(update(state, {
              titleEditorState: {
                $set: titleEditorState,
              },
            }))
          }}
          currentUser={currentUser}
        />
        <DimzouEditor
          mode="create"
          ref={summaryEditorRef}
          placeholder={formatMessage(createPlaceholders.summary)}
          editorState={state.summaryEditorState}
          handleKeyCommand={(editorState, onChange, command) => {
            if (command === 'backspace') {
              const content = editorState.getCurrentContent();
              if (
                content.getBlockMap().size === 1 &&
                    content.getFirstBlock().getText().length === 0
              ) {
                if (content.getFirstBlock().getType() !== 'unstyled') {
                  const summaryEditorState =  EditorState.push(editorState, Modifier.setBlockType(content, editorState.getSelection(), 'unstyled'));
                  setState(update(state, {
                    summaryEditorState: {
                      $set: summaryEditorState,
                    },
                  }))
                } else {
                  const titleEditorState = EditorState.moveFocusToEnd(state.titleEditorState);
                  setState(update(state, {
                    titleEditorState: {
                      $set: titleEditorState,
                    },
                  }))
                }
                return 'handled';
              }
            }
            return 'not-handled';
          }}
          handleReturn={() => 'handled'}
          onChange={(summaryEditorState) => {
            setState(update(state, {
              summaryEditorState: {
                $set: summaryEditorState,
              },
            }))
          }}
          currentUser={currentUser}
        />
      </div>
    </div>
  )
}

SectionReleaseCard.propTypes = {
  onChange: PropTypes.func,
  initialTitle: PropTypes.string,
}

export default SectionReleaseCard;