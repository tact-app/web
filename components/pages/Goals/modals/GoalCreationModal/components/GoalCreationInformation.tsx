import { observer } from 'mobx-react-lite';
import { chakra, Box, Table, Tbody, Tr, Td, Text } from '@chakra-ui/react';
import { useGoalCreationModalStore } from '../store';
import React, { ReactElement } from "react";
import { TasksListWithCreator } from "../../../../../shared/TasksListWithCreator";
import { DraggableListContext } from "../../../../../shared/DraggableList/view";
import { SpaceSelect } from "../../../../../shared/SpaceSelect";
import { DatePicker } from "../../../../../shared/DatePicker";

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
          <chakra.div borderBottom={1} borderColor='gray.200' borderStyle='solid' pb={4}>
            <Text fontWeight='semibold'>Information</Text>
            <Table variant='simple' size='sm' width='auto'>
              <Tbody>
                {renderInformationItem(
                  'Space',
                  <SpaceSelect selectedId={store.goal.spaceId} onChange={store.handleSpaceChange} />
                )}
                {renderInformationItem(
                  'Start date',
                  <DatePicker value={store.goal.startDate} onChange={store.handleStartDateChange} pl='0.3rem' />
                )}
                {renderInformationItem(
                  'Target date',
                  <DatePicker value={store.goal.targetDate} onChange={store.handleTargetDateChange} pl='0.3rem' />
                )}
              </Tbody>
            </Table>
          </chakra.div>
        </Box>
        <Box p={6} pt={4}>
          <Text fontWeight='semibold' mb={2}>Task list</Text>
          <DraggableListContext
            onDragStart={store.listWithCreator.list.draggableList.startDragging}
            onDragEnd={store.listWithCreator.list.draggableList.endDragging}
            sensors={store.listWithCreator.list.draggableList.sensors}
          >
            <TasksListWithCreator
              instance={store.listWithCreator}
              listId={store.goal.id}
              tasksListCallbacks={store.tasksListCallbacks}
              delayedCreation
              disableSpaceChange
              disableGoalChange
            />
          </DraggableListContext>
        </Box>
      </Box>
    );
  }
);