import React, { useRef } from 'react';
import { observer } from 'mobx-react-lite';
import {
  InputGroup,
  useOutsideClick,
  HStack, InputRightAddon,
} from '@chakra-ui/react';
import { useTaskQuickEditorStore } from '../TaskQuickEditor/store';
import { TaskCreatorWrapper } from '../TaskCreatorWrapper';
import { TaskQuickEditorInput } from '../TaskQuickEditor/TaskQuickEditorInput';
import { TaskQuickEditorTags } from '../TaskQuickEditor/TaskQuickEditorTags';
import { TaskQuickEditorPriority } from '../TaskQuickEditor/TaskQuickEditorPriority';
import { TaskQuickEditorMenu } from '../TaskQuickEditor/TaskQuickEditorMenu';
import { TaskQuickEditorPriorityMenu } from '../TaskQuickEditor/TaskQuickEditorPriorityMenu';

export const TaskCreatorView = observer(function TaskCreator() {
  const store = useTaskQuickEditorStore();
  const ref = useRef(null);

  useOutsideClick({
    ref: ref,
    handler: () => {
      store.removeFocus();
      store.closeMenu();
    },
  });

  return (
    <TaskCreatorWrapper
      variant={!store.focused ? 'primary' : 'focused'}
      size='md'
      alignItems='center'
      mb={6}
      display='flex'
    >
      <InputGroup size='md' ref={ref} variant='unstyled'>
        <TaskQuickEditorInput placeholder='+Add task'/>
        <InputRightAddon>
          <HStack>
            <TaskQuickEditorTags/>
            <TaskQuickEditorPriorityMenu>
              <TaskQuickEditorPriority/>
            </TaskQuickEditorPriorityMenu>
            <TaskQuickEditorMenu/>
          </HStack>
        </InputRightAddon>
      </InputGroup>
    </TaskCreatorWrapper>
  );
});
