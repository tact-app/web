import { observer } from 'mobx-react-lite';
import { FocusConfigurationProps, useFocusConfigurationStore } from './store';
import { Box, CloseButton, FormControl, FormLabel, Heading, HStack, Switch, Text } from '@chakra-ui/react';
import { GlobalHotKeys } from 'react-hotkeys';
import { GoalsSelectionStoreProvider } from '../GoalsSelection/store';
import { GoalsSelectionView } from '../GoalsSelection/view';

export const FocusConfigurationView = observer(function FocusConfigurationView(props: FocusConfigurationProps) {
  const store = useFocusConfigurationStore();

  return (
    <GlobalHotKeys
      keyMap={store.keyMap}
      handlers={store.hotkeyHandlers}
    >
      <Box p={4} w='500px' borderRight='1px' borderColor='gray.100'>
        <HStack justifyContent='space-between' pt={4} mt={1.5} ml={4} alignItems='center'>
          <Heading size='lg'>Focus setting</Heading>
          <CloseButton onClick={store.callbacks.onClose} color='gray.400' size='sm'/>
        </HStack>
        <Text pt={5} ml={4} size='sm' fontWeight='normal' color='gray.400'>Press ⇧C to clear</Text>
        <Box p={2} borderRadius='md' bg={store.goalsSelection.isFocused ? 'gray.50' : 'white'} ml={2}>
          <HStack pb={2}>
            <Heading size='md' fontWeight='semibold'>Goals</Heading>
            <Text size='sm' fontWeight='normal' color='gray.400'>G</Text>
          </HStack>
          <GoalsSelectionStoreProvider
            multiple
            instance={store.goalsSelection}
            goals={store.goals}
            checked={store.checkedGoals}
            callbacks={{
              onSelect: store.handleSelect,
            }}
          >
            <GoalsSelectionView/>
          </GoalsSelectionStoreProvider>
        </Box>
        <FormControl display='flex' alignItems='center' ml={4} mt={7}>
          <Switch id='important-tasks' isChecked={store.showImportant}/>
          <FormLabel htmlFor='important-tasks' mb='0' ml={4} cursor='pointer' display='flex'>
            <Text size='lg' fontWeight='semibold'>Important</Text>
            <Text size='sm' fontWeight='normal' color='gray.400' ml={2}>I</Text>
          </FormLabel>
        </FormControl>
      </Box>
    </GlobalHotKeys>
  );
});
