import { useState, useCallback } from 'react';

function useResizeObserver<T extends Element = Element>() {
  const [entries, setEntries] = useState<ResizeObserverEntry[]>([]);

  const refFunction = useCallback((node: T | null) => {
    if (!node) return;

    const resizeObserver = new ResizeObserver(entries => {
      setEntries(entries);
    });
    resizeObserver.observe(node);
  }, []);

  return [refFunction, entries] as const;
}

export default useResizeObserver;
