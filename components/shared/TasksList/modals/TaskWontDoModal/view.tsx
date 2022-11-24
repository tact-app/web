import { observer } from 'mobx-react-lite';
import React from 'react';
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from '@chakra-ui/modal';
import {
  Box,
  Button,
  Checkbox,
  Textarea,
  chakra,
  Text,
  Collapse,
} from '@chakra-ui/react';
import {
  TaskWontDoModalProps,
  useTaskWontDoModalStore,
  WontDoReasons,
} from './store';

export const TaskWontDoModalView = observer(function TaskWontDoModalView({
  onClose,
}: TaskWontDoModalProps) {
  const store = useTaskWontDoModalStore();

  return (
    <Modal isCentered isOpen={true} onClose={onClose}>
      <ModalOverlay />
      <ModalContent
        onKeyDown={store.navigation.handleKeyDown}
        onFocus={store.navigation.handleFocus}
      >
        <ModalHeader>Why you won&apos;t do this task?</ModalHeader>
        <ModalBody pb={6} pl={5} pr={5}>
          <Box pr={1} pl={1}>
            <Text mb={4}>Chose reason</Text>
            {WontDoReasons.map((reason, index) => (
              <Box key={reason} mb={2}>
                <Checkbox
                  size='lg'
                  ref={(el) => store.navigation.setRefs(index, el)}
                  onChange={store.handleCheckboxChange}
                  isChecked={store.predefinedReasonIndex === index}
                  value={index}
                >
                  <chakra.span fontSize='sm' fontWeight='normal'>
                    {reason}
                  </chakra.span>
                </Checkbox>
              </Box>
            ))}
          </Box>
          <Collapse in={store.isOtherReasonSelected} unmountOnExit>
            <Box p={1}>
              <Textarea
                ref={(el) => {
                  store.navigation.setRefs(WontDoReasons.length, el);
                  store.setTextareaRef(el);
                }}
                onKeyDown={store.handleTextareaKeyDown}
                onChange={store.handleOtherReasonChange}
                value={store.otherReason}
                maxH={80}
                _focus={{
                  outline: 'none',
                }}
                placeholder='Write your reason'
              />
            </Box>
          </Collapse>
        </ModalBody>

        <ModalFooter display='flex' justifyContent='flex-end'>
          <Button mr={3} onClick={onClose} display='flex' flexDirection='row'>
            Cancel
            <Text ml={1} fontSize='xs' color='blackAlpha.500'>
              Esc
            </Text>
          </Button>
          <Button
            colorScheme='blue'
            onClick={store.handleSave}
            disabled={!store.isFilled}
            display='flex'
            flexDirection='row'
          >
            Save
            <Text ml={1} fontSize='xs' color='whiteAlpha.700'>
              ⌘ + Enter
            </Text>
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
});
