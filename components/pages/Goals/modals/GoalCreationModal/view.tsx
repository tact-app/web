import React from 'react';
import { observer } from 'mobx-react-lite';
import {
  Button,
  Text,
  Box, Center, Heading
} from '@chakra-ui/react';
import { useGoalCreationModalStore } from './store';
import { BackArrowIcon } from '../../../../shared/Icons/BackArrowIcon';
import { GoalCreationStepsSwitcher } from './components/GoalCreationStepsSwitcher';
import { GoalCreationModalSteps } from './types';
import { GlobalHotKeys } from 'react-hotkeys';
import { GoalCreationEmojiSelect } from './components/GoalCreationEmojiSelect';

const keyMap = {
  CREATE: ['cmd+enter', 'cmd+s'],
  CANCEL: ['esc'],
};

export const GoalCreationModalView = observer(function GoalCreationModal() {
  const store = useGoalCreationModalStore();

  return (
    <GlobalHotKeys
      keyMap={keyMap}
      handlers={store.hotkeyHandlers}
    >
      <Box
        position='fixed'
        top={0}
        left={0}
        right={0}
        bottom={0}
        bg='white'
        p={8}
      >
        <Box mb={10}>
          <Box position='relative' display='flex' alignItems='center' flexDirection='row'>
            <Button variant='ghost' size='xs' onClick={store.handleBack} position='absolute'>
              <BackArrowIcon/>
              <Text fontSize='lg' color='gray.400'
                    fontWeight='normal'
              >
                Back
              </Text>
            </Button>
            <Center flex={1} minH={12}>
              {store.step === GoalCreationModalSteps.FILL_DESCRIPTION ? (
                <GoalCreationEmojiSelect/>
              ) : null}
              <Heading variant='h1' fontSize='2rem'>Goal setting</Heading>
            </Center>
            {
              store.step === GoalCreationModalSteps.FILL_DESCRIPTION ? (
                <Box display='flex' alignItems='center' position='absolute' right={0}>
                  <Text fontSize='xs' fontWeight='normal' mr={4} color='gray.400'>Press ⌘ S </Text>
                  <Button
                    colorScheme='blue'
                    size='sm'
                    disabled={!store.isReadyForSave}
                    onClick={store.handleSave}
                  >Save</Button>
                </Box>
              ) : null
            }
          </Box>
        </Box>
        <Box pb={6}>
          <GoalCreationStepsSwitcher/>
        </Box>
      </Box>
    </GlobalHotKeys>
  );
});
