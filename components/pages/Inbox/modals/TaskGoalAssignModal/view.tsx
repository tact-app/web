import { observer } from 'mobx-react-lite';
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from '@chakra-ui/modal';
import { Button } from '@chakra-ui/react';
import { HotKeys } from 'react-hotkeys';
import { TaskGoalAssignModalProps, useTaskGoalAssignModalStore } from './store';
import { GoalsSelectionStoreProvider } from '../../components/GoalsSelection/store';
import { GoalsSelectionView } from '../../components/GoalsSelection/view';

export const TaskGoalAssignModalView = observer(function TaskGoalAssignModalView(props: TaskGoalAssignModalProps) {
  const store = useTaskGoalAssignModalStore();

  return (
    <Modal
      isCentered
      isOpen={true}
      onClose={store.onClose}
    >
      <ModalOverlay/>
      <HotKeys
        keyMap={store.keyMap}
        handlers={store.hotkeyHandlers}
      >
        <ModalContent>
          <ModalHeader>My goals</ModalHeader>
          <ModalBody maxH={80} overflow='scroll'>
            <GoalsSelectionStoreProvider
              goals={store.goals}
              checked={[store.selectedGoalId]}
              callbacks={{ onSelect: store.handleSelect }}
              instance={store.goalsSelection}
            >
              <GoalsSelectionView/>
            </GoalsSelectionStoreProvider>
          </ModalBody>
          <ModalFooter>
            <Button mr={3} onClick={store.onClose}>
              Close
            </Button>
            <Button colorScheme='blue' disabled={!store.selectedGoalId} onClick={store.handleSubmit}>Save</Button>
          </ModalFooter>
        </ModalContent>
      </HotKeys>
    </Modal>
  );
});
