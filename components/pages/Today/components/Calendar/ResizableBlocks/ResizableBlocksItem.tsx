import { observer } from 'mobx-react-lite';
import { ResizableBlocksItemPosData } from './types';
import { useResizableBlocksStore } from './store';
import { chakra } from '@chakra-ui/react';
import { useCallback } from 'react';

export const ResizableBlocksItem = observer(function ResizableBlocksItem({
  item,
  containerId,
}: {
  item: ResizableBlocksItemPosData;
  containerId: string;
}) {
  const store = useResizableBlocksStore();
  const handleTopHandlerMouseDown = useCallback(
    (e) => {
      e.stopPropagation();
      store.handleHandlerMouseDown(item.id, 'top');
    },
    [store, item.id]
  );
  const handleBottomHandlerMouseDown = useCallback(
    (e) => {
      e.stopPropagation();
      store.handleHandlerMouseDown(item.id, 'bottom');
    },
    [store, item.id]
  );
  const handleItemMouseDown = useCallback(
    (e) => {
      e.stopPropagation();
      store.handleItemMouseDown(item.id);
    },
    [store, item.id]
  );
  const handleClick = useCallback(
    (e) => {
      e.stopPropagation();
      store.navigation.handleItemClick(item.id, containerId);
    },
    [store, item.id, containerId]
  );

  const isGhost = store.temp
    ? !item.isTemp && item.id === store.temp.id
    : false;

  const width = item.totalLevels
    ? (100 / item.totalLevels) * (item.toLevel - item.fromLevel)
    : 100;
  const left = item.totalLevels ? (100 / item.totalLevels) * item.fromLevel : 0;

  const borderColor = item.isFocused
    ? item.color + '.200'
    : item.isTemp && store.isCreatingActive
    ? item.color + '.300'
    : 'transparent';
  const borderStyle = item.isFocused ? 'solid' : 'dashed';
  const Component = store.component;

  return (
    <chakra.div
      overflow='hidden'
      zIndex={item.isTemp ? 1000 : 0}
      bg={
        item.isTemp && store.isDraggingActive
          ? item.color + '.100'
          : item.color + '.75'
      }
      position='absolute'
      opacity={isGhost ? 0.5 : 1}
      borderRadius='md'
      borderWidth={2}
      borderColor='white'
      style={{
        top: item.y + 1,
        height: item.height - 1 + 'px',
        width: item.isTemp ? '100%' : `calc(${width}%)`,
        left: left + '%',
      }}
      userSelect='none'
      flexDirection='column'
    >
      <chakra.div
        onMouseDown={handleItemMouseDown}
        onClick={handleClick}
        cursor={store.isChangesActive ? '' : 'pointer'}
        h='100%'
        borderStyle={borderStyle}
        borderWidth={2}
        borderColor={borderColor}
      >
        {Component ? <Component id={item.id} data={item.data} /> : null}
      </chakra.div>
      <chakra.div
        onMouseDown={handleTopHandlerMouseDown}
        h={1.5}
        w='100%'
        position='absolute'
        top={0}
        cursor={store.isChangesActive ? '' : 'ns-resize'}
      />
      <chakra.div
        onMouseDown={handleBottomHandlerMouseDown}
        h={1.5}
        w='100%'
        position='absolute'
        bottom={0}
        cursor={store.isChangesActive ? '' : 'ns-resize'}
      />
    </chakra.div>
  );
});
