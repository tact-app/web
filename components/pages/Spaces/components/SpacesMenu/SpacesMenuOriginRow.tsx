import { Box, chakra, Checkbox, IconButton } from '@chakra-ui/react';
import { OriginCheckStatusTypes } from './types';
import { OriginChildData, OriginData } from '../../types';
import { observer } from 'mobx-react-lite';
import { useSpacesMenuStore } from './store';
import { useCallback } from 'react';
import { ArrowDownIcon } from '../../../../shared/Icons/ArrowIcons';

export const SpacesMenuOriginRow = observer(function SpacesMenuOriginRow({
  item,
  path,
  space,
  isExpanded,
}: {
  item: OriginData | OriginChildData;
  path: string[];
  space: string;
  isExpanded: boolean;
}) {
  const store = useSpacesMenuStore();
  const handleClick = useCallback(
    () => store.handleOriginClick(space, path),
    [store, space, path]
  );
  const handleCheck = useCallback(
    (e) => {
      e.stopPropagation();
      store.handleOriginCheck(space, path);
    },
    [space, path, store]
  );
  const handleExpand = useCallback(
    (e) => {
      e.stopPropagation();
      store.handleOriginExpand(space, path);
    },
    [space, path, store]
  );
  const status = store.getOriginStatus(space, path);
  const isFocused = store.checkPathFocus(space, path);

  return (
    <Box
      onClick={handleClick}
      cursor='pointer'
      display='flex'
      borderRadius='base'
      transition='background-color 0.1s ease-in-out'
      bg={isFocused ? 'gray.300' : 'white'}
      _hover={{
        bg: isFocused ? 'gray.200' : 'gray.100',
      }}
      alignItems='center'
      mt={2}
      h={6}
      pl={2}
    >
      {store.withCheckboxes ? (
        <Checkbox
          isChecked={status === OriginCheckStatusTypes.CHECKED}
          isIndeterminate={status === OriginCheckStatusTypes.INDETERMINATE}
          onChange={handleCheck}
          mr={2}
        />
      ) : null}
      <chakra.span whiteSpace='nowrap' fontSize='sm' fontWeight='medium'>
        {item.name}
      </chakra.span>
      {item.children?.length > 0 ? (
        <IconButton
          size='xs'
          aria-label={'open'}
          onClick={handleExpand}
          variant='unstyled'
          pr={4}
        >
          <chakra.div
            transition={'transform 0.2s ease-in-out'}
            transform={isExpanded ? 'rotate(180deg)' : 'rotate(0)'}
          >
            <ArrowDownIcon />
          </chakra.div>
        </IconButton>
      ) : null}
    </Box>
  );
});
