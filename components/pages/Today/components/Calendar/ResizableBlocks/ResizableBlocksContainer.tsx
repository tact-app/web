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
      overflow='hidden'
      zIndex={item.isTemp ? 1000 : 0}
      bg={item.isTemp ? 'red.200' : 'blue.75'}
      position='absolute'
      opacity={isGhost ? 0.5 : 1}
      borderRadius='md'
      borderWidth={2}
      borderColor='white'
      style={{
        top: item.y,
        height: item.height + 'px',
        width: item.isTemp ? '100%' : `calc(${width}%)`,
        left: left + '%',
      }}
      userSelect='none'
      flexDirection='column'
    >
      <chakra.div
        onMouseDown={handleItemMouseDown}
        cursor={store.isChangesActive ? '' : 'move'}
        h='100%'
      >
        {item.id}
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

export const ResizableBlocksContainer = observer(
  function ResizableBlocksContainer({ id }: { id: string }) {
    const store = useResizableBlocksStore();

    return (
      <chakra.div
        ref={(el) => store.setContainersRefs(el, id)}
        onMouseDown={store.handleMouseDown}
        h='100%'
        w='100%'
        pr={2.5}
      >
        <chakra.div position='relative'>
          {store.itemsPositioning
            .filter(({ containerId }) => containerId === id)
            .map((item) => (
              <ResizableBlocksItem key={item.id} item={item} />
            ))}
          {store.temp && store.temp.containerId === id ? (
            <ResizableBlocksItem item={store.tempPositioning} />
          ) : null}
        </chakra.div>
      </chakra.div>
    );
  }
);
