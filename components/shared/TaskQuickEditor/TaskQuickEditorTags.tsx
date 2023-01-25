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
} from '@chakra-ui/react';
import React, { useEffect } from 'react';

export const TAGS_ID = 'task-quick-editor-tags';

const TaskQuickEditorTagsList = observer(function TaskQuickEditorTags({
  buttonProps,
}: {
  buttonProps: ButtonProps;
}) {
  const store = useTaskQuickEditorStore();

  return (
    <AnimatePresence mode='popLayout' initial={false}>
      {store.modes.tag.tags.map(({ title, id }) => (
        <motion.span
          layout
          key={title}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ type: 'just' }}
          exit={{ opacity: 0 }}
          style={{ display: 'inline-block' }}
        >
          <Button
            variant='unstyled'
            size='xs'
            onClick={() => store.modes.tag.focusTagById(id)}
            ref={(el) => store.modes.tag.setTagRef(el, id)}
            onKeyDown={(e) => store.modes.tag.handleButtonKeyDown(e, id)}
            onFocus={store.handleModeFocus(Modes.TAG)}
            fontSize='initial'
            verticalAlign='initial'
            mr={2}
            _focus={{ boxShadow: 'var(--chakra-shadows-outline)' }}
            {...buttonProps}
          >
            <Tag bg='blue.400' color='white' cursor='pointer'>
              {title}
            </Tag>
          </Button>
        </motion.span>
      ))}
    </AnimatePresence>
  );
});

export const TaskQuickEditorTags = observer(function TaskQuickEditTags({
  boxProps,
  buttonProps,
  collapsable = false,
}: {
  boxProps?: BoxProps;
  buttonProps?: ButtonProps;
  collapsable?: boolean;
}) {
  const store = useTaskQuickEditorStore();

  useEffect(() => {
    store.modes.tag.setIsCollapsable(collapsable);
  }, [store.modes.tag, collapsable]);

  return (
    <Box
      data-id={TAGS_ID}
      display='flex'
      {...boxProps}
      ref={store.modes.tag.setContainerRef}
    >
      {store.modes.tag.isCollapsed ? (
        store.modes.tag.tags.length > 0 && (
          <Popover
            isOpen={store.modes.tag.isCollapseOpen}
            onOpen={store.modes.tag.handleCollapseOpen}
            onClose={store.modes.tag.handleCollapseClose}
            offset={[0, 16]}
            returnFocusOnClose={false}
            autoFocus={false}
            closeOnBlur={true}
          >
            <PopoverTrigger>
              <Button
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
            <PopoverContent w='auto' minW='3xs'>
              <PopoverBody
                display='flex'
                flexDirection='column'
                overflow='auto'
                maxH={64}
              >
                <VStack alignItems='start'>
                  <TaskQuickEditorTagsList buttonProps={buttonProps} />
                </VStack>
              </PopoverBody>
            </PopoverContent>
          </Popover>
        )
      ) : (
        <TaskQuickEditorTagsList buttonProps={buttonProps} />
      )}
    </Box>
  );
});
