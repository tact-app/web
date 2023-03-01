import { observer } from 'mobx-react-lite';
import { Box, Table, Tbody, Tr, Td, Text } from '@chakra-ui/react';
import { useGoalCreationModalStore } from '../store';
import React, { ReactElement } from "react";
import { TasksListWithCreator } from "../../../../../shared/TasksListWithCreator";
import { DraggableListContext } from "../../../../../shared/DraggableList/view";
import { SpaceSelect } from "../../../../../shared/SpaceSelect";

export const GoalCreationInformation = observer(
  function GoalCreationInformation() {
    const store = useGoalCreationModalStore();

    const renderInformationItem = (title: string, content: ReactElement) => (
      <Tr border={0}>
        <Td pb={0} pl={0} border={0} pt={3}>
          <Text color='gray.500'>{title}:</Text>
        </Td>
        <Td pb={0} pr={0} pl={6} border={0} pt={3}>{content}</Td>
      </Tr>
    );

    return (
      <Box
        display='flex'
        alignItems='center'
        flexDirection='column'
        width='100%'
        height='100%'
      >
        <Box pt={6} pr={6} pl={6} width='100%'>
          <Text fontWeight='semibold'>Information</Text>
          <Table variant='simple' size='sm' width='auto'>
            <Tbody>
              {renderInformationItem(
                'Space',
                <SpaceSelect selectedId={undefined} callbacks={{ onNavigate: () => null }} />
              )}
            </Tbody>
          </Table>
        </Box>
        <Box p={6}>
          <Text fontWeight='semibold' mb={2}>Task list</Text>
          <DraggableListContext
            onDragStart={store.listWithCreator.list.draggableList.startDragging}
            onDragEnd={store.listWithCreator.list.draggableList.endDragging}
            sensors={store.listWithCreator.list.draggableList.sensors}
          >
            <TasksListWithCreator
              defaultSave
              instance={store.listWithCreator}
              listId={store.existedGoal?.listId ?? 'new'}
              // isHotkeysEnabled={store.isHotkeysEnabled}
              tasksListCallbacks={store.tasksListCallbacks}
              taskCreatorCallbacks={store.taskCreatorCallbacks}
            />
          </DraggableListContext>
        </Box>
      </Box>
    );
  }
);
