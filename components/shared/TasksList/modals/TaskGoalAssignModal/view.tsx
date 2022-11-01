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
import { useTaskGoalAssignModalStore } from './store';
import { GoalsSelectionStoreProvider } from '../../components/GoalsSelection/store';
import { GoalsSelectionView } from '../../components/GoalsSelection/view';
import { useHotkeysHandler } from '../../../../../helpers/useHotkeysHandler';

export const TaskGoalAssignModalView = observer(
  function TaskGoalAssignModalView() {
    const store = useTaskGoalAssignModalStore();

    const ref = useHotkeysHandler(store.keyMap, store.hotkeyHandlers);

    return (
      <Modal isCentered isOpen={true} onClose={store.callbacks.onClose}>
        <ModalOverlay />
        <ModalContent ref={(el) => (ref.current = el)}>
          <ModalHeader>My goals</ModalHeader>
          <ModalBody maxH={80} overflow='scroll' pl={5} pr={5}>
            <GoalsSelectionStoreProvider
              goals={store.goals}
              checked={store.selectedGoalId ? [store.selectedGoalId] : []}
              callbacks={{
                onSelect: store.handleSelect,
                onGoalCreateClick: store.callbacks.onGoalCreateClick,
              }}
              instance={store.goalsSelection}
            >
              <GoalsSelectionView />
            </GoalsSelectionStoreProvider>
          </ModalBody>
          <ModalFooter>
            <Button mr={3} onClick={store.callbacks.onClose}>
              Close
            </Button>
            <Button
              colorScheme='blue'
              disabled={!store.selectedGoalId}
              onClick={store.handleSubmit}
            >
              Save
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    );
  }
);
