import { useEffect, useState } from 'react';

function useUpdatingState<T>(initialValue: T): [T, (value: T) => void] {
  const [value, setValue] = useState(initialValue);
  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);
  return [value, setValue];
}

export default useUpdatingState;
