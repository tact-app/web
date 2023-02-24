import React from 'react';
import { observer } from 'mobx-react-lite';
import { Button, Text, HStack } from '@chakra-ui/react';
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
            <HStack flexDirection='column' width='100%'>
              <HStack justifyContent='space-between' width='100%' maxW='3xl' pt={4} pb={8}>
                <Button
                  variant='ghost'
                  size='xs'
                  onClick={store.handleBack}
                  p={0}
                  pl={2}
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
            Text
          </ResizableGroupChild>
        </ResizableGroup>
      </ModalContent>
    </Modal>
  );
});
