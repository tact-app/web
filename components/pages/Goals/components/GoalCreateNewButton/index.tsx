import { observer } from 'mobx-react-lite';
import { Button, Text, ButtonProps } from '@chakra-ui/react';
import { useGoalsStore } from '../../store';
import React from 'react';
import { HotkeyBlock } from '../../../../shared/HotkeyBlock';
import { Tooltip } from "../../../../shared/Tooltip";

type Props = ButtonProps & {
  withHotkey?: boolean;
  withTooltip?: boolean;
}

export const GoalCreateNewButton = observer(
  function GoalCreateNewButton({ children, withHotkey, withTooltip, ...buttonProps }: Props) {
    const store = useGoalsStore();

    return (
      <>
        <Tooltip
          isDisabled={!withTooltip}
          label='Create goal'
          hotkey={withHotkey ? 'Press N' : ''}
          placement='left'
        >
          <Button
            onClick={store.startGoalCreation}
            size='md'
            minH={8}
            mb={2}
            bg='blue.400'
            color='white'
            _hover={{
              bg: 'blue.500',
            }}
            _focus={{
              boxShadow: 'var(--chakra-shadows-outline)',
              outline: 'none',
            }}
            {...buttonProps}
          >
            {children}
          </Button>
        </Tooltip>
        {withHotkey && !withTooltip && (
          <Text
            fontSize='xs'
            fontWeight='normal'
            lineHeight={4}
            color='gray.400'
            display='flex'
            justifyContent='center'
          >
            Press
            <HotkeyBlock hotkey='N' ml={1} fontSize='xs' lineHeight={4} />
          </Text>
        )}
      </>
    );
  }
);
