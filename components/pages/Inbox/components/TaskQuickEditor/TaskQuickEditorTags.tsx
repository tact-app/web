import { observer } from 'mobx-react-lite';
import { useTaskQuickEditorStore } from './store';
import { AnimatePresence, motion } from 'framer-motion';
import { Button, Tag } from '@chakra-ui/react';
import React from 'react';

export const TaskQuickEditorTags = observer(function TaskQuickEditTags() {
  const store = useTaskQuickEditorStore();

  return (
    <AnimatePresence mode='popLayout' initial={false}>
      {
        store.tags.map(({ title, id }) => (
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
              onClick={() => store.removeTag(id, true)}
              ref={(el) => store.setTagRef(el, id)}
              onKeyDown={(e) => store.handleTagKeyDown(e, id)}
            >
              <Tag
                bg='blue.400'
                color='white'
                cursor='pointer'
              >
                {title}
              </Tag>
            </Button>
          </motion.div>
        ))
      }
    </AnimatePresence>
  );
});
