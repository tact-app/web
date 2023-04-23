import { observer } from 'mobx-react-lite';
import {
  chakra,
  Button,
  ListItem,
  Checkbox,
  Flex,
} from '@chakra-ui/react';
import { useGoalsSelectionStore } from '../../store';
import React from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/pro-regular-svg-icons";

export const GoalsSelectionAdditionalItems = observer(function GoalsSelectionAdditionalItems() {
  const store = useGoalsSelectionStore();

  if (store.multiple) {
    return null;
  }

  const isUnsetChecked = store.isChecked(null);

  const setUnsetCheckboxRef = (ref: HTMLInputElement) => {
    store.callbacks?.setRefs?.(store.root.resources.goals.count + 1, ref);
  };
  const setCreateButtonRef = (ref: HTMLButtonElement) => {
    store.callbacks?.setRefs?.(store.root.resources.goals.count + 2, ref);
  };
  const handleUnsetGoal = () => store.handleGoalCheck(null);

  return (
    <>
      {store.hasInitialChecked && (
        <ListItem
          h={10}
          display='flex'
          alignItems='center'
          position='relative'
        >
          <Checkbox
            ref={setUnsetCheckboxRef}
            isChecked={isUnsetChecked}
            onChange={handleUnsetGoal}
            size='xl'
            position='relative'
            fontWeight='semibold'
            fontSize='lg'
            icon={<></>}
            css={{
              '.chakra-checkbox__label': {
                margin: 0,
              }
            }}
          >
            <chakra.span
              position='absolute'
              left={0}
              w={6}
              top={0}
              bottom={0}
              display='flex'
              alignItems='center'
              justifyContent='center'
              color={isUnsetChecked ? 'white' : 'gray.400'}
            >
              -
            </chakra.span>
          </Checkbox>
          <Flex
            alignItems='center'
            flex={1}
            ml={2}
            w='calc(100% - var(--chakra-space-8))'
            cursor='pointer'
            onClick={handleUnsetGoal}
          >
            Unset goal
          </Flex>
        </ListItem>
      )}
      <ListItem
        h={10}
        display='flex'
        alignItems='center'
        cursor='pointer'
        onClick={store.callbacks?.onGoalCreateClick}
      >
        <Button
          ref={setCreateButtonRef}
          w={6}
          h={6}
          p={0}
          minW='auto'
          rounded='full'
          display='flex'
          alignItems='center'
          justifyContent='center'
          bg='blue.400'
          color='white'
          _focus={{
            bg: 'blue.500'
          }}
          _hover={{
            bg: 'blue.500'
          }}
        >
          <FontAwesomeIcon icon={faPlus} fontSize={14} />
        </Button>
        <chakra.span ml={2} mr={2}>Create new goal</chakra.span>
      </ListItem>
    </>
  );
});
