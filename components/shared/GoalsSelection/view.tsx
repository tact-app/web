import { observer } from 'mobx-react-lite';
import {
  chakra,
  Box,
  Checkbox,
  List,
  ListItem,
  Button,
} from '@chakra-ui/react';
import { useGoalsSelectionStore } from './store';
import React, { useRef } from 'react';
import { LargePlusIcon } from '../Icons/LargePlusIcon';
import { GoalsSelectionSpace } from "./components/GoalsSelectionSpace";
import { HeavyPlusIcon } from '../Icons/HeavyPlusIcon';

export const GoalsSelectionView = observer(function GoalsSelectionView() {
  const store = useGoalsSelectionStore();
  const ref = useRef();

  if (store.root.resources.goals.count) {
    return (
      <List ref={ref} h='100%' overflowY='auto' pl={1} pr={1}>
        {store.root.resources.goals.listBySpaces.map(({ space, goals }) => (
          <GoalsSelectionSpace key={space.id} space={space} goals={goals} />
        ))}
        {store.root.resources.goals.count < 9 &&
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
                <Checkbox
                    ref={(el) => store.callbacks?.setRefs?.(store.root.resources.goals.count + 1, el)}
                    isChecked={false}
                    size='xl'
                    position='relative'
                    width='100%'
                    icon={
                      <chakra.div
                        display='flex'
                        justifyContent='center'
                        alignItems='center'
                      >
                        <HeavyPlusIcon/>
                      </chakra.div>}
                    css={{
                      '.chakra-checkbox__label': {
                        width: 'calc(100% - 2rem)',
                      },
                      '.chakra-checkbox__control': {
                        borderRadius: '100%',
                      }
                    }}
                >
                    <chakra.span
                        fontSize='sm'
                        fontWeight='normal'
                        lineHeight={5}>
                        Create new goal
                    </chakra.span>
                </Checkbox>
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
