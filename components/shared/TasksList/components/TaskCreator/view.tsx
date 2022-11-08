import React, { useRef } from 'react';
import { observer } from 'mobx-react-lite';
import {
  InputGroup,
  HStack,
  InputRightAddon,
  useOutsideClick,
} from '@chakra-ui/react';
import { useTaskQuickEditorStore } from '../TaskQuickEditor/store';
import { InputWrapper, InputWrapperProps } from '../../../InputWrapper';
import { TaskQuickEditorInput } from '../TaskQuickEditor/TaskQuickEditorInput';
import { TaskQuickEditorTags } from '../TaskQuickEditor/TaskQuickEditorTags';
import { TaskQuickEditorPriority } from '../TaskQuickEditor/TaskQuickEditorPriority';
import { TaskQuickEditorMainMenu } from '../TaskQuickEditor/TaskQuickEditorMainMenu';
import { TaskQuickEditorSpace } from '../TaskQuickEditor/TaskQuickEditorSpace';

export type TaskCreatorProps = { wrapperProps: InputWrapperProps };

export const TaskCreatorView = observer(function TaskCreator(
  props: TaskCreatorProps
) {
  const store = useTaskQuickEditorStore();
  const ref = useRef(null);

  useOutsideClick({
    ref: ref,
    handler: store.handleClickOutside,
  });

  return (
    <InputWrapper
      variant={!store.focused ? 'primary' : 'focused'}
      size='md'
      alignItems='center'
      mb={7}
      display='flex'
      minH={10}
      w='auto'
      {...props.wrapperProps}
    >
      <InputGroup size='md' ref={ref} variant='unstyled'>
        <TaskQuickEditorInput placeholder='+Add task' />
        <InputRightAddon>
          <HStack>
            <TaskQuickEditorTags />
            <TaskQuickEditorSpace />
            <TaskQuickEditorPriority />
            <TaskQuickEditorMainMenu />
          </HStack>
        </InputRightAddon>
      </InputGroup>
    </InputWrapper>
  );
});
