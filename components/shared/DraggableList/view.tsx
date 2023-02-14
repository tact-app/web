import { observer } from 'mobx-react-lite';
import { Box, BoxProps, chakra, ChakraProps } from '@chakra-ui/react';
import React, { PropsWithChildren } from 'react';
import { Draggable, DragDropContext, Droppable, useMouseSensor, useTouchSensor } from 'react-beautiful-dnd';
import { TaskDragIcon } from '../Icons/TaskDragIcon';
import { DraggableListComponentProps, useDraggableListStore } from './store';
import { useHotkeysHandler } from '../../../helpers/useHotkeysHandler';

export const DraggableListContext = observer(function DraggableListContext({
  onDragStart,
  onDragEnd,
  sensors,
  children,
}: PropsWithChildren<{
  onDragStart: (result) => void;
  onDragEnd: (result) => void;
  sensors: any[];
}>) {
  return (
    <DragDropContext
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      sensors={[useMouseSensor, useTouchSensor, ...sensors]}
      enableDefaultSensors={false}
    >
      {children}
    </DragDropContext>
  );
});

export const DraggableListDroppable = observer(function TaskListWrapper({
  children,
  id,
  hidePlaceholder,
  ...rest
}: PropsWithChildren<{ id: string; hidePlaceholder?: boolean } & ChakraProps>) {
  return (
    <Droppable droppableId={id}>
      {(provided) => (
        <chakra.div
          {...provided.droppableProps}
          ref={provided.innerRef}
          {...rest}
        >
          {children}
          {!hidePlaceholder && provided.placeholder}
        </chakra.div>
      )}
    </Droppable>
  );
});

const DraggableListItemWrapper = observer(function DraggableListItemWrapper({
  prefix: Prefix,
  dragHandler: DragHandler,
  content: Content,
  snapshot,
  provided,
  id,
}: DraggableListComponentProps & {
  snapshot: any;
  provided: any;
  id: string;
}) {
  const store = useDraggableListStore();
  const isFocused = store.focusedItemIds.includes(id);

  return (
    <Box
      w='100%'
      ref={
        isFocused && store.lastFocusedItemId === id
          ? (el) => store.setFocusedRef(el)
          : null
      }
    >
      {Prefix && <Prefix id={id} snapshot={snapshot} />}
      <DragHandler provided={provided} snapshot={snapshot} id={id} />
      <Content id={id} isFocused={isFocused} snapshot={snapshot} provided={provided} />
    </Box>
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
        tabIndex={-1}
      >
        {!store.checkItemActivity || store.checkItemActivity(id) ? (
          <Box cursor='grab' aria-label='Drag' outline='none'>
            <TaskDragIcon />
          </Box>
        ) : null}
      </Box>
    );
  }
);

function getStyle(style, snapshot) {
  if (!snapshot.isDropAnimating) {
    return style;
  }
  return {
    ...style,
    // cannot be 0, but make it super tiny
    transitionDuration: `0.001s`,
  };
}

export const DraggableListView = observer(function DraggableListView({
  prefix,
  dragHandler = DefaultDraggableListDragHandler,
  content,
  id: droppableId,
  wrapperProps,
  boxProps,
}: DraggableListComponentProps & {
  id: string;
  boxProps?: BoxProps;
  wrapperProps?: BoxProps;
}) {
  const store = useDraggableListStore();

  useHotkeysHandler(store.keymap, store.hotkeyHandlers, {
    enabled: store.isHotkeysActive,
  });

  return (
    <Box {...wrapperProps}>
      <DraggableListDroppable id={droppableId}>
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
                  style={getStyle(provided.draggableProps.style, snapshot)}
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
      </DraggableListDroppable>
    </Box>
  );
});
