import { observer } from 'mobx-react-lite';
import { FocusConfigurationProps, useFocusConfigurationStore } from './store';
import {
  Box,
  FormControl,
  FormLabel,
  Heading,
  HStack,
  Switch,
  Text,
  Flex,
  ToastId,
  useOutsideClick,
  useToast,
  Button,
} from '@chakra-ui/react';
import React, { useEffect, useRef } from 'react';
import { useListNavigation } from '../../../../../helpers/ListNavigation';
import { useHotkeysHandler } from '../../../../../helpers/useHotkeysHandler';
import { AnimatedBlock } from "../../../../shared/AnimatedBlock";
import { HotkeyBlock } from "../../../../shared/HotkeyBlock";
import { CloseButton } from "../../../../shared/CloseButton";
import { GoalsSelection } from "../../../../shared/GoalsSelection";
import { FocusConfigurationIntroducing } from "./components/FocusConfigurationIntroducing";

export const FocusConfigurationView = observer(function FocusConfigurationView(
  props: FocusConfigurationProps
) {
  const ref = useRef(null);
  const toastRef = useRef<ToastId>(null);
  const toast = useToast();
  const store = useFocusConfigurationStore();

  useListNavigation(store.navigation);
  useHotkeysHandler(store.keyMap, store.hotkeyHandlers)

  useOutsideClick({
    ref,
    handler: store.handleBlur,
  });

  useEffect(() => {
    toastRef.current = toast({
      position: 'bottom',
      duration: null,
      containerStyle: {
        minW: 'auto',
        m: 6,
      },
      render: () => (
        <Flex
          color='white'
          pt={2}
          pb={2}
          pl={4}
          pr={4}
          bg='gray.700'
          lineHeight={4}
          borderRadius={4}
          fontSize='xs'
          alignItems='center'
          justifyContent='center'
        >
          Focus mode is enabled
          <Button
            variant='unstyled'
            h='auto'
            color='gray.400'
            fontSize='xs'
            lineHeight={4}
            fontWeight='normal'
            p={0}
            ml={2}
            textDecoration='underline'
            _hover={{ color: 'gray.500' }}
            onClick={store.callbacks?.onClose}
          >
            Close mode
          </Button>
        </Flex>
      ),
    });

    return () => toast.close(toastRef.current)
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <AnimatedBlock
      animateParams={props.focusHighlightParams}
      component={Box}
      p={4}
      height='100%'
      display='flex'
      flexDirection='column'
      justifyContent='space-between'
    >
      <Box pl={2} pr={2} width='100%' minH={0} display='flex' flexDirection='column'>
        <HStack
          justifyContent='space-between'
          alignItems='center'
        >
          <Heading as='h3' fontSize='22px'>Focusing</Heading>
          <CloseButton onlyIcon onClick={store.callbacks.onClose} />
        </HStack>
        <Box
          ref={ref}
          mt={4}
          p={2}
          pl={1}
          borderRadius='md'
          bg={store.isBlockFocused && store.root.resources.goals.haveGoals ? 'gray.50' : 'transparent'}
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
          <GoalsSelection
            multiple
            editable
            callbacks={store.goalsSelectionCallbacks}
            checked={store.data.goals}
          />
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
      <FocusConfigurationIntroducing />
    </AnimatedBlock>
  );
});
