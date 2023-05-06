import { chakra, Flex } from '@chakra-ui/react';
import React from 'react';
import { observer } from 'mobx-react-lite';
import { useSpaceSelectStore } from '../../store';
import { SpacesSmallIcon } from "../../../../pages/Spaces/components/SpacesIcons/SpacesSmallIcon";
import { faCheck } from "@fortawesome/pro-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { SpaceData } from "../../../../pages/Spaces/types";
import { SpaceSelectItemContainer } from '../SpaceSelectItemContainer';

type Props = {
  space: SpaceData;
  index: number;
};

export const SpaceSelectItem = observer(function SpaceSelectItem({ space, index }: Props) {
  const store = useSpaceSelectStore();

  const isSelected = space.id === store.selectedSpaceId;

  const handleClick = () => {
    store.handleSuggestionSelect(space.id);
  };

  return (
    <SpaceSelectItemContainer index={index} onClick={handleClick}>
      <Flex alignItems='center'>
        <SpacesSmallIcon space={space} size={7} borderRadius={4} bgOpacity='100' />
        <chakra.span color={isSelected ? 'blue.400' : 'gray.700'} ml={2} mr={2} overflow='hidden' textOverflow='ellipsis'>
          {space.name}
        </chakra.span>
      </Flex>

      {isSelected && (
        <chakra.span position='absolute' color='blue.400' top='50%' transform='translate(0, -50%)' right={2.5}>
          <FontAwesomeIcon
            fontSize={14}
            icon={faCheck}
            fixedWidth
          />
        </chakra.span>
      )}
    </SpaceSelectItemContainer>
  );
});
