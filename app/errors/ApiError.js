class ApiError extends Error {
  constructor(info, fallbackMessage = '') {
    const { code, message, data } = info;
    super(message || fallbackMessage);
    this.code = code;
    this.data = data;
  }
}

export default ApiError;
