import {
  PopoverBody,
  PopoverContent,
  Portal,
  Fade,
  chakra,
} from '@chakra-ui/react';
import React from 'react';
import { observer } from 'mobx-react-lite';
import { useSpaceSelectStore } from '../../store';
import { useListNavigation } from '../../../../../helpers/ListNavigation';
import { SpaceSelectItem } from '../SpaceSelectItem';
import { SpaceSelectCreateItem } from '../SpaceSelectCreateItem';

export const SpaceSelectContent = observer(function SpaceSelectContent() {
  const store = useSpaceSelectStore();

  useListNavigation(store.menuNavigation);

  return (
    <Portal>
      <Fade in={store.isMenuOpen} unmountOnExit>
        <PopoverContent
          tabIndex={-1}
          p={0}
          boxShadow='lg'
          minW={32}
          maxW={72}
          w='auto'
          maxH={64}
          overflow='auto'
          onFocus={store.menuNavigation.handleFocus}
        >
          {/*<PopoverBody p={0}>*/}
          {/*  <div>*/}
            {store.spaces.map((space, index) => (
              <SpaceSelectItem key={space.id} space={space} index={index} />
            ))}
            <SpaceSelectCreateItem />
            {/*</div>*/}
          {/*</PopoverBody>*/}
        </PopoverContent>
      </Fade>
    </Portal>
  );
});
