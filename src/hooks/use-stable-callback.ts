import { useCallback, useRef } from "react";

export function useStableCallback<Args extends Array<unknown>, ReturnType>(
  callback: (...args: Args) => ReturnType
) {
  const ref = useRef(callback);
  ref.current = callback;

  return useCallback((...args: Args) => ref.current(...args), []);
}
