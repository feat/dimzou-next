export default function getValidateStatus(meta) {
  if (meta.active && !meta.touched) {
    return undefined;
  }

  if ((!meta.touched && !meta.dirty) || meta.asyncValidating) {
    return undefined;
  }
  if (meta.touched && meta.dirty && !meta.error) {
    return 'success';
  }
  if ((meta.touched || meta.dirty) && meta.error) {
    return 'error';
  }
  return undefined;
}
