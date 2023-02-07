import React from 'react'
import { observer } from 'mobx-react-lite';
import {
    Modal,
    ModalOverlay,
    ModalBody,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalCloseButton,
} from '@chakra-ui/react';
import { ConnectionApps } from './components/ConnectionApps';
import { useSpaceConnectAppsModalStore } from './store';
import { STUBS_APPS } from './stubs';


export const ConnectAppsModal = observer(function ConnectAppsModal() {
    const store = useSpaceConnectAppsModalStore();

    return (
        <Modal
            isCentered
            size='2xl'
            isOpen={store.isOpen}
            onClose={store.handleClose}
            onCloseComplete={store.handleCloseComplete}
        >
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>
                    Connect apps
                </ModalHeader>
                <ModalCloseButton color='gray.400' />
                <ModalBody>
                    <ConnectionApps apps={STUBS_APPS} onConnect={store.handleConnect} />
                </ModalBody>
                <ModalFooter></ModalFooter>
            </ModalContent>
        </Modal>
    );
});
