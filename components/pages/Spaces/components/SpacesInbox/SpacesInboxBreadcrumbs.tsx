import { observer } from 'mobx-react-lite';
import { useSpacesInboxStore } from './store';
import { Box, chakra } from '@chakra-ui/react';
import { OriginChildData, OriginData, SpaceData } from '../../types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight } from '@fortawesome/pro-solid-svg-icons';

const SpacesInboxBreadcrumbsItem = (props: {
  isLast?: boolean;
  name: string;
  onClick: () => void;
}) => (
  <chakra.span
    cursor='pointer'
    fontSize='md'
    display='flex'
    alignItems='center'
    fontWeight='semibold'
    color={!props.isLast ? 'gray.400' : 'gray.700'}
    onClick={props.onClick}
    mr={2}
  >
    <chakra.span mr={2}>{props.name}</chakra.span>
    {!props.isLast ? <FontAwesomeIcon icon={faChevronRight} /> : ''}
  </chakra.span>
);

export const SpacesInboxBreadcrumbs = observer(
  function SpacesInboxBreadcrumbs() {
    const store = useSpacesInboxStore();
    let pointer: OriginData | SpaceData | OriginChildData = store.space;

    return (
      store.space && (
        <Box display='flex'>
          <SpacesInboxBreadcrumbsItem
            name={store.space.name}
            onClick={store.goToSpace}
            isLast={store.selectedPath.length === 0}
          />
          {store.selectedPath.map((item, index) => {
            pointer = pointer.children.find((child) => child.id === item);

            return (
              <SpacesInboxBreadcrumbsItem
                key={pointer.id}
                name={pointer.name}
                onClick={() => store.goToOrigin(item)}
                isLast={index === store.selectedPath.length - 1}
              />
            );
          })}
        </Box>
      )
    );
  }
);
