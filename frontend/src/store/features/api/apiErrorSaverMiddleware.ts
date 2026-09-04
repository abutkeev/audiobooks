import { api } from '@/api/api';
import { createListenerMiddleware, isRejectedWithValue } from '@reduxjs/toolkit';
import redactSecrets from './redactSecrets';
const apiErrorSaver = createListenerMiddleware();

apiErrorSaver.startListening({
  predicate: action => isRejectedWithValue(action),
  effect: (action, { dispatch }) => {
    const meta = (
      action as {
        meta?: {
          arg?: { endpointName?: string; type?: string; originalArgs?: unknown };
          baseQueryMeta?: { response?: { url?: string; status?: number; statusText?: string } };
        };
      }
    ).meta;
    const { endpointName, type, originalArgs } = meta?.arg || {};
    if (endpointName === 'logWrite') return;
    const { url, status, statusText } = meta?.baseQueryMeta?.response || {};

    dispatch(
      api.endpoints.logWrite.initiate({
        logDto: {
          apiError: {
            endpointName,
            type,
            originalArgs: redactSecrets(originalArgs),
            url,
            status,
            statusText,
            userAgent: navigator.userAgent,
          },
        },
      })
    );
  },
});

export default apiErrorSaver.middleware;
