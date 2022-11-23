import { useCallback, useEffect, useState, KeyboardEvent, useRef } from 'react';

export const useNavigationByRefs = () => {
  const refs = useRef([]);
  const filteredRefs = refs.current.filter(Boolean);
  const [focusedIndex, setFocusedIndex] = useState(null);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown' || e.key === 'k') {
        e.preventDefault();

        setFocusedIndex((index) => {
          if (index !== null) {
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
          if (index !== null) {
            const nextIndex = index - 1;

            if (nextIndex < 0) {
              return filteredRefs.length - 1;
            }

            return nextIndex;
          } else {
            return filteredRefs.length - 1;
          }
        });
      }
    },
    [filteredRefs.length]
  );

  const setRefs = useCallback(
    (index, ref) => {
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

  useEffect(() => {
    const ref = filteredRefs[focusedIndex];

    if (ref) {
      ref.focus();
    }
  }, [focusedIndex, filteredRefs]);

  return {
    handleKeyDown,
    setRefs,
    reset,
  };
};
