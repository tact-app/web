import { HStack, Menu, MenuButton, MenuItem, MenuList, Text } from '@chakra-ui/react';
import React, { PropsWithChildren } from 'react';
import { observer } from 'mobx-react-lite';
import { TaskPriority, TaskPriorityArray, TaskPriorityNames } from '../../types';
import { TaskPriorityIcon } from '../../../../shared/Icons/TaskPriorityIcon';

export const TaskPriorityMenu = observer(function TaskPriorityMenu({
                                                                     isOpen,
                                                                     onFocus,
                                                                     onSelect,
                                                                     children,
                                                                     ...rest
                                                                   }: PropsWithChildren<{
  isOpen?: boolean,
  onFocus?: () => void,
  onSelect: (priority: TaskPriority) => void
}>) {
  return (
    <Menu isOpen={isOpen} placement='bottom-start' offset={[0, 24]} {...rest}>
      {!children ? <MenuButton visibility='hidden'/> : <MenuButton>{children}</MenuButton>}
      <MenuList p={0} boxShadow='lg' onFocus={onFocus} w={32} minW={32}>
        {TaskPriorityArray.map((key) => (
          <MenuItem
            key={key}
            fontSize='sm'
            lineHeight='5'
            fontWeight='normal'
            onClick={() => onSelect(key)}
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
