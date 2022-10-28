import { observer } from 'mobx-react-lite';
import { Box, BoxProps, IconButton, useOutsideClick } from '@chakra-ui/react';
import React, { PropsWithChildren, useRef } from 'react';
import { Draggable, DragDropContext, Droppable } from 'react-beautiful-dnd';
import { TaskDragIcon } from '../Icons/TaskDragIcon';
import { DraggableListComponentProps, useDraggableListStore } from './store';
import { useHotkeysHandler } from '../../../helpers/useHotkeysHandler';

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

const DraggableListWrapper = observer(function TaskListWrapper({
  children,
}: PropsWithChildren) {
  const store = useDraggableListStore();

  return (
    <DragDropContext
      onDragStart={store.startDragging}
      onDragEnd={store.endDragging}
      sensors={[store.setDnDApi]}
    >
      <Droppable droppableId='droppable'>
        {(provided) => (
          <div {...provided.droppableProps} ref={provided.innerRef}>
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
  id,
}: DraggableListComponentProps & { snapshot: any; provided: any; id: string }) {
  const store = useDraggableListStore();

  return (
    <>
      {Prefix && <Prefix id={id} snapshot={snapshot} />}
      <DragHandler provided={provided} snapshot={snapshot} id={id} />
      <Content
        id={id}
        isFocused={store.focusedItemIds.includes(id)}
        snapshot={snapshot}
      />
    </>
  );
});

export const DefaultDraggableListDragHandler = observer(
  function DefaultDraggableListDragHandler({
    provided,
    snapshot,
    id,
  }: {
    snapshot: any;
    provided: any;
    id: string;
  }) {
    const store = useDraggableListStore();

    return (
      <Box
        position='absolute'
        left={-6}
        top={0}
        bottom={0}
        display='flex'
        transition='opacity 0.2s'
        opacity={
          snapshot.isDragging && !store.isControlDraggingActive ? '1' : '0'
        }
        flexDirection='column'
        justifyContent='center'
        _groupHover={{
          opacity: !store.isDraggingActive ? '1' : '0',
        }}
        {...provided.dragHandleProps}
      >
        {!store.checkItemActivity || store.checkItemActivity(id) ? (
          <IconButton
            cursor='grab'
            size='xs'
            aria-label='Drag'
            icon={<TaskDragIcon />}
            variant='unstyled'
          />
        ) : null}
      </Box>
    );
  }
);

export const DraggableListView = observer(function DraggableListView({
  prefix,
  dragHandler = DefaultDraggableListDragHandler,
  content,
  wrapperProps,
  boxProps,
}: DraggableListComponentProps & {
  boxProps?: BoxProps;
  wrapperProps?: BoxProps;
}) {
  const store = useDraggableListStore();
  const ref = useRef(null);

  useOutsideClick({
    ref: ref,
    enabled: store.isOutsideClickEnabled,
    handler: store.resetFocusedItem,
  });

  useHotkeysHandler(keyMap, store.hotkeyHandlers);

  return (
    <Box ref={ref} overflow='auto' {...wrapperProps}>
      <DraggableListWrapper>
        {store.items.map((id, index) => {
          return (
            <Draggable draggableId={id} index={index} key={id}>
              {(provided, snapshot) => (
                <Box
                  ref={provided.innerRef}
                  index={index}
                  position='relative'
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
        })}
      </DraggableListWrapper>
    </Box>
  );
});
