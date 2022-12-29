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
import { InputWrapper, InputWrapperProps } from '../InputWrapper';
import { TaskQuickEditorInput } from '../TaskQuickEditor/TaskQuickEditorInput';
import { TaskQuickEditorTags } from '../TaskQuickEditor/TaskQuickEditorTags';
import { TaskQuickEditorPriority } from '../TaskQuickEditor/TaskQuickEditorPriority';
import { TaskQuickEditorMainMenu } from '../TaskQuickEditor/TaskQuickEditorMainMenu';
import { TaskQuickEditorSpace } from '../TaskQuickEditor/TaskQuickEditorSpace';
import { TaskQuickEditorGoal } from '../TaskQuickEditor/TaskQuickEditorGoal';
import { TaskQuickEditorReference } from '../TaskQuickEditor/TaskQuickEditorReference';

export type TaskCreatorProps = {
  wrapperProps: InputWrapperProps;
  isHotkeysEnabled?: boolean;
};

const HotkeyHint = ({ children }) => (
  <chakra.span
    borderColor='gray.200'
    borderRadius='md'
    borderWidth='1px'
    minW={5}
    lineHeight={5}
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
    enabled: store.isInputFocused,
    ref: ref,
    handler: store.handleClickOutside,
  });

  return (
    <Box position='relative'>
      <InputWrapper
        variant={!store.isInputFocused ? 'primary' : 'focused'}
        size='md'
        alignItems='center'
        display='flex'
        minH={10}
        w='auto'
        {...props.wrapperProps}
      >
        <InputGroup size='md' ref={ref} variant='unstyled' alignItems='center'>
          <TaskQuickEditorInput
            placeholder='+Add task'
            flex={1}
            pt={1}
            pb={1}
          />
          <InputRightAddon maxW='50%' minWidth={0} justifyContent='end' position='relative' zIndex='100'>
            <Fade in={store.isInputFocused} unmountOnExit>
              <HStack w='100%'>
                <TaskQuickEditorTags
                  collapsable
                  boxProps={{
                    minWidth: 0,
                    p: 1,
                    css: {
                      scrollbarWidth: 'none',
                      '&::-webkit-scrollbar': {
                        display: 'none',
                      },
                    },
                  }}
                />
                <TaskQuickEditorSpace />
                <TaskQuickEditorGoal />
                <TaskQuickEditorPriority />
                <TaskQuickEditorMainMenu />
              </HStack>
            </Fade>
          </InputRightAddon>
          <Box position='absolute' right={0} top='33px'>
            <Fade in={store.isInputFocused} unmountOnExit>
              <TaskQuickEditorReference />
            </Fade>
          </Box>
        </InputGroup>
      </InputWrapper>
      <HStack h={5} mt={2} mb={1} ml={5}>
        <Fade in={store.isInputFocused}>
          <Text color='gray.400' fontSize='xs' fontWeight='normal'>
            Type
            <HotkeyHint>#</HotkeyHint> for tags,
            <HotkeyHint>!</HotkeyHint> for priority,
            <HotkeyHint>*</HotkeyHint> for goals,
            <HotkeyHint>^</HotkeyHint> for spaces,
            <HotkeyHint>@</HotkeyHint> for reference
          </Text>
        </Fade>
      </HStack>
    </Box>
  );
});
