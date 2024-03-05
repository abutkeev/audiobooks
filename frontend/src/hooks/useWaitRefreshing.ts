import { useEffect, useRef, useState } from 'react';

export default (refreshing: boolean | undefined, onRefreshFinished: () => unknown) => {
  const [waitRefreshing, setWaitRefreshing] = useState(false);
  const calledRef = useRef(false);

  useEffect(() => {
    if (!waitRefreshing) {
      calledRef.current = false;
      return;
    }

    if (!refreshing && !calledRef.current) {
      onRefreshFinished();
      setWaitRefreshing(false);
      calledRef.current = true;
    }

    return () => {
      if (calledRef.current) return;

      onRefreshFinished();
      setWaitRefreshing(false);
      calledRef.current = true;
    };
  }, [waitRefreshing, refreshing, onRefreshFinished]);

  return setWaitRefreshing;
};
