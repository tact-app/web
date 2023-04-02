import React from 'react';
import { observer } from 'mobx-react-lite';
import { Button, chakra, Flex, HStack, Text } from '@chakra-ui/react';
import { useGoalCreationModalStore } from '../store';
import { ButtonHotkey } from "../../../../../shared/ButtonHotkey";
import {
  faBoxArchive,
  faComment,
  faSquareInfo,
  faXmark,
} from "@fortawesome/pro-light-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { BackArrowIcon } from '../../../../../shared/Icons/BackArrowIcon';
import { NextPrevItemController } from "../../../../../shared/NextPrevItemController/NextPrevItemController";
import { ActionMenu } from "../../../../../shared/ActionMenu";
import { GoalStatus } from "../../../types";
import { IconDefinition } from "@fortawesome/pro-solid-svg-icons";
import { GOALS_STATUSES_TITLES, GOALS_STATUSES_ICONS } from "../constants";
import { Tooltip } from "../../../../../shared/Tooltip";

export const GoalCreationToolbar = observer(function GoalCreationToolbar() {
  const store = useGoalCreationModalStore();

  const renderActionTitle = (status: GoalStatus) => {
    return (
      <chakra.span color={store.goal.status === status ? 'blue.400' : 'initial'}>
        {GOALS_STATUSES_TITLES[status]}
      </chakra.span>
    )
  };

  const actions = [
    {
      icon: GOALS_STATUSES_ICONS[GoalStatus.TODO],
      title: renderActionTitle(GoalStatus.TODO),
      key: GoalStatus.TODO,
      onClick: () => null,
      command: '⌥T',
      iconColor: 'gray.500',
    },
    {
      icon: GOALS_STATUSES_ICONS[GoalStatus.DONE],
      title: renderActionTitle(GoalStatus.DONE),
      key: GoalStatus.DONE,
      onClick: () => null,
      command: '⌥D',
      iconColor: 'blue.400',
    },
    {
      icon: GOALS_STATUSES_ICONS[GoalStatus.WONT_DO],
      title: renderActionTitle(GoalStatus.WONT_DO),
      key: GoalStatus.WONT_DO,
      onClick: () => null,
      command: '⌥W',
      iconColor: 'gray.500',
    },
  ];

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

  const renderButton = ({
    onClick,
    icon,
    ariaLabel,
    withMargin,
    iconFontSize = 20,
  }: {
    onClick?(): void,
    icon: IconDefinition;
    ariaLabel: string;
    withMargin?: boolean ;
    iconFontSize?: number;
  }) => (
    <Button
      variant='ghost'
      size='xs'
      color='gray.500'
      pl={0.5}
      pr={0.5}
      h={7}
      ml={withMargin ? 0.5 : 0}
      aria-label={ariaLabel}
      onClick={onClick}
    >
      <FontAwesomeIcon
        fontSize={iconFontSize}
        icon={icon}
        fixedWidth
      />
    </Button>
  );

  const renderContentForUpdate = () => [
    <Flex key='left-content' alignItems='center'>
      {renderButton({
        onClick: store.handleBack,
        icon: faXmark,
        ariaLabel: 'Close',
        iconFontSize: 22,
      })}
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
      <ActionMenu
        items={actions}
        menuMinWidth={44}
        customTrigger={(isOpen) => (
          <div>
            <Tooltip label='Change status' hotkey='S' isDisabled={isOpen}>
              <Button
                variant='ghost'
                size='xs'
                color='gray.500'
                pl={1}
                pr={2}
                h={7}
                bg={isOpen ? 'gray.75' : 'initial'}
              >
                <FontAwesomeIcon
                  fontSize={14}
                  icon={GOALS_STATUSES_ICONS[store.goal.status]}
                  fixedWidth
                />
                <chakra.span
                  fontSize='sm'
                  fontWeight='normal'
                  ml={1}
                >
                  {GOALS_STATUSES_TITLES[store.goal.status]}
                </chakra.span>
              </Button>
            </Tooltip>
          </div>
        )}
      />
      {renderButton({
        icon: faComment,
        ariaLabel: 'Comment',
        withMargin: true,
      })}
      {renderButton({
        icon: faSquareInfo,
        ariaLabel: 'Info',
        withMargin: true,
      })}
      {renderButton({
        icon: faBoxArchive,
        ariaLabel: 'Archive',
        withMargin: true,
      })}
    </Flex>
  ];

  return (
    <HStack justifyContent='space-between' width='100%' maxW='3xl' pt={4} pb={8} pl={10} pr={10}>
      {store.isUpdating ? renderContentForUpdate() : renderContentForCreate()}
    </HStack>
  );
});
