import { HStack } from '@chakra-ui/react';
import { TaskQuickEditorPriority } from '../TasksList/components/TaskQuickEditor/TaskQuickEditorPriority';
import { TaskQuickEditorGoal } from '../TasksList/components/TaskQuickEditor/TaskQuickEditorGoal';
import { TaskQuickEditorSpace } from '../TasksList/components/TaskQuickEditor/TaskQuickEditorSpace';
import React from 'react';
import { observer } from 'mobx-react-lite';
import { useTaskStore } from './store';

export const TaskModesMenu = observer(function TaskModesMenu() {
  const store = useTaskStore();

  return store.quickEditor.isFilled ? (
    <HStack mb={4} spacing={6} h={10}>
      <TaskQuickEditorPriority
        withTitle
        w='auto'
        h={8}
        pt={1.5}
        pb={1.5}
        pl={0.5}
        pr={1}
      />
      <TaskQuickEditorGoal
        withTitle
        w='auto'
        h='auto'
        iconFontSize='lg'
        iconSize={8}
      />
      <TaskQuickEditorSpace withTitle iconSize={6} w='auto' h={8} />
    </HStack>
  ) : null;
});
