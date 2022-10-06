import { observer } from 'mobx-react-lite';
import { Menu, MenuButton, MenuItem, MenuList } from '@chakra-ui/react';
import { TaskItemMenuIcon } from '../TaskIcons/TaskItemMenuIcon';
import { useTaskItemStore } from '../TaskItem/store';

export const TaskItemMenu = observer(function TaskItemMenu() {
  const store = useTaskItemStore();

  return (
    <Menu>
      <MenuButton
        _groupHover={{
          visibility: 'visible',
        }}
        visibility={store.isDragging || store.isFocused ? 'visible' : 'hidden'}
      >
        <TaskItemMenuIcon/>
      </MenuButton>
      <MenuList p={0} shadow='lg'>
        <MenuItem>Set priority</MenuItem>
      </MenuList>
    </Menu>
  );
});