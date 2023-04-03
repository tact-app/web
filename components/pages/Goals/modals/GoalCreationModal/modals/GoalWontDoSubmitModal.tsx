import React, { useRef, useState, ChangeEvent } from 'react';
import { observer } from 'mobx-react-lite';
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from '@chakra-ui/modal';
import { Button, Textarea } from "@chakra-ui/react";
import { CheckboxGroup } from '../../../../../shared/CheckboxGroup'
import { ButtonHotkey } from "../../../../../shared/ButtonHotkey";
import { useHotkeysHandler } from "../../../../../../helpers/useHotkeysHandler";
import { ListNavigation } from "../../../../../../helpers/ListNavigation";

type GoalCreationCloseSubmitModalProps = {
  onClose(): void;
  onSubmit(): void;
};

const WONT_DO_SUBMIT_OTHER_REASON = 'Other';
const WONT_DO_SUBMIT_REASONS = [
  'Deadline passed',
  'Irrelevant task',
  'Complex task',
  'Not now',
  WONT_DO_SUBMIT_OTHER_REASON,
];

const GOAL_WONT_DO_SUBMIT_MODAL_NAVIGATION = new ListNavigation();

export const GoalWontDoSubmitModal = observer(
  function GoalWontDoSubmitModal({ onClose, onSubmit }: GoalCreationCloseSubmitModalProps) {
    const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
    const [reason, setReason] = useState<string>('');
    const [otherReason, setOtherReason] = useState<string>('');

    const initialRef = useRef(null);

    const handleSubmit = () => {
      setIsSubmitted(true);

      if (reason && (reason !== WONT_DO_SUBMIT_OTHER_REASON || otherReason)) {
        onSubmit();
      }
    };
    const handleOtherReasonChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
      e.stopPropagation();
      setOtherReason(e.target.value)
    };
    const setTextareaRef = (ref: HTMLTextAreaElement) => {
      GOAL_WONT_DO_SUBMIT_MODAL_NAVIGATION.setRefs(WONT_DO_SUBMIT_REASONS.length, ref)
    };

    useHotkeysHandler({ SAVE: ['meta+enter'] }, { SAVE: handleSubmit });

    return (
      <Modal
        isCentered
        initialFocusRef={initialRef}
        isOpen
        onEsc={onClose}
        closeOnEsc={false}
        onClose={onClose}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Why you won&lsquo;t do this goal?</ModalHeader>
          <ModalBody pt={4} pb={6}>
            <CheckboxGroup
              items={WONT_DO_SUBMIT_REASONS.map((item) => ({ value: item, label: item }))}
              value={reason}
              onChange={setReason}
              required
              isSubmitted={isSubmitted}
              customListNavigation={GOAL_WONT_DO_SUBMIT_MODAL_NAVIGATION}
            />
            {reason === WONT_DO_SUBMIT_OTHER_REASON && (
              <Textarea
                ref={setTextareaRef}
                maxLength={200}
                size='lg'
                resize='none'
                value={otherReason}
                placeholder='Write your reason'
                onChange={handleOtherReasonChange}
                borderColor='gray.200'
                _placeholder={{
                  color: 'gray.400'
                }}
              />
            )}
          </ModalBody>

          <ModalFooter display='flex' justifyContent='flex-end' pt={0}>
            <Button mr={3} variant='ghost' size='sm' onClick={onClose}>
              Cancel
              <ButtonHotkey hotkey='Esc' />
            </Button>
            <Button colorScheme='blue' size='sm' onClick={handleSubmit} ref={initialRef}>
              Save
              <ButtonHotkey hotkey='⌘+Enter' />
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    );
  }
);
