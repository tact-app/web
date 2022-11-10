import { observer } from 'mobx-react-lite';
import { useSpacesInboxStore } from './store';
import { Box, chakra } from '@chakra-ui/react';
import { OriginChildData, OriginData, SpaceData } from '../../types';

export const SpacesInboxBreadcrumbs = observer(
  function SpacesInboxBreadcrumbs() {
    const store = useSpacesInboxStore();
    let pointer: OriginData | SpaceData | OriginChildData = store.space;

    return (
      store.space && (
        <Box>
          <chakra.span
            cursor='pointer'
            fontSize='md'
            fontWeight='semibold'
            color={store.selectedPath.length ? 'gray.400' : 'gray.700'}
            onClick={store.goToSpace}
          >
            {store.space.name}
            {store.selectedPath.length ? ' > ' : ''}
          </chakra.span>
          {store.selectedPath.map((item, index) => {
            pointer = pointer.children.find((child) => child.id === item);
            const isLast = index === store.selectedPath.length - 1;

            return (
              <chakra.span
                cursor={isLast ? 'default' : 'pointer'}
                onClick={() => store.goToOrigin(item)}
                fontSize='md'
                fontWeight='semibold'
                key={item}
                color={!isLast ? 'gray.400' : 'gray.700'}
              >
                {pointer.name}
                {!isLast ? ' > ' : ''}
              </chakra.span>
            );
          })}
        </Box>
      )
    );
  }
);
