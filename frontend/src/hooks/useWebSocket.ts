import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store';
import { connect, disconnect } from '@/store/features/websocket';

const useWebSocket = () => {
  const { connected } = useAppSelector(({ websocket }) => websocket);
  const { token } = useAppSelector(({ auth }) => auth);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!connected && token) {
      dispatch(connect());
      return;
    }
    if (connected && !token) {
      dispatch(disconnect());
    }
  }, [connected, token, dispatch]);

  return connected;
};

export default useWebSocket;
