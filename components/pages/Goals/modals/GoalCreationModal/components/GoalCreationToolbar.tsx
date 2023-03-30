import React from 'react';
import { observer } from 'mobx-react-lite';
import { Button, Text, HStack, Flex, chakra } from '@chakra-ui/react';
import { useGoalCreationModalStore } from '../store';
import { ButtonHotkey } from "../../../../../shared/ButtonHotkey";
import { faXmark, faComment, faSquareInfo, faBoxArchive } from "@fortawesome/pro-light-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { BackArrowIcon } from '../../../../../shared/Icons/BackArrowIcon';
import { NextPrevItemController } from "../../../../../shared/NextPrevItemController/NextPrevItemController";

export const GoalCreationToolbar = observer(function GoalCreationToolbar() {
  const store = useGoalCreationModalStore();

  const renderContentForCreate = () => [
    <Button
      key='back-button'
      variant='ghost'
      size='sm'
      pl={1.5}
      pr={1.5}
      onClick={store.handleBack}
    >
      <BackArrowIcon />
      <Text fontSize='lg' lineHeight={3} color='gray.500' fontWeight='normal' ml={2}>
        Back
      </Text>
    </Button>,
    <Button
      key='save-button'
      colorScheme='blue'
      size='sm'
      onClick={store.handleSave}
      disabled={store.isGoalCreatingOrUpdating}
    >
      Save
      <ButtonHotkey hotkey='⌘+Enter' />
    </Button>
  ];

  const renderContentForUpdate = () => [
    <Flex key='left-content' alignItems='center'>
      <Button
        aria-label='Close'
        variant='ghost'
        size='xs'
        color='gray.500'
        onClick={store.handleBack}
        pl={0.5}
        pr={0.5}
      >
        <FontAwesomeIcon
          fontSize={22}
          icon={faXmark}
          fixedWidth
        />
      </Button>
      <chakra.div w={0.5} h={4} bg='gray.200' borderRadius={4} mr={1} ml={1} />
      <NextPrevItemController
        hasPreviousItem={true}
        hasNextItem={true}
        onNextItem={() => null}
        onPrevItem={() => null}
        color='gray.500'
        iconFontSize={20}
        iconStyle='light'
      />
    </Flex>,
    <Flex key='right-content'>
      <Button
        aria-label='Comment'
        variant='ghost'
        size='xs'
        color='gray.500'
        onClick={store.handleBack}
        pl={0.5}
        pr={0.5}
      >
        <FontAwesomeIcon
          fontSize={20}
          icon={faComment}
          fixedWidth
        />
      </Button>
      <Button
        aria-label='Comment'
        variant='ghost'
        size='xs'
        color='gray.500'
        onClick={store.handleBack}
        ml={0.5}
        pl={0.5}
        pr={0.5}
      >
        <FontAwesomeIcon
          fontSize={20}
          icon={faSquareInfo}
          fixedWidth
        />
      </Button>
      <Button
        aria-label='Comment'
        variant='ghost'
        size='xs'
        color='gray.500'
        onClick={store.handleBack}
        ml={0.5}
        pl={0.5}
        pr={0.5}
      >
        <FontAwesomeIcon
          fontSize={20}
          icon={faBoxArchive}
          fixedWidth
        />
      </Button>
    </Flex>
  ];

  return (
    <HStack justifyContent='space-between' width='100%' maxW='3xl' pt={4} pb={8} pl={10} pr={10}>
      {store.isUpdating ? renderContentForUpdate() : renderContentForCreate()}
    </HStack>
  );
});