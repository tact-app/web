import { observer } from 'mobx-react-lite';
import { useTaskQuickEditorStore } from './store';
import { AnimatePresence, motion } from 'framer-motion';
import { Box, BoxProps, Button, ButtonProps, Tag } from '@chakra-ui/react';
import React from 'react';

export const TAGS_ID = 'task-quick-editor-tags';

export const TaskQuickEditorTags = observer(function TaskQuickEditTags({
  boxProps,
  buttonProps,
}: {
  boxProps?: BoxProps;
  buttonProps?: ButtonProps;
}) {
  const store = useTaskQuickEditorStore();

  return (
    <Box data-id={TAGS_ID} display='flex' {...boxProps}>
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
              onClick={() => store.modes.tag.removeTag(id, true)}
              ref={(el) => store.modes.tag.setTagRef(el, id)}
              onKeyDown={(e) => store.modes.tag.handleButtonKeyDown(e, id)}
              fontSize='initial'
              verticalAlign='initial'
              mr={2}
              {...buttonProps}
            >
              <Tag bg='blue.400' color='white' cursor='pointer'>
                {title}
              </Tag>
            </Button>
          </motion.span>
        ))}
      </AnimatePresence>
    </Box>
  );
});
