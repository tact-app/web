import { observer } from 'mobx-react-lite';
import { SpacesInboxProps, useSpacesInboxStore } from './store';
import {
  Container,
  Heading,
  Input,
  InputGroup,
  InputRightElement,
} from '@chakra-ui/react';
import { SpacesInboxItemRow } from './SpacesInboxItemRow';
import { SearchIcon } from '../../../../shared/Icons/SearchIcon';
import { useHotkeysHandler } from '../../../../../helpers/useHotkeysHandler';

export const SpacesInboxView = observer(function SpacesInboxView(
  props: SpacesInboxProps
) {
  const store = useSpacesInboxStore();

  useHotkeysHandler(store.keyMap, store.hotkeysHandlers, {
    enabled: props.hotkeysEnabled,
  });

  return (
    <Container
      flex={1}
      maxW='container.lg'
      mt={10}
      onMouseDown={store.callbacks.onFocus}
    >
      <Heading color='gray.700' size='lg' mb={7}>
        {store.space?.name}
      </Heading>
      <InputGroup size='md' mb={6}>
        <Input placeholder='Search...' borderWidth='2px' />
        <InputRightElement>
          <SearchIcon />
        </InputRightElement>
      </InputGroup>
      {store.items.map((item) => (
        <SpacesInboxItemRow item={item} key={item.id} />
      ))}
    </Container>
  );
});
