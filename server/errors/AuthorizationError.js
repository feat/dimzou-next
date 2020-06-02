class AuthorizationError extends Error {
  constructor(info) {
    super(info.message);
    this.name = 'AuthorizationError';
    this.data = info.data;
  }
}

export default AuthorizationError;
