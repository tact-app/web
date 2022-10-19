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
} from '@chakra-ui/react';
import { GoalsSelectionStoreProvider } from '../GoalsSelection/store';
import { GoalsSelectionView } from '../GoalsSelection/view';
import { useHotkeysHandler } from '../../../../../helpers/useHotkeysHandler';

export const FocusConfigurationView = observer(function FocusConfigurationView(props: FocusConfigurationProps) {
  const store = useFocusConfigurationStore();

  useHotkeysHandler(store.keyMap, store.hotkeyHandlers);

  return (
    <Box
      p={4}
      w='500px'
      borderRight='1px'
      borderColor='gray.100'
      display='flex'
      flexDirection='column'
      justifyContent='space-between'
    >
      <Box width='100%'>
        <HStack justifyContent='space-between' pt={4} mt={1.5} ml={4} alignItems='center'>
          <Heading size='lg'>Focus setting</Heading>
          <CloseButton onClick={store.callbacks.onClose} color='gray.400' size='sm'/>
        </HStack>
        <Text pt={5} ml={4} size='sm' fontWeight='normal' color='gray.400'>Press ⇧C to clear</Text>
        <Box p={2} borderRadius='md' bg={store.goalsSelection.isFocused ? 'gray.50' : 'white'} ml={2}>
          <HStack pb={2} alignItems='baseline'>
            <Text fontSize='lg' fontWeight='semibold'>Goals</Text>
            <Text fontSize='sm' fontWeight='normal' color='gray.400'>Shift + G</Text>
          </HStack>
          <GoalsSelectionStoreProvider
            multiple
            instance={store.goalsSelection}
            goals={store.goals}
            checked={store.data.goals}
            callbacks={{
              onSelect: store.handleSelectGoal,
              onGoalCreateClick: store.callbacks.onGoalCreateClick,
            }}
          >
            <GoalsSelectionView/>
          </GoalsSelectionStoreProvider>
        </Box>
        <FormControl display='flex' alignItems='center' ml={4} mt={7}>
          <Switch id='important-tasks' isChecked={store.data.showImportant}
                  onChange={store.handleShowImportantChange}/>
          <FormLabel htmlFor='important-tasks' mb='0' ml={4} cursor='pointer' display='flex' alignItems='baseline'>
            <Text fontSize='lg' fontWeight='semibold'>Important</Text>
            <Text fontSize='sm' fontWeight='normal' color='gray.400' ml={2}>I</Text>
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
          <Text fontSize='md' fontWeight='normal'>Total: {props.getItemsCount()} tasks</Text>
        </Box>
      </Fade>
    </Box>
  );
});
