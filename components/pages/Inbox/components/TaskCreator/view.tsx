import React, { useRef } from 'react';
import { observer } from 'mobx-react-lite';
import {
  InputGroup,
  useOutsideClick,
  HStack,
  InputRightAddon,
} from '@chakra-ui/react';
import { useTaskQuickEditorStore } from '../TaskQuickEditor/store';
import { InputWrapper } from '../../../../shared/InputWrapper';
import { TaskQuickEditorInput } from '../TaskQuickEditor/TaskQuickEditorInput';
import { TaskQuickEditorTags } from '../TaskQuickEditor/TaskQuickEditorTags';
import { TaskQuickEditorPriority } from '../TaskQuickEditor/TaskQuickEditorPriority';
import { TaskQuickEditorMainMenu } from '../TaskQuickEditor/TaskQuickEditorMainMenu';
import { TaskQuickEditorPriorityMenu } from '../TaskQuickEditor/TaskQuickEditorPriorityMenu';

export const TaskCreatorView = observer(function TaskCreator() {
  const store = useTaskQuickEditorStore();
  const ref = useRef(null);

  useOutsideClick({
    ref: ref,
    handler: () => {
      if (store.focused) {
        store.handleClickOutside();
      }
    },
  });

  return (
    <InputWrapper
      variant={!store.focused ? 'primary' : 'focused'}
      size='md'
      alignItems='center'
      mb={7}
      display='flex'
    >
      <InputGroup size='md' ref={ref} variant='unstyled'>
        <TaskQuickEditorInput placeholder='+Add task' />
        <InputRightAddon>
          <HStack>
            <TaskQuickEditorTags />
            <TaskQuickEditorPriorityMenu>
              <TaskQuickEditorPriority />
            </TaskQuickEditorPriorityMenu>
            <TaskQuickEditorMainMenu />
          </HStack>
        </InputRightAddon>
      </InputGroup>
    </InputWrapper>
  );
});
