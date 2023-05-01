import React from 'react';
import { observer } from 'mobx-react-lite';
import {
  Button,
  chakra,
  Flex,
  HStack,
  Text
} from '@chakra-ui/react';
import { useGoalCreationModalStore } from '../store';
import { ButtonHotkey } from "../../../../../shared/ButtonHotkey";
import { faBoxArchive } from "@fortawesome/pro-light-svg-icons";
import { BackArrowIcon } from '../../../../../shared/Icons/BackArrowIcon';
import { NextPrevItemController } from "../../../../../shared/NextPrevItemController/NextPrevItemController";
import { GoalCreationStatusSelect } from "./GoalCreationStatusSelect";
import { GoalCreationToolbarButton } from "./GoalCreationToolbarButton";
import { EntityMetadataPopover } from "../../../../../shared/EntityMetadataPopover";
import { DateHelper } from "../../../../../../helpers/DateHelper";
import { CommentPopover } from "../../../../../shared/CommentPopover";
import { CloseButton } from "../../../../../shared/CloseButton";

export const GoalCreationToolbar = observer(function GoalCreationToolbar() {
  const store = useGoalCreationModalStore();

  const renderContentForCreate = () => [
    <Button
      key='back-button'
      variant='ghost'
      size='sm'
      pl={1.5}
      pr={1.5}
      onClick={store.handleSimpleClose}
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
      <CloseButton onClick={store.handleSimpleClose} />
      <chakra.div w={0.5} h={4} bg='gray.200' borderRadius={4} mr={1} ml={1} />
      <NextPrevItemController
        hasPreviousItem={store.currentGoalIndex > 0}
        hasNextItem={store.currentGoalIndex < store.goals.length - 1}
        onNextItem={store.handleNextGoal}
        onPrevItem={store.handlePrevGoal}
        color='gray.500'
        iconFontSize={20}
        iconStyle='light'
      />
    </Flex>,
    <Flex key='right-content'>
      <GoalCreationStatusSelect />
      <CommentPopover triggerProps={{ ml: 0.5 }} />
      <EntityMetadataPopover
        triggerProps={{ ml: 0.5 }}
        created={{
          date: DateHelper.getFormattedDate(store.goal.createdDate),
          user: store.root.user.data
        }}
        updated={{
          date: DateHelper.getFormattedDate(store.goal.updatedDate),
          user: store.root.user.data
        }}
      />
      <GoalCreationToolbarButton
        tooltipHotkey='⌥A'
        tooltipLabel={store.goal.isArchived ? 'Unarchive' : 'Archive'}
        icon={faBoxArchive}
        withMargin
        onClick={store.handleArchiveGoal}
      />
    </Flex>
  ];

  return (
    <HStack justifyContent='space-between' width='100%' maxW='3xl' pt={4} pb={8} pl={10} pr={10}>
      {store.isUpdating ? renderContentForUpdate() : renderContentForCreate()}
    </HStack>
  );
});
