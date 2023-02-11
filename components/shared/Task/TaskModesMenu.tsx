import { HStack } from '@chakra-ui/react';
import { TaskQuickEditorPriority } from '../TaskQuickEditor/TaskQuickEditorPriority';
import { TaskQuickEditorGoal } from '../TaskQuickEditor/TaskQuickEditorGoal';
import { TaskQuickEditorSpace } from '../TaskQuickEditor/TaskQuickEditorSpace';
import React from 'react';
import { observer } from 'mobx-react-lite';
import { useTaskStore } from './store';

export const TaskModesMenu = observer(function TaskModesMenu() {
  const store = useTaskStore();

  return store.quickEditor.isFilled ? (
    <HStack mb={4} spacing={6} h={10}>
      <TaskQuickEditorSpace withTitle iconSize={6} w='auto' h={8} />
      <TaskQuickEditorPriority
        withTitle
        showEmpty
        w='auto'
        h={8}
        pt={1.5}
        pb={1.5}
        pl={0.5}
        pr={1}
      />
      <TaskQuickEditorGoal
        withTitle
        showEmpty
        w='auto'
        h='auto'
        iconFontSize='lg'
        iconSize={8}
      />
    </HStack>
  ) : null;
});
