import React, { PropsWithChildren } from 'react';
import { observer } from 'mobx-react-lite';
import { chakra } from '@chakra-ui/react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { ChakraStyledOptions } from '@chakra-ui/system/dist/declarations/src/system';

interface DragItem {
  index: number;
  data: string;
  type: string;
}

export const DndList = observer(function DndList({
                                                   children,
                                                   onMove
                                                 }: PropsWithChildren<{ onMove: (dragIndex: number, hoverIndex: number) => void }>) {

  return (
    <DragDropContext onDragEnd={onMove}>
      <Droppable droppableId='droppable'>
        {(provided, snapshot) => (
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

export const DndItem = observer(function DndItem<T extends { id: any }>({
                                                                          children,
                                                                          item,
                                                                          index,
                                                                          ...rest
                                                                        }: PropsWithChildren<{
  item: T,
  index: number,
} & ChakraStyledOptions>) {
  return (
    <Draggable draggableId={'' + item.id} index={index}>
      {(provided, snapshot) => (
        <chakra.div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          {...rest}
          style={provided.draggableProps.style}
        >
          {children}
        </chakra.div>
      )}
    </Draggable>
  );
});