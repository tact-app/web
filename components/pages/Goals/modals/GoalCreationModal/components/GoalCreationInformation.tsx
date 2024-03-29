import { observer } from 'mobx-react-lite';
import { Box, chakra, Table, Tbody, Td, Text, Tr } from '@chakra-ui/react';
import { useGoalCreationModalStore } from '../store';
import React, { ReactElement } from 'react';
import { TasksListWithCreator } from '../../../../../shared/TasksListWithCreator';
import { DraggableListContext } from '../../../../../shared/DraggableList/view';
import { SpaceSelect } from '../../../../../shared/SpaceSelect';
import { DatePicker } from '../../../../../shared/DatePicker';
import { Lists } from '../../../../../shared/TasksList/constants';

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
                  <SpaceSelect
                    selectedId={store.goal.spaceId}
                    onChange={store.handleSpaceChange}
                    onNavigateToSpace={store.handleNavigateToSpace}
                    onCreateModalOpened={store.handleOpenSpaceCreateModal}
                  />
                )}
                {renderInformationItem(
                  'Start date',
                  <DatePicker
                    selectsStart
                    showTooltip
                    tooltipPlacement='bottom'
                    value={store.goal.startDate}
                    startDate={store.goal.startDate}
                    endDate={store.goal.targetDate}
                    onChanged={store.handleStartDateChange}
                    pl='0.3rem'
                  />
                )}
                {renderInformationItem(
                  'Target date',
                  <DatePicker
                    selectsEnd
                    showTooltip
                    tooltipPlacement='bottom'
                    startDate={store.goal.startDate}
                    endDate={store.goal.targetDate}
                    minDate={store.goal.startDate}
                    value={store.goal.targetDate}
                    onChanged={store.handleTargetDateChange}
                    pl='0.3rem'
                  />
                )}
              </Tbody>
            </Table>
          </chakra.div>
        </Box>
        <Box
          p={1}
          pt={4}
          w='100%'
          overflow='hidden'
          flex='1 0 0'
          onFocus={store.enableHotkeysForTasks}
          onBlur={store.disableHotkeysForTasks}
        >
          <Text fontWeight='semibold' mb={2} pl={5}>Task list</Text>
          <DraggableListContext
            onDragStart={store.listWithCreator.list.draggableList.startDragging}
            onDragEnd={store.listWithCreator.list.draggableList.endDragging}
            sensors={store.listWithCreator.list.draggableList.sensors}
          >
            <TasksListWithCreator
              instance={store.listWithCreator}
              listId={Lists.TODAY}
              tasksListCallbacks={store.tasksListCallbacks}
              forcedLoadTasks={store.isUpdating}
              delayedCreation={!store.isUpdating}
              dnd
              disableSpaceChange
              disableGoalChange
              defaultSpaceId={store.goal.spaceId}
              defaultGoalId={store.goal.id}
              disableReferenceChange
              displayCreatorHelpAsTooltip
              unfocusWhenClickOutside
              isHotkeysEnabled={store.isHotkeysForTasksAvailable}
              taskListWrapperProps={{
                maxH: 'calc(100% - var(--chakra-space-20))',
                overflowY: 'auto',
                overflowX: 'hidden',
              }}
            />
          </DraggableListContext>
        </Box>
      </Box>
    );
  }
);
