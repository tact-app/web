import { chakra, HStack, Menu, MenuButton, MenuItem, MenuList, Text, useMenu } from '@chakra-ui/react';
import React from 'react';
import { observer } from 'mobx-react-lite';
import { useTaskInputStore } from '../TaskInput/store';
import { TaskPriorityArray, TaskPriorityNames } from '../../store/types';
import { TaskPriorityIcon } from '../TaskIcons/TaskPriorityIcon';

export const TaskInputPriorityMenu = observer(function TaskInputPriorityMenu() {
  const store = useTaskInputStore();

  return (
    <Menu isOpen={store.priorityMenuOpen} placement='bottom-start' offset={[0, 24]}>
      <MenuButton visibility='hidden'/>
      <MenuList p={0} boxShadow='lg' onFocus={() => store.input.focus()} w={32} minW={32}>
        {TaskPriorityArray.map((key) => (
          <MenuItem
            key={key}
            fontSize='sm'
            lineHeight='5'
            fontWeight='normal'
            onClick={() => store.setPriorityAndCommit(key)}
          >
            <HStack justifyContent='space-between' w='100%'>
              <Text>{TaskPriorityNames[key]}</Text>
              <TaskPriorityIcon priority={key}/>
            </HStack>
          </MenuItem>
        ))}
      </MenuList>
    </Menu>
  );
});