import { observer } from 'mobx-react-lite';
import { Modes, useTaskQuickEditorStore } from './store';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Box,
  BoxProps,
  Button,
  ButtonProps,
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Tag,
  chakra,
  VStack,
  Portal,
  IconButton,
} from '@chakra-ui/react';
import React, { useEffect } from 'react';
import { faXmark } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { TaskTag } from '../TasksList/types';

export const TAGS_ID = 'task-quick-editor-tags';

const TaskQuickEditorTagsList = observer(function TaskQuickEditorTags({
  buttonProps,
  disableAnimating = false,
}: {
  buttonProps: ButtonProps;
  disableAnimating?: boolean;
}) {
  const store = useTaskQuickEditorStore();

  const renderContent = ({ title, id }: TaskTag) => (
      <Button
          key={title}
          variant='unstyled'
          size='xs'
          onClick={(e) => {
            e.stopPropagation();
            store.modes.tag.focusTagById(id);
          }}
          ref={(el) => store.modes.tag.setTagRef(el, id)}
          onKeyDown={(e) => store.modes.tag.handleButtonKeyDown(e, id)}
          onFocus={store.handleModeFocus(Modes.TAG)}
          fontSize='initial'
          verticalAlign='initial'
          mr={2}
          _hover={{
            button: {
              opacity: 100
            },
            span: {
              bg: 'var(--chakra-colors-blue-600)'
            }
          }}
          _focus={{
            boxShadow: 'none',
            span: {
              boxShadow: 'inset 0px 0px 0px 2px var(--chakra-colors-blue-600)'
            }
          }}
          {...buttonProps}
      >
        <Tag
            bg='blue.400'
            color='white'
            cursor='pointer'
            boxSizing='border-box'
        >
          {title}
        </Tag>
        <IconButton
            variant='unstyled'
            aria-label='Remove'
            w='12px'
            h='12px'
            minW='12px'
            top='-4px'
            right='-4px'
            position='absolute'
            backgroundColor='var(--chakra-colors-blue-300)'
            opacity='0'
            display='flex'
            alignItems='center'
            justifyContent='center'
            tabIndex={-1}
            isRound
            onClick={(e) => {
              e.stopPropagation();
              store.modes.tag.removeTag(id);
            }}
        >
          <FontAwesomeIcon
              icon={faXmark}
              fontSize={10}
              color='var(--chakra-colors-white)'
          />
        </IconButton>
      </Button>
  );

  return (
    <AnimatePresence mode='popLayout' initial={false}>
      {store.modes.tag.tags.map((tag) =>
          disableAnimating
              ?
                <motion.span key={tag.title}>
                    {renderContent(tag)}
                </motion.span>
              : (
                  <motion.span
                      layout
                      key={tag.title}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ type: 'just' }}
                      exit={{ opacity: 0 }}
                      style={{ display: 'inline-block' }}
                  >
                    {renderContent(tag)}
                  </motion.span>
              )
      )}
    </AnimatePresence>
  );
});

export const TaskQuickEditorTags = observer(function TaskQuickEditTags({
  boxProps,
  buttonProps,
  collapsable = false,
  autoSave = false,
}: {
  boxProps?: BoxProps;
  buttonProps?: ButtonProps;
  collapsable?: boolean;
  autoSave?: boolean;
}) {
  const store = useTaskQuickEditorStore();
  const isOpen = store.suggestionsMenu.openForMode === Modes.TAG

  useEffect(() => {
    store.modes.tag.setIsCollapsable(collapsable);
  }, [store.modes.tag, collapsable]);

  useEffect(() => {
    if (store.modes.tag.tags.length && !store.modes.tag.isCollapsed) {
      store.modes.tag.checkOverflow();
    }
  }, [store.modes.tag.tags.length, store.modes.tag.isCollapsed]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    store.modes.tag.autoSave = autoSave;
  }, [autoSave]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!store.modes.tag.tags.length) {
    return null;
  }

  return (
    <Box
      data-id={TAGS_ID}
      display='flex'
      {...boxProps}
      ref={store.modes.tag.setContainerRef}
    >
      {store.modes.tag.isCollapsed ? (
          <Popover
            isOpen={isOpen}
            onOpen={store.modes.tag.handleCollapseOpen}
            onClose={store.modes.tag.handleCollapseClose}
            offset={[0, 16]}
            returnFocusOnClose={false}
            autoFocus={false}
            closeOnBlur={true}
          >
            <PopoverTrigger>
              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  store.suggestionsMenu.openFor(Modes.TAG);
                }}
                ref={store.modes.tag.setCollapseRef}
                onKeyDown={store.modes.tag.handleCollapseButtonKeyDown}
                onFocus={store.handleModeFocus(Modes.TAG)}
                size='xs'
                role='group'
                bg='blue.400'
                _hover={{
                  bg: 'blue.500',
                }}
                _focus={{
                  boxShadow: 'var(--chakra-shadows-outline)',
                }}
                color='white'
              >
                Tags
                <chakra.span
                  ml={1}
                  bg='blue.300'
                  pl={1}
                  pr={1}
                  borderRadius='full'
                  transitionProperty='common'
                  transitionDuration='normal'
                  color='white'
                  fontSize='xs'
                >
                  {store.modes.tag.tags.length}
                </chakra.span>
              </Button>
            </PopoverTrigger>
            <Portal>
              <PopoverContent
                  onFocus={store.handleFocusMenu}
                  w='auto'
              >
                <PopoverBody
                    display='flex'
                    flexDirection='column'
                    overflow='auto'
                    maxH={64}
                >
                  <VStack alignItems='start'>
                    <TaskQuickEditorTagsList
                        buttonProps={buttonProps}
                        disableAnimating
                    />
                  </VStack>
                </PopoverBody>
              </PopoverContent>
            </Portal>
          </Popover>
      ) : (
        <TaskQuickEditorTagsList
            buttonProps={buttonProps}
        />
      )}
    </Box>
  );
});
