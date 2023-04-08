import React, { useState } from 'react';
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
import { faBoxArchive, faComment, faSquareInfo, faXmark, } from "@fortawesome/pro-light-svg-icons";
import { BackArrowIcon } from '../../../../../shared/Icons/BackArrowIcon';
import { NextPrevItemController } from "../../../../../shared/NextPrevItemController/NextPrevItemController";
import { GoalCreationStatusSelect } from "./GoalCreationStatusSelect";
import { GoalCreationToolbarButton } from "./GoalCreationToolbarButton";
import { GoalCreationToolbarPopover } from "./GoalCreationToolbarPopover";

export const GoalCreationToolbar = observer(function GoalCreationToolbar() {
  const store = useGoalCreationModalStore();

  const [isCommentPopoverOpen, setIsCommentPopoverOpen] = useState(false);
  const [isInfoPopoverOpen, setIsInfoPopoverOpen] = useState(false);

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
      <GoalCreationToolbarButton
        disableTooltip
        iconFontSize={22}
        tooltipLabel='Close'
        icon={faXmark}
        onClick={store.handleBack}
      />
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
      <GoalCreationToolbarPopover
        isOpen={isCommentPopoverOpen}
        onClose={() => setIsCommentPopoverOpen(false)}
        onOpen={() => setIsCommentPopoverOpen(true)}
        trigger={
          <GoalCreationToolbarButton
            tooltipHotkey='⌥C'
            tooltipLabel='Comment'
            icon={faComment}
            withMargin
          />
        }
        content={
          <>TEST</>
        }
      />
      <GoalCreationToolbarPopover
        isOpen={isInfoPopoverOpen}
        onClose={() => setIsInfoPopoverOpen(false)}
        onOpen={() => setIsInfoPopoverOpen(true)}
        trigger={
          <GoalCreationToolbarButton
            tooltipHotkey='⌥I'
            tooltipLabel='Info'
            icon={faSquareInfo}
            withMargin
          />
        }
        content={
          <>TEST</>
        }
      />
      <GoalCreationToolbarButton
        tooltipHotkey='⌥A'
        tooltipLabel={store.goal.isArchived ? 'Unarchive' : 'Archive'}
        icon={faBoxArchive}
        withMargin
        onClick={() => store.handleUpdate({ isArchived: !store.goal.isArchived })}
      />
    </Flex>
  ];

  return (
    <HStack justifyContent='space-between' width='100%' maxW='3xl' pt={4} pb={8} pl={10} pr={10}>
      {store.isUpdating ? renderContentForUpdate() : renderContentForCreate()}
    </HStack>
  );
});
