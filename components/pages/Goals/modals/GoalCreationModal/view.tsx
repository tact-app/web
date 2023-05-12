import React from 'react';
import { observer } from 'mobx-react-lite';
import { HStack, Box } from '@chakra-ui/react';
import { useGoalCreationModalStore } from './store';
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
import { ModalsSwitcher } from "../../../../../helpers/ModalsController";
import { GoalCreationToolbar } from "./components/GoalCreationToolbar";
import { useGlobalHook } from '../../../../../helpers/GlobalHooksHelper';

export const GoalCreationModalView = observer(function GoalCreationModal() {
  const store = useGoalCreationModalStore();

  useHotkeysHandler(store.keyMap, store.hotkeyHandlers);
  useGlobalHook(store.globalHooks, { updateWhenRemoved: true });

  return (
    <Modal
      isOpen={store.isOpen}
      onClose={store.handleClose}
      onCloseComplete={store.handleCloseComplete}
      closeOnEsc={false}
      onEsc={store.handleCloseModal}
      blockScrollOnMount={false}
      size='full'
      isCentered
    >
      <ModalContent>
        <ResizableGroup disabled>
          <ResizableGroupChild
            index={0}
            config={store.resizableConfig[0]}
            borderRight='1px'
            borderColor='gray.200'
          >
            <HStack flexDirection='column' width='100%' height='100%'>
              <GoalCreationToolbar />
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

      <ModalsSwitcher controller={store.modals} />
    </Modal>
  );
});
