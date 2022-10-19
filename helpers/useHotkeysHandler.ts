import { Options, useHotkeys, } from 'react-hotkeys-hook';
import { HotkeysEvent } from 'hotkeys-js';
import { useMemo } from 'react';

export const useHotkeysHandler = (
  keymap: Record<string, string[] | string>,
  handlers: Record<string, (event: KeyboardEvent, handler: HotkeysEvent) => void>,
  options: Options = {},
  deps: any[] = []
) => {
  const { revertedKeymap, keys } = useMemo(() => {
    const result: Record<string, string[]> = {};
    const allKeys: string[] = [];

    Object.entries(keymap).forEach(([name, keysOrKey]) => {
      if (Array.isArray(keysOrKey)) {
        keysOrKey.forEach((key) => {
          if (!result[key]) {
            result[key] = [];
          }

          if (!allKeys.includes(key)) {
            allKeys.push(key);
          }

          result[key].push(name);
        });
      } else {
        if (!result[keysOrKey]) {
          result[keysOrKey] = [];
        }

        if (!allKeys.includes(keysOrKey)) {
          allKeys.push(keysOrKey);
        }

        result[keysOrKey].push(name);
      }
    });

    return {
      revertedKeymap: result,
      keys: allKeys,
    };
  }, [keymap]);

  return useHotkeys(keys.join(', '), (event, handler) => {
      const matchedHandlerName = revertedKeymap[handler.key];

      if (matchedHandlerName) {
        matchedHandlerName.forEach((name) => {
          if (handlers[name]) {
            handlers[name](event, handler);
          }
        });
      }
    }, {
      ...options,
      enableOnTags: ['INPUT', 'TEXTAREA', 'SELECT'],
    },
    [...deps, revertedKeymap]
  );
};
