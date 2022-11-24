import { observer } from 'mobx-react-lite';
import { GoalIconData } from '../../pages/Goals/types';
import {
  chakra,
  Box,
  Checkbox,
  List,
  ListItem,
  Button,
  forwardRef,
} from '@chakra-ui/react';
import { GoalsSelectionProps, useGoalsSelectionStore } from './store';
import React, { useRef } from 'react';
import { LargePlusIcon } from '../Icons/LargePlusIcon';
import { GoalIcon } from '../../pages/Goals/components/GoalIcon';

type GoalSelectionListItemProps = {
  id: string | null;
  index: number | null;
  title: string;
  icon?: GoalIconData;
  checkboxContent?: React.ReactNode;
};

const GoalSelectionListItem = observer(
  forwardRef(function GoalSelectionListItem(
    { id, index, icon, title, checkboxContent }: GoalSelectionListItemProps,
    ref
  ) {
    const store = useGoalsSelectionStore();

    return (
      <ListItem
        h={10}
        display='flex'
        alignItems='center'
        borderBottom='1px'
        borderColor='gray.100'
        key={id}
      >
        <Checkbox
          ref={ref}
          isChecked={!!store.checkedGoals[id]}
          onChange={() => store.handleGoalCheck(index)}
          size='xl'
          position='relative'
          fontWeight='semibold'
          fontSize='lg'
          icon={checkboxContent ? <></> : undefined}
        >
          {checkboxContent ? (
            <chakra.span
              position='absolute'
              left={0}
              w={6}
              top={0}
              bottom={0}
              display='flex'
              alignItems='center'
              justifyContent='center'
              color={store.checkedGoals[id] ? 'white' : 'gray.400'}
            >
              {checkboxContent}
            </chakra.span>
          ) : null}
          <chakra.span
            display='flex'
            alignItems={'center'}
            fontSize='sm'
            fontWeight='normal'
          >
            {icon ? <GoalIcon icon={icon} /> : null}
            <chakra.span ml={2}>{title}</chakra.span>
          </chakra.span>
        </Checkbox>
      </ListItem>
    );
  })
);

export const GoalsSelectionView = observer(function GoalsSelectionView(
  props: Partial<GoalsSelectionProps>
) {
  const store = useGoalsSelectionStore();
  const ref = useRef();

  return store.goals.length ? (
    <List ref={ref} h='100%' overflowY='auto' pl={1} pr={1}>
      {store.goals.map(({ id, icon, title }, index) => (
        <GoalSelectionListItem
          ref={(el) => {
            props.setRefs(index + 1, el);

            if (index === 0) {
              store.setFirstItemRef(el);
            }
          }}
          key={id}
          id={id}
          index={index}
          title={title}
          icon={icon}
          checkboxContent={index < 9 ? index + 1 : null}
        />
      ))}
    </List>
  ) : (
    <Box ref={ref}>
      <Button
        ref={(el) => props.setRefs(0, el)}
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
