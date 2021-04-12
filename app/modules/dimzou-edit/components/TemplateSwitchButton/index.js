import { useMemo } from 'react';
import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';
import classNames from 'classnames';

import useSwitch from '@feat/feat-ui/lib/switch-button/useSwitch';
import ButtonBase from '@feat/feat-ui/lib/button/ButtonBase';
import Tooltip from '@feat/feat-ui/lib/tooltip';
import styleVars from '@/styles/variables.module.scss';
import Icon from '../Icon';
import {
  CHAPTER_TEMPLATE_I,
  CHAPTER_TEMPLATE_II,
  CHAPTER_TEMPLATE_III,
  CHAPTER_TEMPLATE_IV,
  CHAPTER_TEMPLATE_V,
} from '../../constants';

import { chapterTemplateOption } from '../../messages';

function TemplateSwitchButton(props) {
  const { formatMessage } = useIntl();
  const options = useMemo(
    () => [
      {
        value: String(CHAPTER_TEMPLATE_I),
        icon: <Icon name="dieI" />,
        label: formatMessage(chapterTemplateOption[CHAPTER_TEMPLATE_I]),
      },
      {
        value: String(CHAPTER_TEMPLATE_II),
        icon: <Icon name="dieII" />,
        label: formatMessage(chapterTemplateOption[CHAPTER_TEMPLATE_II]),
      },
      {
        value: String(CHAPTER_TEMPLATE_III),
        icon: <Icon name="dieIII" />,
        label: formatMessage(chapterTemplateOption[CHAPTER_TEMPLATE_III]),
      },
      {
        value: String(CHAPTER_TEMPLATE_IV),
        icon: <Icon name="dieIV" />,
        label: formatMessage(chapterTemplateOption[CHAPTER_TEMPLATE_IV]),
      },
      {
        value: String(CHAPTER_TEMPLATE_V),
        icon: <Icon name="dieV" />,
        label: formatMessage(chapterTemplateOption[CHAPTER_TEMPLATE_V]),
      },
    ],
    [],
  );

  const [currentOption, next] = useSwitch(
    options,
    props.initialValue,
    props.onChange,
  );

  return (
    <Tooltip
      title={currentOption.label}
      placement="top"
      overlayStyle={{ zIndex: styleVars.dimzouDockerZIndex }}
    >
      <ButtonBase
        disabled={props.disabled}
        className={classNames(props.className)}
        onClick={next}
      >
        {currentOption?.icon}
      </ButtonBase>
    </Tooltip>
  );
}

TemplateSwitchButton.propTypes = {
  initialValue: PropTypes.string,
  onChange: PropTypes.func,
  className: PropTypes.string,
  disabled: PropTypes.bool,
};

export default TemplateSwitchButton;
