import { observer } from 'mobx-react-lite';
import {
  chakra,
  Box,
  List,
  ListItem,
  Button,
} from '@chakra-ui/react';
import { useGoalsSelectionStore } from './store';
import React, { useRef } from 'react';
import { LargePlusIcon } from '../Icons/LargePlusIcon';
import { GoalsSelectionSpace } from "./components/GoalsSelectionSpace";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/pro-regular-svg-icons";

export const GoalsSelectionView = observer(function GoalsSelectionView() {
  const store = useGoalsSelectionStore();
  const ref = useRef();

  if (store.root.resources.goals.count) {
    return (
      <List ref={ref} h='100%' overflowY='auto' pl={1} pr={1}>
        {store.root.resources.goals.listBySpaces.map(({ space, goals }) => (
          <GoalsSelectionSpace key={space.id} space={space} goals={goals} />
        ))}
        {store.abilityToCreate &&
            <ListItem
                h={10}
                display='flex'
                alignItems='center'
                borderBottom='1px'
                borderColor='gray.100'
                key={'add-space'}
                cursor='pointer'
                onClick={store.callbacks.onGoalCreateClick}
            >
                <Button
                    ref={(el) => store.callbacks?.setRefs?.(store.root.resources.goals.count + 1, el)}
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
                      bg: 'blue.400'
                    }}
                    _hover={{
                      bg: 'blue.400'
                    }}
                >
                    <FontAwesomeIcon icon={faPlus} fontSize={14} />
                </Button>
                <chakra.span ml={2} mr={2}>Create new goal</chakra.span>
            </ListItem>
        }
      </List>
    );
  }

  return (
    <Box ref={ref}>
      <Button
        ref={(el) => store.callbacks?.setRefs?.(0, el)}
        h={36}
        w='100%'
        p={6}
        fontSize='lg'
        fontWeight='semibold'
        color='gray.400'
        display='flex'
        flexDirection='column'
        justifyContent='space-between'
        onClick={store.callbacks.onGoalCreateClick}
        _focus={{
          boxShadow: 'var(--chakra-shadows-outline)',
        }}
      >
        <LargePlusIcon />
        New goal
      </Button>
    </Box>
  );
});
