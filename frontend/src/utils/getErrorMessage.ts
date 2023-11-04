const getErrorMessage = (e: unknown, defaultMessage: string) => {
  if (e instanceof Error) {
    return e.message;
  }

  if (
    e &&
    typeof e === 'object' &&
    'data' in e &&
    e.data &&
    typeof e.data === 'object' &&
    'message' in e.data &&
    typeof e.data.message === 'string'
  ) {
    return e.data.message;
  }

  if (e && typeof e === 'object' && 'error' in e && e.error && typeof e.error === 'string') {
    return e.error;
  }

  return defaultMessage;
};

export default getErrorMessage;
