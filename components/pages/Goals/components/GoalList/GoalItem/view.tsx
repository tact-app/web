import { observer } from 'mobx-react-lite';
import { Box, chakra, Flex, Text } from '@chakra-ui/react';
import { DatePicker } from '../../../../../shared/DatePicker';
import {
  faCircleCheck as faCircleCheckSolid,
  faCircleMinus as faCircleMinusSolid
} from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useRef } from 'react';
import { ActionMenu } from '../../../../../shared/ActionMenu';
import { EditableTitle } from '../../../../../shared/EditableTitle';
import { GoalEmojiSelect } from '../../GoalEmojiSelect';
import { GoalStateIcon } from '../../../../../shared/GoalStateIcon';
import { useOutsideClick } from '@chakra-ui/react-use-outside-click';
import { getBoxShadowAsBorder } from '../../../../../../helpers/baseHelpers';
import { NavigationDirections } from '../../../../../../types/navigation';
import { useGoalItemStore } from './store';

export const GoalItemView = observer(function GoalItemView() {
  const store = useGoalItemStore();

  const ref = useRef<HTMLDivElement>();

  useOutsideClick({
    enabled: store.isFocused,
    ref,
    handler: () => store.parent.setFocusedGoalId(null),
  });

  const handleSetRef = (element: HTMLDivElement) => {
    ref.current = element;
    store.parent.setGoalRef(store.goal?.id, element);
  };

  return (
    <Box
      ref={handleSetRef}
      borderRadius={8}
      boxShadow={store.boxShadow}
      p={4}
      w={80}
      mr={6}
      mb={6}
      float='left'
      position='relative'
      cursor='pointer'
      height={124}
      tabIndex={0}
      role='button'
      _focus={{
        borderWidth: 0,
        boxShadow: getBoxShadowAsBorder('blue.400', 2)
      }}
      _focusVisible={{
        outline: 'none',
      }}
      onClick={store.handleClick}
      onFocus={store.handleFocus}
    >
      <Flex>
        <GoalEmojiSelect
          ref={store.setEmojiSelectRef}
          goal={store.goal}
          size={12}
          iconFontSize='3xl'
          statusIconBottom={-0.5}
          statusIconRight={0.5}
          tabIndex={-1}
          onToggleOpen={store.handleEmojiPickerToggle}
          onNavigate={store.handleIconNavigate}
          onFocus={store.updateEditedGoal}
          onIconChange={store.handleChangeIcon}
          onColorChange={store.handleColorChange}
        />
        <chakra.div ml={2} w='calc(100% - var(--chakra-space-20))'>
          <EditableTitle
            value={store.goal?.title}
            idEnding={store.goal?.id}
            sharedProps={{ tabIndex: -1 }}
            navDirectionsToResetEditing={
              [NavigationDirections.DOWN, NavigationDirections.LEFT, NavigationDirections.RIGHT]
            }
            onNavigate={store.handleTitleNavigate}
            onSave={store.handleChangeTitle}
            onFocus={store.updateEditedGoal}
            onBlur={store.setGoalAsFocused}
          />
          <Flex mt={1} fontSize='xs' color='gray.500'>
            <chakra.span>All task: {store.goal?.customFields.allTasks.length}</chakra.span>
            <chakra.span ml={2}>
              <FontAwesomeIcon icon={faCircleCheckSolid} color='var(--chakra-colors-blue-400' />{' '}
              {store.goal?.customFields.doneTasks.length}
            </chakra.span>
            <chakra.span ml={2}>
              <FontAwesomeIcon icon={faCircleMinusSolid} color='var(--chakra-colors-gray-400' />{' '}
              {store.goal?.customFields.wontDoTasks.length}
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
              ref={store.setStartDateRef}
              fontSize='xs'
              iconFontSize={14}
              showIconOnlyIfEmpty
              showTooltip
              selectsStart
              tabIndex={-1}
              value={store.goal?.startDate}
              startDate={store.goal?.startDate}
              endDate={store.goal?.targetDate}
              onChanged={store.handleChangeStartDate}
              onFocusToggle={store.handleDatePickerFocus}
              onNavigate={store.handleStartDateNavigate}
            />
          </chakra.div>
        </Flex>
        <Flex flexDirection='column' alignItems='flex-start' width='50%'>
          <Text fontSize='xs' lineHeight={4}>
            Target date:
          </Text>
          <chakra.div mt={1}>
            <DatePicker
              ref={store.setTargetDateRef}
              fontSize='xs'
              iconFontSize={14}
              showIconOnlyIfEmpty
              showTooltip
              selectsEnd
              tabIndex={-1}
              value={store.goal?.targetDate}
              startDate={store.goal?.startDate}
              endDate={store.goal?.targetDate}
              minDate={store.goal?.startDate}
              onChanged={store.handleChangeTargetDate}
              onFocusToggle={store.handleDatePickerFocus}
              onNavigate={store.handleTargetDateNavigate}
            />
          </chakra.div>
        </Flex>
      </Flex>

      <ActionMenu
        items={store.actions}
        menuMinWidth={250}
        triggerButtonProps={(isOpen) => ({
          tabIndex: -1,
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

      {store.goal?.customFields.state && (
        <GoalStateIcon
          w={6}
          h={6}
          position='absolute'
          top={-3}
          left={-3}
          bg='white'
          boxShadow='0px 2px 3px rgba(99, 99, 99, 0.09)'
          borderRadius='full'
          state={store.goal.customFields.state}
        />
      )}
    </Box>
  );
});
