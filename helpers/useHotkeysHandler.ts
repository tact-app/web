import { Options, useHotkeys } from 'react-hotkeys-hook/src';
import { useCallback, useMemo } from 'react';
import {
  HotkeysEvent,
  OptionsOrDependencyArray,
} from 'react-hotkeys-hook/src/types';

const normalizeKey = (key: string) => {
  const arr = key.split('+');
  const keyName = arr.pop();

  return arr.sort().concat(keyName).join('+');
};

const getNormalizedKeyFromEvent = (e: HotkeysEvent) => {
  const { keys, mod, ctrl, meta, alt, shift } = e;
  const items = [];

  if (mod) {
    items.push('mod');
  }

  if (ctrl) {
    items.push('ctrl');
  }

  if (meta) {
    items.push('meta');
  }

  if (alt) {
    items.push('alt');
  }

  if (shift) {
    items.push('shift');
  }

  items.sort();
  items.push(...keys);

  return items.join('+');
};

export const useHotkeysHandler = (
  keymap: Record<string, string[] | string>,
  handlers: Record<
    string,
    (event: KeyboardEvent, handler: HotkeysEvent) => void
  >,
  options: Options = {}
) => {
  const { revertedKeymap, keys } = useMemo(() => {
    const result: Record<string, string[]> = {};
    const allKeys: string[] = [];

    Object.entries(keymap).forEach(([name, keysOrKey]) => {
      if (Array.isArray(keysOrKey)) {
        keysOrKey.forEach((key) => {
          const normalizedKey = normalizeKey(key);

          if (!result[normalizedKey]) {
            result[normalizedKey] = [];
          }

          if (!allKeys.includes(normalizedKey)) {
            allKeys.push(normalizedKey);
          }

          result[normalizedKey].push(name);
        });
      } else {
        const normalizedKey = normalizeKey(keysOrKey);

        if (!result[normalizedKey]) {
          result[normalizedKey] = [];
        }

        if (!allKeys.includes(normalizedKey)) {
          allKeys.push(normalizedKey);
        }

        result[normalizedKey].push(name);
      }
    });

    return {
      revertedKeymap: result,
      keys: allKeys,
    };
  }, [keymap]);

  const handleHotkey = useCallback(
    (event, hotkeysEvent) => {
      const matchedHandlerName =
        revertedKeymap[getNormalizedKeyFromEvent(hotkeysEvent)];

      if (matchedHandlerName) {
        matchedHandlerName.forEach((name) => {
          if (handlers[name]) {
            handlers[name](event, hotkeysEvent);
          }
        });
      }
    },
    [revertedKeymap, handlers]
  );

  const optionsWithTags: OptionsOrDependencyArray = useMemo(() => {
    return {
      ...options,
      enableOnFormTags: ['INPUT', 'TEXTAREA', 'SELECT'],
    };
  }, [options]);

  return useHotkeys(keys, handleHotkey, optionsWithTags);
};
