import { useMemo } from 'react'
import PropTypes from 'prop-types'
import { formatMessage } from '@/services/intl';
import SwitchButton from '@feat/feat-ui/lib/switch-button';
import { 
  CHAPTER_TEMPLATE_I,
  CHAPTER_TEMPLATE_II,
  CHAPTER_TEMPLATE_III,
  CHAPTER_TEMPLATE_IV,
  CHAPTER_TEMPLATE_V,
} from '../../constants'

import { chapterTemplateOption } from '../../messages'

function TemplateSwitchButton(props) {
  const options = useMemo(() => [
    {
      value: String(CHAPTER_TEMPLATE_I),
      label: formatMessage(chapterTemplateOption[CHAPTER_TEMPLATE_I]),
    },
    {
      value: String(CHAPTER_TEMPLATE_II),
      label: formatMessage(chapterTemplateOption[CHAPTER_TEMPLATE_II]),
    },
    {
      value: String(CHAPTER_TEMPLATE_III),
      label: formatMessage(chapterTemplateOption[CHAPTER_TEMPLATE_III]),
    },
    {
      value: String(CHAPTER_TEMPLATE_IV),
      label: formatMessage(chapterTemplateOption[CHAPTER_TEMPLATE_IV]),
    },
    {
      value: String(CHAPTER_TEMPLATE_V),
      label: formatMessage(chapterTemplateOption[CHAPTER_TEMPLATE_V]),
    },
  ], null)

  return (
    <SwitchButton
      type="merge"
      className={props.className}
      options={options}
      initialValue={props.initialValue}
      onChange={props.onChange}
    />
  )
}

TemplateSwitchButton.propTypes = {
  initialValue: PropTypes.string,
  onChange: PropTypes.func,
  className: PropTypes.string,
}

export default TemplateSwitchButton;