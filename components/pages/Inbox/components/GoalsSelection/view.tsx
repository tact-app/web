import { observer } from 'mobx-react-lite';
import { GoalIconVariants } from '../../../Goals/types';
import { chakra, Box, Checkbox, List, ListItem, Text } from '@chakra-ui/react';
import { HotKeys } from 'react-hotkeys';
import { useGoalsSelectionStore } from './store';

const keyMap = {
  UP: 'ArrowUp',
  DOWN: 'ArrowDown',
  ENTER: 'Enter',
};

export const GoalsSelectionView = observer(function GoalsSelectionView() {
  const store = useGoalsSelectionStore();

  return (
    <HotKeys
      keyMap={keyMap}
      handlers={store.hotkeyHandlers}
    >
      <List>
        {!store.multiple ? (
          <ListItem h={10} display='flex' alignItems='center' borderBottom='1px' borderColor='gray.100'>
            <Checkbox
              isChecked={false}
              onFocus={store.handleFocus}
              onBlur={store.handleBlur}
              onChange={() => store.handleGoalCheck(null)}
              onKeyDown={store.handleKeyDown(null)}
              ref={store.setEmptyRef}
              bg='white'
              size='xl'
              position='relative'
              fontWeight='semibold'
              fontSize='lg'
              icon={<></>}
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
                color={'gray.400'}
              >
                −
              </chakra.span>
              <chakra.span
                display='flex'
                alignItems={'center'}
                fontSize='sm' fontWeight='normal'
              >
                Empty goal
              </chakra.span>
            </Checkbox>
          </ListItem>
        ) : null}
        {store.goals.map(({ id, icon, title }, index) => (
          <ListItem h={10} display='flex' alignItems='center' borderBottom='1px' borderColor='gray.100'>
            <Checkbox
              isChecked={!!store.checkedGoals[id]}
              onFocus={store.handleFocus}
              onBlur={store.handleBlur}
              onChange={() => store.handleGoalCheck(id)}
              onKeyDown={store.handleKeyDown(index)}
              ref={store.setRef(index)}
              size='xl'
              position='relative'
              fontWeight='semibold'
              fontSize='lg'
              icon={<></>}
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
                color={store.checkedGoals[id] ? 'white' : 'gray.400'}
              >
                {index + 1}
              </chakra.span>
              <chakra.span
                display='flex'
                alignItems={'center'}
                fontSize='sm' fontWeight='normal'
              >
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
                    <Text fontSize='lg' textAlign='center'>{icon.value}</Text>
                  ) : null}
                </Box>
                {title}
              </chakra.span>
            </Checkbox>
          </ListItem>
        ))}
      </List>
    </HotKeys>
  );
});
