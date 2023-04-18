import { observer } from 'mobx-react-lite';
import { Box, chakra, Flex, Text } from '@chakra-ui/react';
import { DatePicker } from "../../../../../shared/DatePicker";
import {
  faBoxArchive,
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
import { GoalDataExtended, GoalStatus } from "../../../types";
import { ActionMenu } from "../../../../../shared/ActionMenu";
import { EditableTitle } from "../../../../../shared/EditableTitle";
import { DatePickerHelpers } from "../../../../../shared/DatePicker/helpers";
import { GoalEmojiSelect } from "../../GoalEmojiSelect";
import { useGoalListStore } from "../store";
import { GoalStateIcon, GOAL_STATE_PARAMS } from "../../../../../shared/GoalStateIcon";

type Props = {
  goal: GoalDataExtended
};

export const GoalItem = observer(function GoalItem({ goal }: Props) {
  const store = useGoalListStore();

  const isDone = goal.status === GoalStatus.DONE;
  const isWontDo = goal.status === GoalStatus.WONT_DO;

  const actions = [
    {
      icon: faSquareArrowUpRight,
      title: 'Open',
      command: '↵/⌥O',
      onClick: () => store.callbacks?.onOpenGoal(goal.id),
    },
    {
      icon: faCircleCheck,
      title: isDone ? 'Unmark as done' : 'Done',
      command: '⌥D',
      onClick: () => store.callbacks?.onUpdateGoal({
        ...goal,
        status: isDone ? GoalStatus.TODO : GoalStatus.DONE,
      }),
    },
    {
      icon: faCircleMinus,
      title: isWontDo ? "Unmark as won't do" : "Won't do",
      command: '⌥W',
      onClick: () => store.callbacks?.onWontDo(goal),
    },
    {
      icon: faClone,
      title: 'Clone',
      command: '⌥C',
      hidden: !store.hasClone,
      onClick: () => store.cloneGoal(goal),
    },
    {
      icon: faBoxArchive,
      title: goal.isArchived ? 'Unarchive' : 'Archive',
      command: '⌥A',
      onClick: () => store.callbacks?.onUpdateGoal({
        ...goal,
        isArchived: !goal.isArchived
      }),
    },
    {
      icon: faTrashCan,
      title: 'Delete',
      command: '⌫ / ⌥⌫',
      onClick: async () => {
        if (
          await store.root.confirm({
            title: 'Delete goal',
            type: 'delete',
            content: 'Are you sure you would like to delete this goal?'
          })
        ) {
          await store.callbacks?.onDeleteGoal(goal.id);
        }
      },
    },
  ];

  const handleChangeStartDate = (date: string) => {
    return store.callbacks?.onUpdateGoal({
      ...goal,
      startDate: date,
      targetDate: DatePickerHelpers.isStartDateAfterEndDate(date, goal.targetDate)
        ? ''
        : goal.targetDate
    });
  };
  const handleChangeTargetDate = (date: string) => {
    return store.callbacks?.onUpdateGoal({ ...goal, targetDate: date });
  };
  const handleChangeTitle = (title: string) => {
    return store.callbacks?.onUpdateGoal({ ...goal, title });
  };
  const handleChangeIcon = (icon: string) => {
    return store.callbacks?.onUpdateGoal({ ...goal, icon: { ...goal.icon, value: icon } });
  };
  const handleColorChange = (color: string) => {
    return store.callbacks?.onUpdateGoal({ ...goal, icon: { ...goal.icon, color } });
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
      onClick={() => store.callbacks?.onOpenGoal(goal.id)}
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
          <GoalStateIcon
              w={6}
              h={6}
              position='absolute'
              top={-3}
              left={-3}
              bg='white'
              boxShadow='0px 2px 3px rgba(99, 99, 99, 0.09)'
              borderRadius='full'
              state={goal.customFields.state}
          />
      )}
    </Box>
  );
});