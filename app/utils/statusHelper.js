class RequestError extends Error {
  constructor(data) {
    const { status, statusText } = data;
    const name = `${status}: ${statusText}`;
    super(name);
    this.data = data;
  }
}

export default function statusHelper(response) {
  if (response.ok) {
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.indexOf('application/json') !== -1) {
      return response.json();
    }
    return response.text();
  }
  if (response.json) {
    return response.json().then((messages) => {
      const error = {
        status: response.status,
        statusText: response.statusText,
        messages,
      };
      throw new RequestError(error);
    });
  }
  const error = {
    status: response.status,
    statusText: response.statusText,
  };
  throw new RequestError(error);
}
