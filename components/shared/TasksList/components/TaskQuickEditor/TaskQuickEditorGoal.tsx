import { observer } from 'mobx-react-lite';
import { Modes, useTaskQuickEditorStore } from './store';
import { Button, ButtonProps, chakra } from '@chakra-ui/react';
import React from 'react';
import { TaskQuickEditorMenu } from './TaskQuickEditorMenu';
import { GoalIcon } from '../../../../pages/Goals/components/GoalIcon';

export const TaskQuickEditorGoal = observer(function TaskQuickEditorGoal({
  withTitle,
  iconSize = 5,
  iconFontSize = 'sm',
  ...rest
}: {
  withTitle?: boolean;
  iconSize?: number;
  iconFontSize?: string;
} & ButtonProps) {
  const store = useTaskQuickEditorStore();
  const goal = store.modes.goal.selectedGoal;

  return goal ? (
    <Button
      ref={store.modes.goal.setButtonRef}
      onClick={(e) => {
        e.stopPropagation();
        store.suggestionsMenu.openFor(Modes.GOAL);
      }}
      onKeyDown={store.handleKeyDownWithModeMenu(Modes.GOAL)}
      onFocus={store.handleModeFocus(Modes.GOAL)}
      display='flex'
      h={6}
      w={6}
      minW={6}
      justifyContent='center'
      variant='unstyled'
      _focus={{
        outline: 'none',
        boxShadow: 'none',
        bg: goal.icon.color.replace('.200', '.100'),
      }}
      {...rest}
    >
      <TaskQuickEditorMenu
        items={store.modes.goal.suggestions}
        openForMode={Modes.GOAL}
      />
      <chakra.div
        flex={1}
        display='flex'
        alignItems='center'
        justifyContent='center'
      >
        <GoalIcon icon={goal.icon} fontSize={iconFontSize} size={iconSize} />
      </chakra.div>
      {withTitle ? (
        <chakra.span
          fontSize='sm'
          fontWeight='normal'
          pl={1}
          pr={1}
          maxW={28}
          overflow='hidden'
          textOverflow='ellipsis'
        >
          {goal.title}
        </chakra.span>
      ) : null}
    </Button>
  ) : null;
});
