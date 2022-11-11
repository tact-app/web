import React, { useRef } from 'react';
import { observer } from 'mobx-react-lite';
import {
  InputGroup,
  HStack,
  InputRightAddon,
  useOutsideClick,
  Box,
  Text,
  chakra,
  Fade,
} from '@chakra-ui/react';
import { useTaskQuickEditorStore } from '../TaskQuickEditor/store';
import { InputWrapper, InputWrapperProps } from '../../../InputWrapper';
import { TaskQuickEditorInput } from '../TaskQuickEditor/TaskQuickEditorInput';
import { TaskQuickEditorTags } from '../TaskQuickEditor/TaskQuickEditorTags';
import { TaskQuickEditorPriority } from '../TaskQuickEditor/TaskQuickEditorPriority';
import { TaskQuickEditorMainMenu } from '../TaskQuickEditor/TaskQuickEditorMainMenu';
import { TaskQuickEditorSpace } from '../TaskQuickEditor/TaskQuickEditorSpace';
import { TaskQuickEditorGoal } from '../TaskQuickEditor/TaskQuickEditorGoal';

export type TaskCreatorProps = { wrapperProps: InputWrapperProps };

const HotkeyHint = ({ children }) => (
  <chakra.span
    borderColor='gray.200'
    borderRadius='md'
    borderWidth='1px'
    minW={5}
    h={5}
    display='inline-block'
    textAlign='center'
    ml={2}
  >
    {children}
  </chakra.span>
);

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
    <Box>
      <InputWrapper
        variant={!store.focused ? 'primary' : 'focused'}
        size='md'
        alignItems='center'
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
              <TaskQuickEditorGoal />
              <TaskQuickEditorPriority />
              <TaskQuickEditorMainMenu />
            </HStack>
          </InputRightAddon>
        </InputGroup>
      </InputWrapper>
      <HStack h={5} mt={2} mb={1} ml={5}>
        <Fade in={store.focused}>
          <Text color='gray.400' fontSize='xs' fontWeight='normal'>
            Type
            <HotkeyHint>#</HotkeyHint> for tags,
            <HotkeyHint>!</HotkeyHint> for priority,
            <HotkeyHint>*</HotkeyHint> for goals,
            <HotkeyHint>^</HotkeyHint> for spaces
          </Text>
        </Fade>
      </HStack>
    </Box>
  );
});
