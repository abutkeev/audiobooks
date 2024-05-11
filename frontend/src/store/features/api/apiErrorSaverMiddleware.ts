import { api } from '@/api/api';
import { createListenerMiddleware, isRejectedWithValue } from '@reduxjs/toolkit';
const apiErrorSaver = createListenerMiddleware();

apiErrorSaver.startListening({
  predicate: action => isRejectedWithValue(action),
  effect: (action: any, { dispatch }) => {
    const { endpointName, type, originalArgs } = action.meta?.arg || {};
    if (endpointName === 'logWrite') return;
    const { url, status, statusText } = action.meta?.baseQueryMeta?.response || {};

    dispatch(
      api.endpoints.logWrite.initiate({
        object: { apiError: { endpointName, type, originalArgs, url, status, statusText } },
      })
    );
  },
});

export default apiErrorSaver.middleware;
