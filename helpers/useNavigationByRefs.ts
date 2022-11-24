import { useCallback, useEffect, useState, KeyboardEvent, useRef } from 'react';

const numbers = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'];

export type NavigationCallbacks = {
  onForceEnter?: () => void;
  onEnter?: () => void;
  onNumber?: (number: number) => void;
};

const defaultCallbacks: NavigationCallbacks = {};

export const useNavigationByRefs = (
  callbacks: NavigationCallbacks = defaultCallbacks
) => {
  const refs = useRef([]);
  const [focusedIndex, setFocusedIndex] = useState(null);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      const filteredRefs = refs.current.filter(Boolean);

      if (e.key === 'ArrowDown' || e.key === 'k') {
        e.preventDefault();

        setFocusedIndex((index) => {
          if (e.metaKey || e.ctrlKey) {
            return filteredRefs.length - 1;
          } else if (index !== null) {
            const nextIndex = index + 1;

            if (nextIndex >= filteredRefs.length) {
              return 0;
            }

            return nextIndex;
          } else {
            return 0;
          }
        });
      } else if (e.key === 'ArrowUp' || e.key === 'j') {
        e.preventDefault();

        setFocusedIndex((index) => {
          if (e.metaKey || e.ctrlKey) {
            return 0;
          } else if (index !== null) {
            const nextIndex = index - 1;

            if (nextIndex < 0) {
              return filteredRefs.length - 1;
            }

            return nextIndex;
          } else {
            return filteredRefs.length - 1;
          }
        });
      } else if (e.key === 'l') {
        e.preventDefault();

        setFocusedIndex(filteredRefs.length - 1);
      } else if (numbers.includes(e.key)) {
        e.preventDefault();

        const index = parseInt(e.key) - 1;

        if (index === focusedIndex) {
          filteredRefs[focusedIndex].click();
        } else if (index < filteredRefs.length) {
          setFocusedIndex(index);
          callbacks.onNumber?.(index);
        }
      } else if (e.key === 'Enter') {
        e.preventDefault();

        if (e.metaKey || e.ctrlKey) {
          callbacks.onForceEnter?.();
        } else {
          if (callbacks.onEnter) {
            callbacks.onEnter();
          } else if (focusedIndex !== null) {
            filteredRefs[focusedIndex].click();
          }
        }
      }
    },
    [focusedIndex, callbacks]
  );

  const handleFocus = useCallback((e) => {
    const filteredRefs = refs.current.filter(Boolean);

    const index = filteredRefs.indexOf(e.target);

    if (index !== -1) {
      setFocusedIndex(index);
    } else {
      setFocusedIndex(null);
    }
  }, []);

  const setRefs = useCallback(
    (index: number, ref: HTMLElement) => {
      refs.current[index] = ref;

      if (index === 0 && ref && focusedIndex === null) {
        setFocusedIndex(0);
        ref.focus();
      }
    },
    [focusedIndex]
  );

  const reset = useCallback(() => {
    setFocusedIndex(null);
  }, []);

  const focus = useCallback((index: number) => {
    const filteredRefs = refs.current.filter(Boolean);

    if (index !== null) {
      filteredRefs[index].focus();
    }

    setFocusedIndex(index);
  }, []);

  useEffect(() => {
    const filteredRefs = refs.current.filter(Boolean);
    const ref = filteredRefs[focusedIndex];

    if (ref) {
      ref.focus();
    }
  }, [focusedIndex]);

  return {
    handleKeyDown,
    handleFocus,
    focus,
    refs,
    setRefs,
    reset,
  };
};
