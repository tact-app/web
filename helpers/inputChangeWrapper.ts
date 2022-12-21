import { useEffect, useRef } from 'react';

export const useRunAfterUpdate = () => {
  const afterPaintRef = useRef(null);

  useEffect(() => {
    if (afterPaintRef.current) {
      afterPaintRef.current();
      afterPaintRef.current = null;
    }
  });

  return (fn) => (afterPaintRef.current = fn);
};

export const wrapChange =
  (onChange, run, delta = 0) =>
  (evt) => {
    const input = evt.target;
    const cursor = input.selectionStart;

    onChange(evt);

    run(() => {
      const count = input.value.length;
      const newCursor = cursor + delta > count ? count - 1 : cursor;

      input.setSelectionRange(newCursor, newCursor);
    });
  };
