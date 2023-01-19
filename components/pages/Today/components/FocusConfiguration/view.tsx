import { observer } from 'mobx-react-lite';
import { FocusConfigurationProps, useFocusConfigurationStore } from './store';
import {
  Box,
  CloseButton,
  Fade,
  FormControl,
  FormLabel,
  Heading,
  HStack,
  Switch,
  Text,
  useOutsideClick,
} from '@chakra-ui/react';
import { GoalsSelectionStoreProvider } from '../../../../shared/GoalsSelection/store';
import { GoalsSelectionView } from '../../../../shared/GoalsSelection/view';
import { useRef } from 'react';
import { useListNavigation } from '../../../../../helpers/ListNavigation';
import { useHotkeysHandler } from '../../../../../helpers/useHotkeysHandler';

export const FocusConfigurationView = observer(function FocusConfigurationView(
  props: FocusConfigurationProps
) {
  const ref = useRef(null);
  const store = useFocusConfigurationStore();

  useListNavigation(store.navigation);
  useHotkeysHandler(store.keyMap, store.hotkeyHandlers)

  useOutsideClick({
    ref,
    handler: store.handleBlur,
  });

  return (
    <Box
      ref={ref}
      p={4}
      height='100%'
      display='flex'
      flexDirection='column'
      justifyContent='space-between'
      onMouseDown={store.handleMouseDown}
    >
      <Box width='100%' minH={0} display='flex' flexDirection='column'>
        <HStack
          justifyContent='space-between'
          pt={4}
          mt={1.5}
          ml={4}
          alignItems='center'
        >
          <Heading size='lg'>Focus setting</Heading>
          <CloseButton
            onClick={store.callbacks.onClose}
            color='gray.400'
            size='sm'
          />
        </HStack>
        <Text pt={5} ml={4} size='sm' fontWeight='normal' color='gray.400'>
          Press ⇧ C to clear
        </Text>
        <Box
          p={2}
          pl={1}
          borderRadius='md'
          bg={store.isFocused ? 'gray.50' : 'white'}
          ml={2}
          minH={0}
          display='flex'
          flexDirection='column'
          onFocus={store.navigation.handleFocus}
        >
          <HStack pb={2} alignItems='baseline' pl={1}>
            <Text fontSize='lg' fontWeight='semibold'>
              Goals
            </Text>
            <Text fontSize='sm' fontWeight='normal' color='gray.400'>
              ⇧ G
            </Text>
          </HStack>
          <GoalsSelectionStoreProvider
            multiple
            instance={store.goalsSelection}
            checked={store.data.goals}
            callbacks={store.goalsSelectionCallbacks}
          >
            <GoalsSelectionView setRefs={store.navigation.setRefs} />
          </GoalsSelectionStoreProvider>
        </Box>
        <FormControl display='flex' alignItems='center' ml={4} mt={7}>
          <Switch
            id='important-tasks'
            isChecked={store.data.showImportant}
            onChange={store.handleShowImportantChange}
          />
          <FormLabel
            htmlFor='important-tasks'
            mb='0'
            ml={4}
            cursor='pointer'
            display='flex'
            alignItems='baseline'
          >
            <Text fontSize='lg' fontWeight='semibold'>
              Important
            </Text>
            <Text fontSize='sm' fontWeight='normal' color='gray.400' ml={2}>
              I
            </Text>
          </FormLabel>
        </FormControl>
      </Box>
      <Fade in={store.hasConfiguration}>
        <Box
          ml={4}
          mb={6}
          h={10}
          borderBottom='1px'
          borderColor='gray.100'
          display='flex'
          alignItems='center'
        >
          <Text fontSize='md' fontWeight='normal'>
            Total: {props.getItemsCount()} tasks
          </Text>
        </Box>
      </Fade>
    </Box>
  );
});
