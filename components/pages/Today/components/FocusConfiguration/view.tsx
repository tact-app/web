import { observer } from 'mobx-react-lite';
import { FocusConfigurationProps, useFocusConfigurationStore } from './store';
import {
  Box,
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
import React, { useRef } from 'react';
import { useListNavigation } from '../../../../../helpers/ListNavigation';
import { useHotkeysHandler } from '../../../../../helpers/useHotkeysHandler';
import { AnimatedBlock } from "../../../../shared/AnimatedBlock";
import { HotkeyBlock } from "../../../../shared/HotkeyBlock";
import { CloseButton } from "../../../../shared/CloseButton";

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
    <AnimatedBlock
      animateParams={props.focusHighlightParams}
      component={Box}
      ref={ref}
      p={6}
      height='100%'
      display='flex'
      flexDirection='column'
      justifyContent='space-between'
      onMouseDown={store.handleMouseDown}
    >
      <Box width='100%' minH={0} display='flex' flexDirection='column'>
        <HStack
          justifyContent='space-between'
          alignItems='center'
        >
          <Heading as='h3' fontSize='22px'>Focusing</Heading>
          <CloseButton onlyIcon onClick={store.callbacks.onClose} />
        </HStack>
        <Box
          mt={4}
          p={2}
          pl={1}
          borderRadius='md'
          bg={store.isFocused ? 'gray.50' : 'white'}
          minH={0}
          display='flex'
          flexDirection='column'
          onFocus={store.navigation.handleFocus}
        >
          <HStack pb={4} alignItems='baseline' pl={1}>
            <Text fontSize='md' lineHeight={6} fontWeight='semibold' color='gray.700'>
              On goal
            </Text>
            <HotkeyBlock hotkey='Press G' ml={2} lineHeight={5} fontSize='sm' />
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
        <FormControl display='flex' alignItems='center' mt={6}>
          <Switch
            id='important-tasks'
            isChecked={store.data.showImportant}
            onChange={store.handleShowImportantChange}
          />
          <FormLabel
            htmlFor='important-tasks'
            mb='0'
            ml={2}
            cursor='pointer'
            display='flex'
            alignItems='baseline'
          >
            <Text fontSize='lg' fontWeight='semibold'>
              High priority
            </Text>
            <HotkeyBlock hotkey='Press H' ml={2} lineHeight={5} fontSize='sm' />
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
    </AnimatedBlock>
  );
});
