import { observer } from 'mobx-react-lite';
import { GoalIconData, GoalIconVariants } from '../../../Goals/types';
import {
  chakra,
  Box,
  Checkbox,
  List,
  ListItem,
  Text,
  Button,
} from '@chakra-ui/react';
import { useGoalsSelectionStore } from './store';
import { useHotkeysHandler } from '../../../../../helpers/useHotkeysHandler';
import React from 'react';
import { LargePlusIcon } from '../../../../shared/Icons/LargePlusIcon';

const keyMap = {
  UP: 'up',
  DOWN: 'down',
  ENTER: 'enter',
};

type GoalSelectionListItemProps = {
  id: string | null;
  index: number | null;
  title: string;
  icon?: GoalIconData;
  checkboxContent?: React.ReactNode;
};

const GoalSelectionListItem = observer(function GoalSelectionListItem({
  id,
  index,
  icon,
  title,
  checkboxContent,
}: GoalSelectionListItemProps) {
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
        isChecked={!!store.checkedGoals[id]}
        onFocus={store.handleFocus}
        onBlur={store.handleBlur}
        onChange={() => store.handleGoalCheck(index)}
        onKeyDown={store.handleKeyDown(index)}
        ref={store.setRef(index)}
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
          {icon ? (
            <Box
              w={8}
              h={8}
              mr={2}
              borderRadius='full'
              display='inline-flex'
              justifyContent='center'
              flexDirection='column'
              bg={icon?.color}
            >
              {icon && icon.type === GoalIconVariants.EMOJI ? (
                <Text fontSize='lg' textAlign='center'>
                  {icon.value}
                </Text>
              ) : null}
            </Box>
          ) : null}
          {title}
        </chakra.span>
      </Checkbox>
    </ListItem>
  );
});

export const GoalsSelectionView = observer(function GoalsSelectionView() {
  const store = useGoalsSelectionStore();

  const ref = useHotkeysHandler(keyMap, store.hotkeyHandlers);

  return store.goals.length ? (
    <List ref={(el) => (ref.current = el)}>
      {!store.multiple && (
        <GoalSelectionListItem
          id={null}
          index={null}
          checkboxContent='-'
          title={'No goal'}
        />
      )}
      {store.goals.map(({ id, icon, title }, index) => (
        <GoalSelectionListItem
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
    <Box ref={(el) => (ref.current = el)}>
      <Button
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
        ref={store.setCreateGoalButtonRef}
      >
        <LargePlusIcon />
        New goal
      </Button>
    </Box>
  );
});
