import React from 'react';

export default (refreshing: boolean | undefined, onRefreshFinished: () => unknown) => {
  const [waitRefreshing, setWaitRefreshing] = React.useState(false);
  React.useEffect(() => {
    if (waitRefreshing && !refreshing) {
      onRefreshFinished();
      setWaitRefreshing(false);
    }
  }, [waitRefreshing, refreshing, onRefreshFinished]);
  return setWaitRefreshing;
};
