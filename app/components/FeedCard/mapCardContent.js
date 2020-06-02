const MAX_SUMMARY_LENGTH = 200;
export default function (data) {
  const mapped = { ...data };
  if (mapped.summary) {
    mapped.content = `${mapped.summary.slice(0, MAX_SUMMARY_LENGTH)} ...`;
  } else {
    mapped.content = `${mapped.content.slice(0, MAX_SUMMARY_LENGTH)} ...`;
  }
  return mapped;
}
