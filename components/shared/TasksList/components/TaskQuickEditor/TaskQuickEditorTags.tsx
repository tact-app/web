import { observer } from 'mobx-react-lite';
import { useTaskQuickEditorStore } from './store';
import { AnimatePresence, motion } from 'framer-motion';
import { Button, HStack, Tag } from '@chakra-ui/react';
import React from 'react';

export const TAGS_ID = 'task-quick-editor-tags';

export const TaskQuickEditorTags = observer(function TaskQuickEditTags() {
  const store = useTaskQuickEditorStore();

  return (
    <HStack data-id={TAGS_ID}>
      <AnimatePresence mode='popLayout' initial={false}>
        {store.modes.tag.tags.map(({ title, id }) => (
          <motion.div
            layout
            key={title}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ type: 'just' }}
            exit={{ opacity: 0 }}
          >
            <Button
              variant='unstyled'
              size='xs'
              onClick={() => store.modes.tag.removeTag(id, true)}
              ref={(el) => store.modes.tag.setTagRef(el, id)}
              onKeyDown={(e) => store.modes.tag.handleButtonKeyDown(e, id)}
              fontSize='initial'
              verticalAlign='initial'
            >
              <Tag bg='blue.400' color='white' cursor='pointer'>
                {title}
              </Tag>
            </Button>
          </motion.div>
        ))}
      </AnimatePresence>
    </HStack>
  );
});
