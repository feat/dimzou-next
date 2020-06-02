export default function errorInfo(err) {
  if (process.browser) {
    return err;
  }
  return {
    message: err.message,
  }
}