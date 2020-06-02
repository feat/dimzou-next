export default function mapErrorMessages(obj) {
  const mapped = { };

  Object.entries(obj).forEach(([key, value]) => {
    mapped[key] = value.join('; ');
  })
  
  if (obj.non_field_errors) {
    // eslint-disable-next-line
    mapped._error = obj.non_field_errors;
    delete mapped.non_field_errors;
  }
  if (obj.detail) {
    // eslint-disable-next-line
    mapped._error = obj.detail;
    delete mapped.detail;
  }
  return mapped;
}
