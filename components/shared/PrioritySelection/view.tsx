import React, { useRef } from 'react';
import { observer } from 'mobx-react-lite';
import { List } from '@chakra-ui/react';
import { PrioritySelectionProps, usePrioritySelectionStore } from './store';
import { PriorityListItem } from './components/PriorityListItem'
import { TaskPriorityArray } from '../TasksList/types';

export const PrioritySelectionView = observer(function SpaceSelectionView(
  props: Partial<PrioritySelectionProps>
) {
  const store = usePrioritySelectionStore();
  const ref = useRef();

  return (
    <List ref={ref} h='100%' overflowY='auto' pl={1} pr={1}>
      {TaskPriorityArray.map((item, index) => (
        <PriorityListItem
          ref={(el) => props.setRefs(index + 1, el)}
          key={item}
          priority={item}
          checkboxContent={index < 9 ? index + 1 : null}
        />
      ))}
    </List>
  )
});
