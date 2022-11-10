import { observer } from 'mobx-react-lite';
import { ResizableGroupProps, useResizableGroupStore } from './store';
import { chakra } from '@chakra-ui/react';
import useResizeObserver from 'use-resize-observer';
import React, { useEffect } from 'react';

export const ResizableGroupView = observer(function ResizableGroupView(
  props: ResizableGroupProps
) {
  const store = useResizableGroupStore();
  const { ref, width } = useResizeObserver();

  useEffect(() => {
    store.setChildrenCount(React.Children.toArray(props.children).length);
  }, [props.children, store]);

  useEffect(() => {
    store.setContainerWidth(width || 0);
  }, [width, store]);

  return (
    <chakra.div
      ref={ref}
      display='flex'
      flex={1}
      overflow='hidden'
      width='100%'
    >
      {React.Children.map(props.children, (child, i) => {
        const isFixed = store.isFixed(i);

        return child ? (
          <chakra.div
            name='resizable-child'
            style={{
              width: store.widths.length
                ? store.getWidth(i)
                : props.configs[i].width || 0,
            }}
            flexShrink={isFixed ? 0 : 1}
            position='relative'
            onTransitionEnd={store.handleAnimationEnd}
            transition={
              (store.isAnimationActive || isFixed) && 'width 0.2s ease-in-out'
            }
            overflow='hidden'
            {...props.configs[i].props}
          >
            {store.hasResizableHandler(i) && (
              <chakra.div
                onMouseDown={store.handleResizeStart(i)}
                position='absolute'
                height='100%'
                width={'6px'}
                left={'-3px'}
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
                  (props.configs[i].flexible ||
                    !store.isAnimationActive ||
                    isFixed)
                    ? 'auto'
                    : store.widths[i] + 'px',
              }}
              minW={props.configs[i].minWidth}
            >
              {child}
            </chakra.div>
          </chakra.div>
        ) : null;
      })}
    </chakra.div>
  );
});
