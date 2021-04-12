import {
  useCallback,
  useRef,
  useImperativeHandle,
  forwardRef,
  useReducer,
  useEffect,
  useMemo,
} from 'react';
import PropTypes from 'prop-types';
import composeRefs from '@seznam/compose-react-refs';
import { fromEvent } from 'file-selector';
import { useDrop } from 'react-dnd';
import { NativeTypes } from 'react-dnd-html5-backend';
import {
  composeEventHandlers,
  isIeOrEdge,
  fileAccepted,
  fileMatchSize,
  TOO_MANY_FILES_REJECTION,
} from './utils';

const defaultProps = {
  disabled: false,
  getFilesFromEvent: fromEvent,
  maxSize: Infinity,
  minSize: 0,
  multiple: true,
  maxFiles: 0,
  // preventDropOnDocument: true,
  noClick: false,
  noKeyboard: false,
  noDrag: false,
  // noDragEventsBubbling: false,
};

const initialState = {
  isFocused: false,
  isFileDialogActive: false,
  pointer: null,
};

function reducer(state, action) {
  /* istanbul ignore next */
  switch (action.type) {
    case 'focus':
      return {
        ...state,
        isFocused: true,
      };
    case 'blur':
      return {
        ...state,
        isFocused: false,
      };
    case 'openDialog':
      return {
        ...state,
        isFileDialogActive: true,
      };
    case 'closeDialog':
      return {
        ...state,
        isFileDialogActive: false,
      };
    case 'setPointer':
      return {
        ...state,
        pointer: action.payload,
      };
    case 'reset':
      return {
        ...state,
        isFileDialogActive: false,
      };
    default:
      return state;
  }
}

function useFileDropzone(options = {}) {
  const {
    disabled,
    onFileDialogCancel,
    noClick,
    noKeyboard,
    noDrag,
    accept,
    multiple,
    minSize,
    maxSize,
    maxFiles,
    getFilesFromEvent,
    canDrop,
    onDrop,
    onDropAccepted,
    onDropRejected,
  } = {
    ...defaultProps,
    ...options,
  };
  const rootRef = useRef(null);
  const inputRef = useRef(null);

  const [state, dispatch] = useReducer(reducer, initialState);

  const { isFocused, isFileDialogActive } = state;

  const composeHandler = (fn) => (disabled ? null : fn);

  const composeKeyboardHandler = (fn) =>
    noKeyboard ? null : composeHandler(fn);

  const composeDragHandler = (fn) => (noDrag ? null : composeHandler(fn));

  const onClickCb = useCallback(
    () => {
      if (noClick) {
        return;
      }
      // In IE11/Edge the file-browser dialog is blocking, therefore, use setTimeout()
      // to ensure React can handle state changes
      // See: https://github.com/react-dropzone/react-dropzone/issues/450
      if (isIeOrEdge()) {
        setTimeout(openFileDialog, 0);
      } else {
        openFileDialog();
      }
    },
    [inputRef, noClick],
  );

  const onFocusCb = useCallback(() => {
    dispatch({ type: 'focus' });
  }, []);
  const onBlurCb = useCallback(() => {
    dispatch({ type: 'blur' });
  }, []);

  // Cb to open the file dialog when SPACE/ENTER occurs on the dropzone
  const onKeyDownCb = useCallback(
    (event) => {
      // Ignore keyboard events bubbling up the DOM tree
      if (!rootRef.current || !rootRef.current.isEqualNode(event.target)) {
        return;
      }

      if (event.keyCode === 32 || event.keyCode === 13) {
        event.preventDefault();
        openFileDialog();
      }
    },
    [rootRef, inputRef],
  );

  const handleFiles = useCallback(
    (files) => {
      const acceptedFiles = [];
      const fileRejections = [];

      files.forEach((file) => {
        const [accepted, acceptError] = fileAccepted(file, accept);
        const [sizeMatch, sizeError] = fileMatchSize(file, minSize, maxSize);
        if (accepted && sizeMatch) {
          acceptedFiles.push(file);
        } else {
          const errors = [acceptError, sizeError].filter((e) => e);
          fileRejections.push({ file, errors });
        }
      });

      if (
        (!multiple && acceptedFiles.length > 1) ||
        (multiple && maxFiles >= 1 && acceptedFiles.length > maxFiles)
      ) {
        // Reject everything and empty accepted files
        acceptedFiles.forEach((file) => {
          fileRejections.push({ file, errors: [TOO_MANY_FILES_REJECTION] });
        });
        acceptedFiles.splice(0);
      }

      if (onDrop) {
        onDrop(acceptedFiles, fileRejections);
      }
      if (fileRejections.length > 0 && onDropRejected) {
        onDropRejected(fileRejections);
      }
      if (acceptedFiles.length > 0 && onDropAccepted) {
        onDropAccepted(acceptedFiles);
      }
    },
    [
      accept,
      minSize,
      maxSize,
      multiple,
      onDrop,
      onDropAccepted,
      onDropRejected,
    ],
  );

  const onDropCb = useCallback(
    (item) => {
      if (item.files && item.files.length) {
        handleFiles(item.files);
      }
    },
    [handleFiles],
  );

  const [collected, dropRef] = useDrop({
    accept: NativeTypes.FILE,
    drop: composeDragHandler(onDropCb),
    canDrop,
    collect: (monitor) => ({
      isOver: noDrag ? false : monitor.isOver(),
      isShallowOver: noDrag ? false : monitor.isOver({ shallow: true }),
      canDrop: monitor.canDrop(),
    }),
  });

  const onDragOverCb = useCallback((event) => {
    const pointer = {
      x: event.clientX,
      y: event.clientY,
    };
    dispatch({
      type: 'setPointer',
      payload: pointer,
    });
  });

  const openFileDialog = useCallback(
    () => {
      if (inputRef.current) {
        dispatch({ type: 'openDialog' });
        inputRef.current.value = null;
        inputRef.current.click();
      }
    },
    [dispatch],
  );

  // Update file dialog active state when the window is focused on
  const onWindowFocus = () => {
    // Execute the timeout only if the file dialog is opened in the browser
    if (isFileDialogActive) {
      setTimeout(() => {
        if (inputRef.current) {
          const { files } = inputRef.current;

          if (!files.length) {
            dispatch({ type: 'closeDialog' });

            if (typeof onFileDialogCancel === 'function') {
              onFileDialogCancel();
            }
          }
        }
      }, 300);
    }
  };
  useEffect(
    () => {
      window.addEventListener('focus', onWindowFocus, false);
      return () => {
        window.removeEventListener('focus', onWindowFocus, false);
      };
    },
    [inputRef, isFileDialogActive, onFileDialogCancel],
  );

  const getRootProps = useMemo(
    () => ({
      refKey = 'ref',
      onKeyDown,
      onFocus,
      onBlur,
      onClick,
      onDragEnter,
      onDragOver,
      onDragLeave,
      ...rest
    } = {}) => ({
      onKeyDown: composeKeyboardHandler(
        composeEventHandlers(onKeyDown, onKeyDownCb),
      ),
      onFocus: composeKeyboardHandler(composeEventHandlers(onFocus, onFocusCb)),
      onBlur: composeKeyboardHandler(composeEventHandlers(onBlur, onBlurCb)),
      onClick: composeHandler(composeEventHandlers(onClick, onClickCb)),
      // onDragEnter: composeDragHandler(
      //   composeEventHandlers(onDragEnter, onDragEnterCb)
      // ),
      onDragOver: composeDragHandler(
        composeEventHandlers(onDragOver, onDragOverCb),
      ),
      // onDragLeave: composeDragHandler(
      //   composeEventHandlers(onDragLeave, onDragLeaveCb)
      // ),
      [refKey]: composeRefs(rootRef, dropRef),
      ...(!disabled && !noKeyboard ? { tabIndex: 0 } : {}),
      ...rest,
    }),
    [rootRef],
  );

  const onInputChangeCb = useCallback(
    (event) => {
      getFilesFromEvent(event).then(handleFiles);
    },
    [handleFiles],
  );

  const onInputElementClick = useCallback((event) => {
    event.stopPropagation();
  }, []);

  const getInputProps = useMemo(
    () => ({ refKey = 'ref', onChange, onClick, ...rest } = {}) => {
      const inputProps = {
        accept,
        multiple,
        type: 'file',
        style: { display: 'none' },
        onChange: composeHandler(
          composeEventHandlers(onChange, onInputChangeCb),
        ),
        onClick: composeHandler(
          composeEventHandlers(onClick, onInputElementClick),
        ),
        autoComplete: 'off',
        tabIndex: -1,
        [refKey]: inputRef,
      };

      return {
        ...inputProps,
        ...rest,
      };
    },
    [],
  );

  return {
    ...state,
    ...collected,
    getRootProps,
    getInputProps,
    isFocused: isFocused && !disabled,
    rootRef,
    inputRef,
    open: composeHandler(openFileDialog),
  };
}

const FileDropzone = forwardRef(({ children, ...params }, ref) => {
  const { open, ...props } = useFileDropzone(params);
  useImperativeHandle(ref, () => ({ open }), [open]);

  return children({ ...props, open });
});

FileDropzone.displayName = 'FileDropzone';

FileDropzone.propTypes = {
  children: PropTypes.func,
  accept: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.arrayOf(PropTypes.string),
  ]),
  onDrop: PropTypes.func,
  multiple: PropTypes.bool,
  disabled: PropTypes.bool,
  noClick: PropTypes.bool,
  noDrag: PropTypes.bool,
  noKeyboard: PropTypes.bool,
  maxSize: PropTypes.number,
  minSize: PropTypes.number,
  maxFiles: PropTypes.number,
  getFilesFromEvent: PropTypes.func,
};

FileDropzone.defaultProps = defaultProps;

export default FileDropzone;
