import { ForwardedRef } from 'react';

export function useRefWithCallback<T = HTMLElement>(
  forwardedRef: ForwardedRef<T>,
  callback: (element: T) => void
) {
    return (element: T) => {
        callback(element);

        if (forwardedRef) {
            if (typeof forwardedRef === 'function') {
                forwardedRef(element)
            } else {
                forwardedRef.current = element
            }
        }
    };
}
