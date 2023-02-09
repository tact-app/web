import React, { FC } from 'react';
import { Button } from '@chakra-ui/react';
import {
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
} from '@chakra-ui/modal';

interface DeleteSpaceModalProps {
    isOpen: boolean;
    onClose: () => void;
    onDelete: () => void;
}

export const DeleteSpaceModal: FC<DeleteSpaceModalProps> = ({
    isOpen,
    onClose,
    onDelete
}) => (
    <Modal
        isOpen={isOpen}
        onClose={onClose}
        isCentered
    >
        <ModalOverlay />
        <ModalContent>
            <ModalHeader>Confirm deletion</ModalHeader>
            <ModalBody>Are you sure?</ModalBody>
            <ModalFooter>
                <Button
                    colorScheme='gray'
                    variant='ghost'
                    mr={3}
                    onClick={onClose}
                >
                    Cancel
                </Button>
                <Button colorScheme='red' onClick={onDelete}>
                    Delete
                </Button>
            </ModalFooter>
        </ModalContent>
    </Modal>
)
