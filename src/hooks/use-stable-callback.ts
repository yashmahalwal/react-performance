import { useCallback, useRef } from "react";


/** Hook to create a stable callback */
export function useStableCallback<Args extends Array<unknown>, ReturnType>(
   /** The callback function */
  callback: (...args: Args) => ReturnType
) {
   /** Reference to the callback - maintained in a ref */
  const ref = useRef(callback);
  // Keep the ref updated
  ref.current = callback;

  // Return a memoized callback that invokes ref.current
  return useCallback((...args: Args) => ref.current(...args), []);
}
