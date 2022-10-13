import { observer } from 'mobx-react-lite';
import { Box, BoxProps, IconButton, useOutsideClick } from '@chakra-ui/react';
import React, { PropsWithChildren, useRef } from 'react';
import { Draggable, DragDropContext, Droppable } from 'react-beautiful-dnd';
import { TaskDragIcon } from '../Icons/TaskDragIcon';
import { DraggableListComponentProps, useDraggableListStore } from './store';
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

const DraggableListItemWrapper = observer(function DraggableListItemWrapper({
                                                                              prefix: Prefix,
                                                                              dragHandler: DragHandler,
                                                                              content: Content,
                                                                              snapshot,
                                                                              provided,
                                                                              id
                                                                            }: DraggableListComponentProps & { snapshot: any, provided: any, id: string }) {
  const store = useDraggableListStore();

  return (
    <>
      {Prefix && <Prefix id={id} snapshot={snapshot}/>}
      <DragHandler provided={provided} snapshot={snapshot}/>
      <Content id={id} isFocused={store.focusedItemIds.includes(id)} snapshot={snapshot}/>
    </>
  );
});

export const DefaultDraggableListDragHandler = observer(function DefaultDraggableListDragHandler({
                                                                                                   provided,
                                                                                                   snapshot
                                                                                                 }: { snapshot: any, provided: any }) {
  const store = useDraggableListStore();

  return (
    <Box
      display='flex'
      visibility={snapshot.isDragging && !store.isControlDraggingActive ? 'visible' : 'hidden'}
      flexDirection='column'
      justifyContent='start'
      curso='grab'
      mr={1}
      _groupHover={{
        visibility: !store.isDraggingActive ? 'visible' : 'hidden',
      }}
      {...provided.dragHandleProps}
    >
      <IconButton
        size='xs'
        aria-label='Drag'
        icon={<TaskDragIcon/>}
        variant='unstyled'
      />
    </Box>
  );
});

export const DraggableListView = observer(function DraggableListView({
                                                                       prefix,
                                                                       dragHandler = DefaultDraggableListDragHandler,
                                                                       content,
                                                                       boxProps,
                                                                     }: DraggableListComponentProps & { boxProps?: BoxProps }) {
  const store = useDraggableListStore();
  const ref = useRef(null);

  useOutsideClick({
    ref: ref,
    handler: store.resetFocusedItem,
  });

  return (
    <GlobalHotKeys
      keyMap={keyMap}
      handlers={store.hotkeyHandlers}
    >
      <Box ref={ref}>
        <DraggableListWrapper>
          {
            store.items.map((id, index) => {
              return (
                <Draggable draggableId={id} index={index} key={id}>
                  {(provided, snapshot) => (
                    <Box
                      ref={provided.innerRef}
                      index={index}
                      role='group'
                      display='flex'
                      style={provided.draggableProps.style}
                      {...provided.draggableProps}
                      {...boxProps}
                    >
                      <DraggableListItemWrapper
                        id={id}
                        prefix={prefix}
                        dragHandler={dragHandler}
                        content={content}
                        snapshot={snapshot}
                        provided={provided}
                      />
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
