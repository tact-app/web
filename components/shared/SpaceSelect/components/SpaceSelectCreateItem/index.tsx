import { chakra, Flex } from '@chakra-ui/react';
import React from 'react';
import { observer } from 'mobx-react-lite';
import { useSpaceSelectStore } from '../../store';
import { faPlus } from "@fortawesome/pro-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { SpaceSelectItemContainer } from '../SpaceSelectItemContainer';

export const SpaceSelectCreateItem = observer(function SpaceSelectCreateItem() {
  const store = useSpaceSelectStore();

  return (
    <SpaceSelectItemContainer index={store.spaces.length} onClick={store.handleCreate}>
      <Flex alignItems='center'>
        <Flex
          w={7}
          h={7}
          rounded='full'
          alignItems='center'
          justifyContent='center'
          bg='blue.400'
          color='white'
        >
          <FontAwesomeIcon icon={faPlus} fontSize={18} />
        </Flex>
        <chakra.span ml={2} mr={2}>Create new space</chakra.span>
      </Flex>
    </SpaceSelectItemContainer>
  );
});
