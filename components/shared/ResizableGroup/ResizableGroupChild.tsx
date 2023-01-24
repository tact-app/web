import React, { PropsWithChildren, useEffect } from 'react';
import { chakra, HTMLChakraProps } from '@chakra-ui/react';
import { observer } from 'mobx-react-lite';
import { ResizableGroupConfig, useResizableGroupStore } from './store';

export const ResizableGroupChild = observer(function ResizableGroupChild({
  index: i,
  config,
  children,
  ...props
}: PropsWithChildren<
  {
    index: number;
    config: ResizableGroupConfig;
  } & HTMLChakraProps<'div'>
>) {
  const store = useResizableGroupStore();
  const isFixed = store.isFixed(i);

  useEffect(() => {
    store.setChildConfig(i, config);
  }, [store, i, config]);

  useEffect(() => {
    store.setChildActive(i, Boolean(children));
  }, [store, i, children]);

  return (
    <chakra.div
      name='resizable-child'
      overflow='clip'
      position='relative'
      style={{
        width: store.widths.length ? store.getWidth(i) : config.width || 0,
      }}
      flexShrink={isFixed ? 0 : 1}
      onTransitionEnd={store.handleAnimationEnd}
      transition={
        (store.isAnimationActive || isFixed) && 'width 0.2s ease-in-out'
      }
      {...props}
    >
      {store.hasResizableHandler(i) && (
        <chakra.div
          onMouseDown={store.handleResizeStart(i)}
          position='absolute'
          h='100%'
          w='6px'
          left='-3px'
          _hover={{
            cursor: 'col-resize',
            bg: 'gray.100',
          }}
          bg={store.resizingIndex === i ? 'gray.200' : 'transparent'}
        />
      )}
      <chakra.div
        h='100%'
        transition={
          !store.enterAnimation[i] &&
          (store.isAnimationActive || isFixed) &&
          'width 0.2s ease-in-out'
        }
        style={{
          width:
            !store.enterAnimation[i] &&
            (config.flexible || !store.isAnimationActive || isFixed)
              ? 'auto'
              : store.widths[i] + 'px',
        }}
        minW={config.minWidth}
      >
        {children}
      </chakra.div>
    </chakra.div>
  );
});
