import React from 'react';
import { observer } from 'mobx-react-lite';
import { Button, Text, HStack, Box } from '@chakra-ui/react';
import { useGoalCreationModalStore } from './store';
import { BackArrowIcon } from '../../../../shared/Icons/BackArrowIcon';
import {
  Modal,
  ModalContent,
} from '@chakra-ui/modal';
import { useHotkeysHandler } from '../../../../../helpers/useHotkeysHandler';
import { GoalCreationDescription } from "./components/GoalCreationDescription";
import { ResizableGroup } from "../../../../shared/ResizableGroup";
import { ResizableGroupChild } from "../../../../shared/ResizableGroup/ResizableGroupChild";
import { GoalCreationInformation } from "./components/GoalCreationInformation";
import { Task } from "../../../../shared/Task";

export const GoalCreationModalView = observer(function GoalCreationModal() {
  const store = useGoalCreationModalStore();

  useHotkeysHandler(store.keyMap, store.hotkeyHandlers);

  return (
    <Modal
      isOpen={store.isOpen}
      onClose={store.handleClose}
      onCloseComplete={store.handleCloseComplete}
      closeOnEsc={false}
      onEsc={store.handleBack}
      blockScrollOnMount={false}
      size='full'
    >
      <ModalContent>
        <ResizableGroup>
          <ResizableGroupChild
            index={0}
            config={store.resizableConfig[0]}
            borderRight='1px'
            borderColor='gray.200'
          >
            <HStack flexDirection='column' width='100%' height='100%'>
              <HStack justifyContent='space-between' width='100%' maxW='3xl' pt={4} pb={8} pl={10} pr={10}>
                <Button
                  variant='ghost'
                  size='xs'
                  onClick={store.handleBack}
                  p={0}
                  _hover={{
                    bg: 'none'
                  }}
                  _active={{
                    bg: 'none'
                  }}
                >
                  <BackArrowIcon />
                  <Text fontSize='lg' lineHeight={3} color='gray.500' fontWeight='normal' ml={2}>
                    Back
                  </Text>
                </Button>
                <Button
                  colorScheme='blue'
                  size='sm'
                  isDisabled={!store.isReadyForSave}
                  onClick={store.handleSave}
                >
                  Save ⌘+Enter
                </Button>
              </HStack>
              <GoalCreationDescription />
            </HStack>
          </ResizableGroupChild>
          <ResizableGroupChild index={1} config={store.resizableConfig[1]}>
            <GoalCreationInformation />
          </ResizableGroupChild>
          <ResizableGroupChild
            index={2}
            config={store.resizableConfig[2]}
            borderLeft='1px'
            borderColor='gray.200'
          >
            <Box h='100%'>{store.taskProps.task && <Task {...store.taskProps} />}</Box>
          </ResizableGroupChild>
        </ResizableGroup>
      </ModalContent>
    </Modal>
  );
});
