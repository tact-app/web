import { observer } from "mobx-react-lite";
import React from "react";
import { useHotkeysHandler } from "../../../../../helpers/useHotkeysHandler";
import { Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, ModalOverlay } from "@chakra-ui/modal";
import { CheckboxGroup } from "../../../../shared/CheckboxGroup";
import { Textarea } from "../../../../shared/Textarea";
import { Button } from "@chakra-ui/react";
import { ButtonHotkey } from "../../../../shared/ButtonHotkey";
import { useGoalWontDoSubmitModalStore } from "./store";
import { OTHER_REASON_MAX_LENGTH, WONT_DO_OTHER_REASON } from "./constants";
import { useGlobalHook } from '../../../../../helpers/GlobalHooksHelper';

export const GoalWontDoSubmitModalView = observer(function GoalWontDoSubmitModalView() {
  const store = useGoalWontDoSubmitModalStore();

  useHotkeysHandler(store.keymap, store.hotkeysHandlers);
  useGlobalHook(store.globalHooks);

  return (
    <Modal
      isCentered
      initialFocusRef={{ current: store.navigation.refs[0] }}
      isOpen
      onEsc={store.callbacks?.onClose}
      closeOnEsc={false}
      onClose={store.callbacks?.onClose}
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Why you won&lsquo;t do this goal?</ModalHeader>
        <ModalBody pt={4} pb={6}>
          <CheckboxGroup
            title='Choose reason'
            items={store.reasons}
            value={store.reason}
            onChange={store.handleChangeReason}
            error={store.validator.getFieldFirstError('reason')}
            customListNavigation={store.navigation}
          />
          {store.reason === WONT_DO_OTHER_REASON && (
            <Textarea
              ref={store.setTextareaRef}
              onChange={store.handleOtherReasonChange}
              onKeyDown={(e) => e.stopPropagation()}
              onNavigate={store.handleTextareaNavigate}
              value={store.otherReason}
              maxLength={OTHER_REASON_MAX_LENGTH}
              placeholder='Write your reason'
              error={store.validator.getFieldFirstError('otherReason')}
            />
          )}
        </ModalBody>

        <ModalFooter display='flex' justifyContent='flex-end' pt={0}>
          <Button mr={3} variant='ghost' size='sm' onClick={store.callbacks?.onClose}>
            Cancel
            <ButtonHotkey hotkey='Esc' />
          </Button>
          <Button colorScheme='blue' size='sm' onClick={store.handleSubmit}>
            Save
            <ButtonHotkey hotkey='⌘+Enter' />
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
});
