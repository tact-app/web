import { observer } from 'mobx-react-lite';
import { Box, chakra } from '@chakra-ui/react';
import React, { PropsWithChildren } from 'react';
import { Draggable, DragDropContext, Droppable } from 'react-beautiful-dnd';
import { TaskDragIcon } from '../../pages/Inbox/components/TaskIcons/TaskDragIcon';
import { DraggableListComponentProps, DraggableListProps, useDraggableListStore } from './store';
import { GlobalHotKeys } from 'react-hotkeys';

const keyMap = {
  UP: 'up',
  DOWN: 'down',
  DONE: 'd',
  WONT_DO: ['w', 'cmd+w'],
  EDIT: 'space',
  MOVE_UP: ['j', 'cmd+up'],
  MOVE_DOWN: ['k', 'cmd+down'],
  SELECT_UP: ['shift+up'],
  SELECT_DOWN: ['shift+down'],
  ESC: 'esc',
  FORCE_DELETE: ['cmd+backspace', 'cmd+delete'],
  DELETE: ['del', 'backspace'],
  OPEN: 'enter',
};

const DraggableListWrapper = observer(function TaskListWrapper({ children }: PropsWithChildren) {
  const store = useDraggableListStore();

  return (
    <DragDropContext
      onDragStart={store.startDragging}
      onDragEnd={store.endDragging}
      sensors={[store.setDnDApi]}
    >
      <Droppable droppableId='droppable'>
        {(provided) => (
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
          >
            {children}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
});

export const DefaultDraggableListDragHandler = ({ provided, snapshot }) => {
  const store = useDraggableListStore();

  return (
    <chakra.div
      alignSelf='center'
      display='flex'
      visibility={snapshot.isDragging && !store.isControlDraggingActive ? 'visible' : 'hidden'}
      flexDirection='column'
      justifyContent='center'
      mr={1}
      _groupHover={{
        visibility: !store.isDraggingActive ? 'visible' : 'hidden',
      }}
      {...provided.dragHandleProps}
    >
      <TaskDragIcon/>
    </chakra.div>
  );
}

export const DraggableListView = observer(function DraggableListView({
                                                                       prefix: Prefix,
                                                                       dragHandler: DragHandler = DefaultDraggableListDragHandler,
                                                                       content: Content,
                                                                     }: DraggableListComponentProps) {
  const store = useDraggableListStore();

  return (
    <GlobalHotKeys
      keyMap={keyMap}
      handlers={store.hotkeyHandlers}
    >
      <Box>
        <DraggableListWrapper>
          {
            store.items.map((id, index) => {
              return (
                <Draggable draggableId={id} index={index} key={id}>
                  {(provided, snapshot) => (
                    <Box
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      index={index}
                      role='group'
                      display='flex'
                      style={provided.draggableProps.style}
                    >
                      {Prefix && <Prefix id={id} snapshot={snapshot}/>}
                      <DragHandler provided={provided} snapshot={snapshot}/>
                      <Content id={id} isFocused={store.focusedItemIds.includes(id)} snapshot={snapshot}/>
                    </Box>
                  )}
                </Draggable>
              );
            })
          }
        </DraggableListWrapper>
      </Box>
    </GlobalHotKeys>
  );
});