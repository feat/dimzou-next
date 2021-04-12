import React, { useState, useMemo, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';

import update from 'immutability-helper';
import Router from 'next/router';

import { EditorState, Modifier, convertToRaw } from '@feat/draft-js';

import message from '@feat/feat-ui/lib/message';
import notification from '@feat/feat-ui/lib/notification';

import ActionButton from '@/components/ActionButton';
import { selectCurrentUser } from '@/modules/auth/selectors';
import SimpleCache from '@/services/cache';
import { getText } from '@/utils/content';

import { useIntl } from 'react-intl';
import DimzouEditor, {
  createFromRawData,
  createFromHTML,
  getHTML,
} from '../DimzouEditor';
import WorkshopNavigator from '../WorkshopNavigator';
import ImageDropzone from '../ImageDropzone';
import DraftDocker from '../DraftDocker';

import { getTemplateCoverRatio } from '../../utils/template';
import { getAsPath } from '../../utils/router';

import { getChapterRender } from '../AppRenders';
import { EDIT_PERMISSION_PUBLIC } from '../../constants';
import { validation as vMessages } from '../../messages';

const initTitleRaw = {
  blocks: [{ type: 'header-one', text: '' }],
  entityMap: {},
};

const initSummaryRaw = {
  blocks: [{ type: 'unstyled', text: '' }],
  entityMap: {},
};

const initContentRaw = {
  blocks: [{ type: 'unstyled', text: '' }],
  entityMap: {},
};

function ChapterNodeCreation(props) {
  const { formatMessage } = useIntl();
  const currentUser = useSelector(selectCurrentUser);
  const titleEditorRef = useRef(null);
  const summaryEditorRef = useRef(null);
  const contentEditorRef = useRef(null);

  const cache = useMemo(
    () =>
      new SimpleCache({
        cacheKey: props.cacheKey,
        userId: currentUser.uid,
      }),
    [props.cacheKey, currentUser.uid],
  );

  const [state, setState] = useState({
    template: props.defaultTemplate,
    titleEditorState: cache.get('title')
      ? createFromHTML(cache.get('title'))
      : createFromRawData(initTitleRaw),
    summaryEditorState: cache.get('summary')
      ? createFromHTML(cache.get('summary'))
      : createFromRawData(initSummaryRaw),
    contentEditorState: cache.get('content')
      ? createFromHTML(cache.get('content'))
      : createFromRawData(initContentRaw),
    cover: null,
  });
  const Render = getChapterRender(state.template);

  const titleHasText = state.titleEditorState
    .getCurrentContent()
    .getPlainText()
    .trim();
  const summaryHasText = state.summaryEditorState
    .getCurrentContent()
    .getPlainText()
    .trim();

  const isReady = titleHasText && summaryHasText;
  const footerStyle = !props.canCancel && !isReady ? { opacity: 0 } : undefined;

  let structure;
  let currentEditor;
  if (state.titleEditorState.getSelection().getHasFocus()) {
    structure = 'title';
    currentEditor = 'titleEditorState';
  } else if (state.summaryEditorState.getSelection().getHasFocus()) {
    structure = 'summary';
    currentEditor = 'summaryEditorState';
  } else if (state.contentEditorState.getSelection().getHasFocus()) {
    structure = 'content';
    currentEditor = 'contentEditorState';
  }

  useEffect(
    () => {
      const dom = document.querySelector('.dz-BlockSection_title');
      if (dom) {
        // TODO: getScrollY
        const box = dom.getBoundingClientRect();
        window.scrollTo(0, box.top + window.scrollY - 80);
      }
      titleEditorRef.current && titleEditorRef.current.focus();
    },
    [state.template],
  );

  return (
    <Render
      sidebarFirst={<WorkshopNavigator />}
      cover={
        <ImageDropzone
          data={state.cover}
          ratio={getTemplateCoverRatio(state.template)}
          onConfirm={(data) => {
            setState(
              update(state, {
                cover: {
                  $set: data,
                },
              }),
            );
          }}
        />
      }
      title={
        <div className="dz-BlockSection dz-BlockSection_title">
          <div className="dz-Typo">
            <DimzouEditor
              ref={titleEditorRef}
              mode="create"
              structure="title"
              placeholder={
                <div className="dz-Typo__titlePlaceholder">
                  {props.titlePlaceholder}
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
                setState(
                  update(state, {
                    titleEditorState: {
                      $set: titleEditorState,
                    },
                  }),
                );
                cache.set(
                  'title',
                  getHTML(titleEditorState.getCurrentContent()),
                );
              }}
              currentUser={currentUser}
            />
          </div>
        </div>
      }
      summary={
        <div className="dz-BlockSection dz-BlockSection_summary">
          <div className="dz-Typo">
            <DimzouEditor
              mode="create"
              ref={summaryEditorRef}
              placeholder={props.summaryPlaceholder}
              editorState={state.summaryEditorState}
              handleKeyCommand={(editorState, onChange, command) => {
                if (command === 'backspace') {
                  const content = editorState.getCurrentContent();
                  if (
                    content.getBlockMap().size === 1 &&
                    content.getFirstBlock().getText().length === 0
                  ) {
                    if (content.getFirstBlock().getType() !== 'unstyled') {
                      const summaryEditorState = EditorState.push(
                        editorState,
                        Modifier.setBlockType(
                          content,
                          editorState.getSelection(),
                          'unstyled',
                        ),
                      );
                      setState(
                        update(state, {
                          summaryEditorState: {
                            $set: summaryEditorState,
                          },
                        }),
                      );
                    } else {
                      const titleEditorState = EditorState.moveFocusToEnd(
                        state.titleEditorState,
                      );
                      setState(
                        update(state, {
                          titleEditorState: {
                            $set: titleEditorState,
                          },
                        }),
                      );
                    }
                    return 'handled';
                  }
                }
                return 'not-handled';
              }}
              handleReturn={(editorState) => {
                const contentState = editorState.getCurrentContent();
                if (contentState.hasText()) {
                  contentEditorRef.current && contentEditorRef.current.focus();
                  return 'handled';
                }
                return 'not-handled';
              }}
              onChange={(summaryEditorState) => {
                setState(
                  update(state, {
                    summaryEditorState: {
                      $set: summaryEditorState,
                    },
                  }),
                );
                cache.set(
                  'summary',
                  getHTML(summaryEditorState.getCurrentContent()),
                );
              }}
              currentUser={currentUser}
            />
          </div>
        </div>
      }
      content={
        <>
          <div className="dz-BlockSection dz-Typo">
            <DimzouEditor
              mode="create"
              ref={contentEditorRef}
              placeholder={props.contentPlaceholder}
              editorState={state.contentEditorState}
              onChange={(contentEditorState) => {
                setState(
                  update(state, {
                    contentEditorState: {
                      $set: contentEditorState,
                    },
                  }),
                );
                cache.set(
                  'content',
                  getHTML(contentEditorState.getCurrentContent()),
                );
              }}
              currentUser={currentUser}
              handleKeyCommand={(editorState, onChange, command) => {
                if (command === 'backspace') {
                  const content = editorState.getCurrentContent();
                  if (
                    content.getBlockMap().size === 1 &&
                    content.getFirstBlock().getText().length === 0
                  ) {
                    if (content.getFirstBlock().getType() !== 'unstyled') {
                      const contentEditorState = EditorState.push(
                        editorState,
                        Modifier.setBlockType(
                          content,
                          editorState.getSelection(),
                          'unstyled',
                        ),
                      );
                      setState(
                        update(state, {
                          contentEditorState: {
                            $set: contentEditorState,
                          },
                        }),
                      );
                    } else {
                      const summaryEditorState = EditorState.moveFocusToEnd(
                        state.summaryEditorState,
                      );
                      setState(
                        update(state, {
                          summaryEditorState: {
                            $set: summaryEditorState,
                          },
                        }),
                      );
                    }
                    return 'handled';
                  }
                }
                return 'not-handled';
              }}
            />
          </div>
          <div className="dz-DimzouCreation__footer" style={footerStyle}>
            <ActionButton
              type="no"
              size="md"
              disabled={
                props.canCancel
                  ? state.isSubmitting
                  : !isReady || state.isSubmitting
              }
              onClick={() => {
                cache.flush();
                if (props.onCancel) {
                  props.onCancel();
                } else {
                  setState(
                    update(state, {
                      titleEditorState: {
                        $set: EditorState.moveFocusToEnd(
                          createFromRawData(initTitleRaw),
                        ),
                      },
                      summaryEditorState: {
                        $set: createFromRawData(initSummaryRaw),
                      },
                      contentEditorState: {
                        $set: createFromRawData(initContentRaw),
                      },
                    }),
                  );
                }
              }}
            />
            <ActionButton
              type="ok"
              size="md"
              className="margin_l_24"
              onClick={() => {
                const titleContentState = state.titleEditorState.getCurrentContent();
                const summaryContentState = state.summaryEditorState.getCurrentContent();
                const contentContentState = state.contentEditorState.getCurrentContent();
                const htmlTitle = getHTML(titleContentState);
                const title = convertToRaw(titleContentState);
                const htmlSummary = getHTML(summaryContentState);
                const summary = convertToRaw(summaryContentState);

                const data = {
                  title,
                  htmlTitle,
                  summary,
                  htmlSummary,
                  cover: state.cover,
                  template: state.template,
                  permission: EDIT_PERMISSION_PUBLIC,
                };

                const textContent = contentContentState.getPlainText().trim();
                if (textContent) {
                  data.content = convertToRaw(contentContentState);
                  data.htmlContent = getHTML(contentContentState);
                  data.textContent = textContent;
                }

                // validation
                const textTitle = getText(htmlTitle).trim();
                if (!textTitle) {
                  message.error(formatMessage(vMessages.titleRequired));
                  return;
                }
                const textSummary = getText(htmlSummary).trim();
                if (!textSummary) {
                  message.error(formatMessage(vMessages.summaryRequired));
                  return;
                }
                setState(
                  update(state, {
                    isSubmitting: {
                      $set: true,
                    },
                  }),
                );
                props
                  .onSubmit(data)
                  .then(() => {
                    cache.flush();
                  })
                  .catch((err) => {
                    setState(
                      update(state, {
                        isSubmitting: {
                          $set: false,
                        },
                      }),
                    );
                    notification.error({
                      message: 'Error',
                      description: err.message,
                    });
                  });
              }}
              disabled={!isReady || state.isSubmitting}
            />
          </div>
          <DraftDocker
            blockStructure={structure}
            editorState={state[currentEditor]}
            onEditorChange={(editorState) => {
              setState(
                update(state, {
                  [currentEditor]: {
                    $set: editorState,
                  },
                }),
              );
            }}
            editorMode="create"
            initialTemplate={state.template}
            changeTemplate={(value) => {
              setState(
                update(state, {
                  template: {
                    $set: value,
                  },
                }),
              );
            }}
            isPageCreateActive
            onPageCreateButtonClick={() => {
              Router.back();
            }}
            onCoverCreateButtonClick={() => {
              const href = {
                pathname: '/dimzou-edit',
                query: {
                  pageName: 'create',
                  type: 'cover',
                },
              };
              Router.replace(href, getAsPath(href));
            }}
          />
        </>
      }
    />
  );
}

ChapterNodeCreation.propTypes = {
  titlePlaceholder: PropTypes.node,
  summaryPlaceholder: PropTypes.node,
  contentPlaceholder: PropTypes.node,
  defaultTemplate: PropTypes.string,
  cacheKey: PropTypes.string,
  onCancel: PropTypes.func,
  onSubmit: PropTypes.func,
  canCancel: PropTypes.bool,
};

export default ChapterNodeCreation;

// handleSubmit = (data) => {
//   const { workspace: { chapterCreationContext }, dispatch } = this.props;
//   if (chapterCreationContext) {
//     // create chapter;
//     return dispatch(asyncCreateNode({
//       bundleId: chapterCreationContext.bundleId,
//       template: chapterCreationContext.template,
//       data,
//     }))
//   }
//   // create bundle;
//   return dispatch(asyncCreateBundle(data));
// }
