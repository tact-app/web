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

export const wrapChange = (onChange, run) => (evt) => {
  const input = evt.target;
  const cursor = input.selectionStart;

  onChange(evt);

  run(() => {
    input.selectionStart = cursor;
    input.selectionEnd = cursor;
  });
};
