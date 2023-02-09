import React, { FC } from 'react'
import {
    Button,
    HStack,
    Text,
    Modal,
    ModalOverlay,
    ModalBody,
    ModalContent,
    ModalHeader,
    ModalFooter,
    VStack,
} from '@chakra-ui/react';
import { СongratulationsMascot } from './CongratulationsMascot'
import { OriginTypes } from '../../types';
import { OriginIcon } from '../../components/SpacesIcons/OriginsIcons';

export type SpaceСongratulationsProps = {
    onClose: () => void;
    isOpen: boolean;
    onConnect: () => void;
};

export const SpaceСongratulationsModal: FC<SpaceСongratulationsProps> = ({
    onClose,
    isOpen,
    onConnect
}) => {

    return (
        <Modal
            isCentered
            size='2xl'
            isOpen={isOpen}
            onClose={onClose}
        >
            <ModalOverlay />
            <ModalContent>
                <ModalHeader display='flex' justifyContent='center' >
                    Сongratulations
                </ModalHeader>
                <ModalBody pb={6} display='flex' alignItems='center' flexDirection='column'>
                    <СongratulationsMascot />
                    <VStack mt={3}>
                        <Text fontSize='lg' fontWeight='semibold' lineHeight={7} >
                            You have created a new space!
                        </Text>
                        <Text fontSize='md' fontWeight='normal' lineHeight={6} >
                            Do you want to connect services or applications?
                        </Text>
                    </VStack>
                    <HStack justifyContent='center' mt={4} spacing={3} h={4}>
                        {Object.values(OriginTypes).map((icon, index) => (<OriginIcon origin={icon} size='16px' key={`app-icon-${index}`} />))}
                    </HStack>
                    <HStack justifyContent='center' mt={10}>
                        <Button colorScheme='blue' onClick={onConnect}>
                            Connect apps
                        </Button>
                        <Button mr={3} variant='outline' colorScheme='blue' onClick={onClose} >
                            No, thanks
                        </Button>
                    </HStack>
                </ModalBody>
                <ModalFooter></ModalFooter>
            </ModalContent>
        </Modal>
    );
};
