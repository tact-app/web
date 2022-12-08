import { observer } from 'mobx-react-lite';
import { chakra } from '@chakra-ui/react';
import { useResizableBlocksStore } from './store';
import { ResizableBlocksItem } from './ResizableBlocksItem';

const ResizableBlocksContainerContent = observer(
  function ResizableBlocksContainer({ id }: { id: string }) {
    const store = useResizableBlocksStore();

    return (
      <chakra.div position='relative'>
        {store.itemsPositionsList
          .filter((pos) => pos[id])
          .map((pos) => (
            <ResizableBlocksItem
              key={pos[id].id}
              item={pos[id]}
              containerId={id}
            />
          ))}
        {store.temp && store.tempPosition && store.tempPosition[id] ? (
          <ResizableBlocksItem item={store.tempPosition[id]} containerId={id} />
        ) : null}
      </chakra.div>
    );
  }
);

export const ResizableBlocksContainer = observer(
  function ResizableBlocksContainer({
    id,
    from,
    to,
  }: {
    id: string;
    from: number;
    to: number;
  }) {
    const store = useResizableBlocksStore();

    return (
      <chakra.div
        ref={(el) => store.setContainersRefs(el, id, from, to)}
        onMouseDown={store.handleMouseDown}
        h='100%'
        w='100%'
        pr={2.5}
      >
        <ResizableBlocksContainerContent id={id} />
      </chakra.div>
    );
  }
);
