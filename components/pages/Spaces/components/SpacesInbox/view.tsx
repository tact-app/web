import { observer } from 'mobx-react-lite';
import { SpacesInboxProps, useSpacesInboxStore } from './store';
import {
  Box,
  Container,
  Heading,
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
} from '@chakra-ui/react';
import { SpacesInboxItemRow } from './SpacesInboxItemRow';
import { SearchIcon } from '../../../../shared/Icons/SearchIcon';
import { useHotkeysHandler } from '../../../../../helpers/useHotkeysHandler';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faListCheck } from '@fortawesome/pro-regular-svg-icons';

export const SpacesInboxView = observer(function SpacesInboxView(
  props: SpacesInboxProps
) {
  const store = useSpacesInboxStore();

  useHotkeysHandler(store.keyMap, store.hotkeysHandlers, {
    enabled: props.isHotkeysEnabled,
  });

  return (
    <Container
      flex={1}
      maxW='container.lg'
      mt={10}
      h='100%'
      onMouseDown={store.callbacks.onFocus}
    >
      <Box
        display='flex'
        justifyContent='space-between'
        alignItems='center'
        mb={7}
      >
        <Heading color='gray.700' size='lg'>
          {store.space?.name}
        </Heading>
        <Box>
          <IconButton
            aria-label='today help'
            size='xs'
            variant='ghost'
            onClick={props.callbacks.onTodayHelpClick}
          >
            <FontAwesomeIcon
              icon={faListCheck}
              fixedWidth
              size='lg'
              color='var(--chakra-colors-gray-400)'
            />
          </IconButton>
        </Box>
      </Box>
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
