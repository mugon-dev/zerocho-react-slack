import React, { ChangeEvent, Dispatch, SetStateAction, useCallback, useState } from 'react';

type ReturnTypes<T = ChangeEvent<HTMLInputElement>> = [
  T,
  (e: React.ChangeEvent<HTMLInputElement>) => void,
  Dispatch<SetStateAction<T>>,
];
const useInput = <T = ChangeEvent<HTMLInputElement>>(initialData: T): ReturnTypes<T> => {
  const [value, setValue] = useState(initialData);
  const handler = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value as unknown as T);
  }, []);
  return [value, handler, setValue];
};
export default useInput;
