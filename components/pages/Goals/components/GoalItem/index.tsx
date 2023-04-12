import { observer } from 'mobx-react-lite';
import { Box, chakra, Flex, Text, Tooltip } from '@chakra-ui/react';
import { useGoalsStore } from '../../store';
import { DatePicker } from "../../../../shared/DatePicker";
import {
  faAlarmClock,
  faBoxArchive,
  faCalendarCircleExclamation,
  faCalendarClock,
  faCircleCheck,
  faCircleMinus,
  faClone,
  faSquareArrowUpRight,
  faTrashCan,
} from "@fortawesome/pro-light-svg-icons";
import {
  faCircleCheck as faCircleCheckSolid,
  faCircleMinus as faCircleMinusSolid
} from "@fortawesome/pro-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { GoalDataExtended, GoalState, GoalStatus } from "../../types";
import { ActionMenu } from "../../../../shared/ActionMenu";
import { EditableTitle } from "../../../../shared/EditableTitle";
import { DatePickerHelpers } from "../../../../shared/DatePicker/helpers";
import { GoalEmojiSelect } from "../GoalEmojiSelect/GoalEmojiSelect";

type Props = {
  goal: GoalDataExtended
};

const GOAL_STATE_PARAMS = {
  [GoalState.IS_COMING]: {
    color: 'green.400',
    icon: faAlarmClock,
    tooltipTitle: 'Is coming soon',
  },
  [GoalState.TIME_TO_ACHIEVE]: {
    color: 'orange.400',
    icon: faCalendarCircleExclamation,
    tooltipTitle: <>Time to achieve this goal<br/>is coming to an end</>,
  },
  [GoalState.END_DATE_ALREADY_PASSED]: {
    color: 'red.400',
    icon: faCalendarClock,
    tooltipTitle: <>The end date for the goal<br/>has already passed</>,
  },
}

export const GoalItem = observer(function GoalItem({ goal }: Props) {
  const store = useGoalsStore();

  const handleOpenGoal = () => store.editGoal(goal.id);

  const isDone = goal.status === GoalStatus.DONE;
  const isWontDo = goal.status === GoalStatus.WONT_DO;

  const actions = [
    {
      icon: faSquareArrowUpRight,
      title: 'Open',
      command: '↵/⌥O',
      onClick: handleOpenGoal
    },
    {
      icon: faCircleCheck,
      title: isDone ? 'Unmark as done' : 'Done',
      command: '⌥D',
      onClick: () => store.updateGoal({
        ...goal,
        status: isDone ? GoalStatus.TODO : GoalStatus.DONE,
      }),
    },
    {
      icon: faCircleMinus,
      title: isWontDo ? "Unmark as won't do" : "Won't do",
      command: '⌥W',
      onClick: () => store.wontDoSubmitModalOpen(goal),
    },
    {
      icon: faClone,
      title: 'Clone',
      command: '⌥C',
      onClick: () => store.cloneGoal(goal),
    },
    {
      icon: faBoxArchive,
      title: goal.isArchived ? 'Unarchive' : 'Archive',
      command: '⌥A',
      onClick: () => store.updateGoal({
        ...goal,
        isArchived: !goal.isArchived
      }),
    },
    {
      icon: faTrashCan,
      title: 'Delete',
      command: '⌥⌫',
      onClick: async () => {
        if (
          await store.root.confirm({
            title: 'Delete goal',
            type: 'delete',
            content: 'Are you sure you would like to delete this goal?'
          })
        ) {
          await store.deleteGoal(goal.id);
        }
      },
    },
  ];

  const handleChangeStartDate = (date: string) => {
    return store.updateGoal({
      ...goal,
      startDate: date,
      targetDate: DatePickerHelpers.isStartDateAfterEndDate(date, goal.targetDate)
        ? ''
        : goal.targetDate
    });
  };
  const handleChangeTargetDate = (date: string) => {
    return store.updateGoal({ ...goal, targetDate: date });
  };
  const handleChangeTitle = (title: string) => {
    return store.updateGoal({ ...goal, title });
  };
  const handleChangeIcon = (icon: string) => {
    return store.updateGoal({ ...goal, icon: { ...goal.icon, value: icon } });
  };
  const handleColorChange = (color: string) => {
    return store.updateGoal({ ...goal, icon: { ...goal.icon, color } });
  };

  return (
    <Box
      ref={(ref) => store.setGoalRef(goal.id, ref)}
      borderWidth={1}
      borderRadius={8}
      borderColor={
        goal.customFields.state
          ? GOAL_STATE_PARAMS[goal.customFields.state].color
          : 'gray.200'
      }
      p={4}
      w={80}
      mr={6}
      mb={6}
      float='left'
      position='relative'
      cursor='pointer'
      height={124}
      onClick={handleOpenGoal}
    >
      <Flex>
        <GoalEmojiSelect
          goal={goal}
          size={12}
          iconFontSize='3xl'
          statusIconBottom={-0.5}
          statusIconRight={0.5}
          onIconChange={handleChangeIcon}
          onColorChange={handleColorChange}
        />
        <chakra.div ml={2} w='calc(100% - var(--chakra-space-20))'>
          <EditableTitle value={goal.title} idEnding={goal.id} onSave={handleChangeTitle} />
          <Flex mt={1} fontSize='xs' color='gray.500'>
            <chakra.span>All task: {goal.customFields.allTasks.length}</chakra.span>
            <chakra.span ml={2}>
              <FontAwesomeIcon icon={faCircleCheckSolid} color='var(--chakra-colors-blue-400' />{' '}
              {goal.customFields.doneTasks.length}
            </chakra.span>
            <chakra.span ml={2}>
              <FontAwesomeIcon icon={faCircleMinusSolid} color='var(--chakra-colors-gray-400' />{' '}
              {goal.customFields.wontDoTasks.length}
            </chakra.span>
          </Flex>
        </chakra.div>
      </Flex>
      <Flex mt={2} color='gray.500'>
        <Flex flexDirection='column' alignItems='flex-start' width='50%'>
          <Text fontSize='xs' lineHeight={4}>
            Start date:
          </Text>
          <chakra.div mt={1}>
            <DatePicker
              fontSize='xs'
              iconFontSize={14}
              showIconOnlyIfEmpty
              showTooltip
              selectsStart
              value={goal.startDate}
              startDate={goal.startDate}
              endDate={goal.targetDate}
              onChanged={handleChangeStartDate}
            />
          </chakra.div>
        </Flex>
        <Flex flexDirection='column' alignItems='flex-start' width='50%'>
          <Text fontSize='xs' lineHeight={4}>
            Target date:
          </Text>
          <chakra.div mt={1}>
            <DatePicker
              fontSize='xs'
              iconFontSize={14}
              showIconOnlyIfEmpty
              showTooltip
              selectsEnd
              value={goal.targetDate}
              startDate={goal.startDate}
              endDate={goal.targetDate}
              minDate={goal.startDate}
              onChanged={handleChangeTargetDate}
            />
          </chakra.div>
        </Flex>
      </Flex>

      <ActionMenu
        items={actions}
        menuMinWidth={250}
        triggerButtonProps={(isOpen) => ({
          color: isOpen ? 'blue.400' : 'gray.500',
          position: 'absolute',
          top: 3,
          right: 4,
          height: 6,
          _hover: {
            color: 'blue.400',
          },
          _focus: {
            color: 'blue.400',
          },
          _focusVisible: {
            boxShadow: 'none',
            color: 'blue.400',
          }
        })}
        triggerIconFontSize={18}
      />

      {goal.customFields.state && (
        <Tooltip
          label={
            <chakra.span display='flex' fontSize='xs' fontWeight='normal' textAlign='center'>
              {GOAL_STATE_PARAMS[goal.customFields.state].tooltipTitle}
            </chakra.span>
          }
          placement='top'
          offset={[0, 10]}
          hasArrow
        >
          <chakra.div
            w={6}
            h={6}
            bg='white'
            position='absolute'
            top={-3}
            left={-3}
            color={GOAL_STATE_PARAMS[goal.customFields.state].color}
            boxShadow='0px 2px 3px rgba(99, 99, 99, 0.09)'
            borderRadius='full'
            display='flex'
            alignItems='center'
            justifyContent='center'
          >
            <FontAwesomeIcon fontSize={14} icon={GOAL_STATE_PARAMS[goal.customFields.state].icon} />
          </chakra.div>
        </Tooltip>
      )}
    </Box>
  );
});
