import { getDefaultKeyBinding, KeyBindingUtil } from 'draft-js';

export default function keyBindingFn(e) {
  if (e.keyCode === 65 && KeyBindingUtil.hasCommandModifier(e)) {
    return 'select-all';
  }
  return getDefaultKeyBinding(e);
}
