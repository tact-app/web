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
import { Tooltip } from "../Tooltip";

export type TaskCreatorProps = {
  wrapperProps: InputWrapperProps;
  isHotkeysEnabled?: boolean;
  canChangeSpace?: boolean;
  displayHelpAsTooltip?: boolean;
};

const TASK_CREATOR_VIEW_TAG_LIST_MIN_WIDTH = 72;
const TASK_CREATOR_VIEW_PERCENTAGE_OF_TAG_LIST = 0.25;

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
    enabled: store.isInputFocused && !store.root.isModalOpen && !store.suggestionsMenu.isOpen,
    ref: ref,
    handler: store.handleClickOutside,
  });

  const tagsWidth = store.input?.clientWidth * TASK_CREATOR_VIEW_PERCENTAGE_OF_TAG_LIST;
  const maxTagsWidth = tagsWidth < TASK_CREATOR_VIEW_TAG_LIST_MIN_WIDTH
      ? TASK_CREATOR_VIEW_TAG_LIST_MIN_WIDTH
      : tagsWidth;

  const help = (
    <HStack {...(props.displayHelpAsTooltip ? {} : { mt: 1, mb: 2, ml: 5, mr: 5 })}>
      <Text color='gray.400' fontSize='xs' fontWeight='normal' overflow='hidden' maxH='24px'>
        Type
        <HotkeyHint>#</HotkeyHint> for tags,
        <HotkeyHint>!</HotkeyHint> for priority
        {!store.disableGoalChange && <><HotkeyHint>*</HotkeyHint> for goals,</>}
        {!store.disableSpaceChange && <><HotkeyHint>^</HotkeyHint> for spaces,</>}
        {!store.disableReferenceChange && <><HotkeyHint>@</HotkeyHint> for reference</>}
      </Text>
    </HStack>
  );

  return (
    <Box position='relative'>
      <Tooltip
        isOpen={props.displayHelpAsTooltip && store.isInputFocused}
        isDisabled={!props.displayHelpAsTooltip}
        label={help}
        placement='bottom-start'
      >
        <InputWrapper
          variant={!store.isInputFocused ? 'primary' : 'focused'}
          size='md'
          alignItems='center'
          display='flex'
          minH={10}
          w='auto'
          mb={2}
          {...props.wrapperProps}
        >
          <InputGroup size='md' ref={ref} variant='unstyled' alignItems='center'>
            <TaskQuickEditorInput
              placeholder='+Add task'
              flex={1}
              pt={1}
              pb={1}
            />
            <InputRightAddon
              maxW='50%'
              minWidth={0}
              justifyContent='end'
              position='relative'
            >
              <Fade in={store.isInputFocused} unmountOnExit>
                <HStack w='100%'>
                  <TaskQuickEditorTags
                    collapsable
                    boxProps={{
                      minWidth: 0,
                      maxWidth: `${maxTagsWidth}px`,
                      p: 1,
                      css: {
                        scrollbarWidth: 'none',
                        '&::-webkit-scrollbar': {
                          display: 'none',
                        },
                      },
                    }}
                  />
                  {!store.disableSpaceChange && <TaskQuickEditorSpace />}
                  {!store.disableGoalChange && <TaskQuickEditorGoal />}
                  <TaskQuickEditorPriority />
                  <TaskQuickEditorMainMenu />
                </HStack>
              </Fade>
            </InputRightAddon>
            {!store.disableReferenceChange && (
              <Box position='absolute' right={0} top='33px'>
                <Fade in={store.isInputFocused} unmountOnExit>
                  <TaskQuickEditorReference />
                </Fade>
              </Box>
            )}
          </InputGroup>
        </InputWrapper>
      </Tooltip>

      {!props.displayHelpAsTooltip && (
        <Box opacity={store.isInputFocused ? 1 : 0}>{help}</Box>
      )}
    </Box>
  );
});
