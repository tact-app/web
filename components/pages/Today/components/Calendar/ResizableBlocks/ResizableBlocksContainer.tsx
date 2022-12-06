import { observer } from 'mobx-react-lite';
import { chakra } from '@chakra-ui/react';
import { useResizableBlocksStore } from './store';
import { ResizableBlocksItemPosData } from './types';

const ResizableBlocksItem = observer(function ResizableBlocksItem({
  item,
}: {
  item: ResizableBlocksItemPosData;
}) {
  const store = useResizableBlocksStore();
  const handleTopHandlerMouseDown = (e) => {
    e.stopPropagation();
    store.handleHandlerMouseDown(item.id, 'top');
  };
  const handleBottomHandlerMouseDown = (e) => {
    e.stopPropagation();
    store.handleHandlerMouseDown(item.id, 'bottom');
  };
  const handleItemMouseDown = (e) => {
    e.stopPropagation();
    store.handleItemMouseDown(item.id);
  };
  const isGhost = store.temp
    ? !item.isTemp && item.id === store.temp.id
    : false;

  const width = item.totalLevels
    ? (100 / item.totalLevels) * (item.toLevel - item.fromLevel)
    : 100;
  const left = item.totalLevels ? (100 / item.totalLevels) * item.fromLevel : 0;

  return (
    <chakra.div
      onMouseDown={handleItemMouseDown}
      cursor={store.isChangesActive ? '' : 'move'}
      overflow='hidden'
      zIndex={item.isTemp ? 1000 : 0}
      bg={item.isTemp ? 'red.200' : 'blue.200'}
      position='absolute'
      opacity={isGhost ? 0.5 : 0.75}
      left={left + '%'}
      w={item.isTemp ? '100%' : `calc(${width}% - 10px)`}
      style={{
        top: item.y,
        height: item.height + 'px',
      }}
      userSelect='none'
    >
      <chakra.div
        onMouseDown={handleTopHandlerMouseDown}
        h={2}
        w='100%'
        position='absolute'
        top={0}
        cursor={store.isChangesActive ? '' : 'ns-resize'}
      />
      {item.id}
      <chakra.div
        onMouseDown={handleBottomHandlerMouseDown}
        h={2}
        w='100%'
        position='absolute'
        bottom={0}
        cursor={store.isChangesActive ? '' : 'ns-resize'}
      />
    </chakra.div>
  );
});

export const ResizableBlocksContainer = observer(
  function ResizableBlocksContainer({ id }: { id: string }) {
    const store = useResizableBlocksStore();

    return (
      <chakra.div
        ref={(el) => store.setContainersRefs(el, id)}
        onMouseDown={store.handleMouseDown}
        h='100%'
        w='100%'
      >
        {store.itemsPositioning
          .filter(({ containerId }) => containerId === id)
          .map((item) => (
            <ResizableBlocksItem key={item.id} item={item} />
          ))}
        {store.temp && store.temp.containerId === id ? (
          <ResizableBlocksItem item={store.tempPositioning} />
        ) : null}
      </chakra.div>
    );
  }
);
