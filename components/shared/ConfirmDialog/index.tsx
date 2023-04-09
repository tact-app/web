import React, { useRef } from 'react';
import { Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, ModalOverlay } from "@chakra-ui/modal";
import { Button, Flex, Text } from "@chakra-ui/react";
import { ButtonHotkey } from "../ButtonHotkey";

export type ConfirmDialogProps = {
  onClose(): void;
  onSubmit(): void;
  title: string;
  content: React.ReactNode;
  type: 'delete';
};

export function ConfirmDialog({ onClose, onSubmit, content, title, type }: ConfirmDialogProps) {
  const initialRef = useRef();

  const getTitleByType = () => {
    switch (type) {
      case 'delete':
        return 'Delete';
      default:
        return 'Confirm';
    }
  };
  const getSubmitButtonPropsByType = () => {
    switch (type) {
      case 'delete':
        return {
          colorScheme: 'red',
          background: 'red.400',
          _hover: {
            background: 'red.500',
          }
        };
      default:
        return {
          colorScheme: 'blue',
        };
    }
  };

  return (
    <Modal
      isCentered
      initialFocusRef={initialRef}
      isOpen
      closeOnEsc={false}
      onEsc={onClose}
      onClose={onClose}
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader pb={2} fontSize='lg' fontWeight='bold'>{title}</ModalHeader>
        <ModalBody pt={4} pb={6}>{content}</ModalBody>

        <ModalFooter display='flex' justifyContent='flex-end' pt={0}>
          <Flex justifyContent='space-between' w='100%'>
            <Flex alignItems='center'>
              {type === 'delete' && (
                <>
                  <Text color='gray.400' fontSize='sm' mr={1}>Quick Delete</Text>
                  <ButtonHotkey
                    hotkey='⌘⌫'
                    pl={1}
                    pr={1}
                    backgroundColor='gray.100'
                    borderRadius={4}
                    color='gray.400'
                  />
                </>
              )}
            </Flex>
            <Flex alignItems='center'>
              <Button mr={3} variant='ghost' size='sm' onClick={onClose} color='gray.500' fontWeight='medium'>
                Cancel
                <ButtonHotkey hotkey='Esc' />
              </Button>
              <Button {...getSubmitButtonPropsByType()} size='sm' onClick={onSubmit} ref={initialRef}>
                {getTitleByType()}
                <ButtonHotkey hotkey='⌘+Enter' />
              </Button>
            </Flex>
          </Flex>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
